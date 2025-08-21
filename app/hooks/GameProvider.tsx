"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  CheckOutModeType,
  Game,
  GameModeType,
  GameState,
  Player,
  Score,
  Settings,
  Team,
} from "../types/types";
import { message } from "antd";

interface GameStats {}

interface GameContextType {
  state: Game;
  dispatch: React.Dispatch<GameAction>;
  stats: GameStats;
}

export enum GameActionType {
  /* SETTINGS */
  SET_TEAMS,
  SET_GAME_MODE,
  SET_CHECKOUT_MODE,
  SET_STARTING_SCORE,
  SET_NUMBER_OF_LEGS,
  SET_STARTING_TEAM,
  SET_RANDOM_STARTING_TEAM,
  /* TEAM MANAGEMENT */
  ADD_TEAM,
  REMOVE_TEAM,
  ADD_PLAYER_TO_TEAM,
  ADD_EMPTY_PLAYER,
  REMOVE_PLAYER_FROM_TEAM,
  UPDATE_PLAYER_IN_TEAM,
  /* GAME MANAGEMENT */
  CREATE_GAME,
  SAVE_GAME,
  LOAD_GAME,
  /* GAME LOGIC */
  SET_ACTIVE_TEAM,
  SET_ACTIVE_PLAYER_IN_TEAM,
}

type GameAction =
  /* SETTINGS */
  | { type: GameActionType.SET_TEAMS; payload: Team[] }
  | { type: GameActionType.SET_GAME_MODE; payload: GameModeType }
  | { type: GameActionType.SET_CHECKOUT_MODE; payload: CheckOutModeType }
  | { type: GameActionType.SET_NUMBER_OF_LEGS; payload: number }
  | { type: GameActionType.SET_STARTING_TEAM; payload: number }
  | { type: GameActionType.SET_STARTING_SCORE; payload: number }
  | { type: GameActionType.SET_RANDOM_STARTING_TEAM; payload: boolean }
  /* TEAM MANAGEMENT */
  | { type: GameActionType.ADD_TEAM }
  | {
      type: GameActionType.ADD_PLAYER_TO_TEAM;
      payload: { teamIdx: number; player: Player };
    }
  | { type: GameActionType.ADD_EMPTY_PLAYER; payload: number }
  | { type: GameActionType.REMOVE_TEAM; payload: number }
  | {
      type: GameActionType.REMOVE_PLAYER_FROM_TEAM;
      payload: { teamIdx: number; playerIdx: number };
    }
  | {
      type: GameActionType.UPDATE_PLAYER_IN_TEAM;
      payload: { teamIdx: number; playerIdx: number; newPlayer: Player };
    }
  /* GAME MANAGEMENT */
  | { type: GameActionType.CREATE_GAME }
  | { type: GameActionType.SAVE_GAME }
  | { type: GameActionType.LOAD_GAME }
  | { type: GameActionType.SET_ACTIVE_TEAM; payload: number }
  | {
      type: GameActionType.SET_ACTIVE_PLAYER_IN_TEAM;
      payload: { teamIdx: number; playerIdx: number };
    };

const gameReducer = (state: Game, action: GameAction): Game => {
  switch (action.type) {
    case GameActionType.SET_TEAMS: {
      return { ...state, teams: action.payload };
    }
    case GameActionType.SET_GAME_MODE: {
      return {
        ...state,
        settings: { ...state.settings, gameMode: action.payload },
      };
    }
    case GameActionType.SET_CHECKOUT_MODE: {
      return {
        ...state,
        settings: { ...state.settings, checkOutMode: action.payload },
      };
    }
    case GameActionType.SET_NUMBER_OF_LEGS: {
      return {
        ...state,
        settings: { ...state.settings, numberOfLegs: action.payload },
      };
    }
    case GameActionType.SET_STARTING_TEAM: {
      return {
        ...state,
        settings: { ...state.settings, startingTeam: action.payload },
        currTeamIdx: action.payload,
      };
    }
    case GameActionType.SET_STARTING_SCORE: {
      return {
        ...state,
        settings: { ...state.settings, startingScore: action.payload },
      };
    }

    case GameActionType.SET_RANDOM_STARTING_TEAM: {
      const randomStartingTeam = action.payload;
      return {
        ...state,
        settings: { ...state.settings, randomStartingTeam: randomStartingTeam },
      };
    }

    case GameActionType.ADD_TEAM: {
      const newTeam: Team = {
        teamId: state.teams.length,
        players: [],
        currPlayerIdx: 0,
        wins: 0,
      };
      return {
        ...state,
        teams: [...state.teams, newTeam],
      };
    }
    case GameActionType.ADD_PLAYER_TO_TEAM: {
      const { teamIdx, player } = action.payload;

      return {
        ...state,
        teams: state.teams.map((team, idx) =>
          idx === teamIdx
            ? {
                ...team,
                players: [...team.players, player],
              }
            : team
        ),
      };
    }
    case GameActionType.ADD_EMPTY_PLAYER: {
      const newPlayer: Player = {
        playerId: null,
        name: "",
      };

      return {
        ...state,
        teams: state.teams.map((team, teamIdx) =>
          teamIdx === action.payload
            ? { ...team, players: [...team.players, newPlayer] } // ✅ a players tömbbe tesszük
            : team
        ),
      };
    }
    case GameActionType.REMOVE_TEAM: {
      const updatedTeams = state.teams
        .filter((_, idx) => idx !== action.payload)
        .map((team, idx) => ({
          ...team,
          teamId: idx,
        }));

      return { ...state, teams: updatedTeams };
    }
    case GameActionType.REMOVE_PLAYER_FROM_TEAM: {
      const { teamIdx, playerIdx } = action.payload;

      return {
        ...state,
        teams: state.teams.map((team, idx) => {
          if (idx === teamIdx) {
            if (team.players.length <= 1) {
              return team;
            }

            return {
              ...team,
              players: team.players.splice(playerIdx, 1),
            };
          }
          return { ...team };
        }),
      };
    }
    case GameActionType.UPDATE_PLAYER_IN_TEAM: {
      const { teamIdx, playerIdx, newPlayer } = action.payload;

      return {
        ...state,
        teams: state.teams.map((team, tIdx) => {
          if (tIdx === teamIdx) {
            const players = [...team.players];
            players[playerIdx] = newPlayer;
            return { ...team, players: players };
          }
          return team;
        }),
      };
    }
    case GameActionType.CREATE_GAME: {
      localStorage.setItem("match", JSON.stringify(state));
      return state;
    }
    case GameActionType.LOAD_GAME: {
      const ls = localStorage.getItem("match");
      if (ls) {
        const parsedGame = JSON.parse(ls);
        return parsedGame;
      }
      return InitialGame;
    }
    case GameActionType.SET_ACTIVE_TEAM: {
      return {
        ...state,
        currTeamIdx: action.payload,
      };
    }
    case GameActionType.SET_ACTIVE_PLAYER_IN_TEAM: {
      const { teamIdx, playerIdx } = action.payload;

      return {
        ...state,
        teams: state.teams.map((team, teamIndex) => {
          if (teamIdx === teamIndex) {
            return {
              ...team,
              currPlayerIdx: playerIdx,
            };
          }
          return team;
        }),
      };
    }
    default:
      return state;
  }
};

const InitialGame: Game = {
  teams: [],
  scores: [],
  settings: {
    gameMode: GameModeType.FirstTo,
    checkOutMode: CheckOutModeType.Double,
    startingScore: 501,
    numberOfLegs: 3,
    startingTeam: 0,
    randomStartingTeam: false,
  },
  currLegIdx: 0,
  currTeamIdx: 0,
  gameState: GameState.Initialized,
  winnerTeamIdx: undefined,
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, InitialGame);
  const stats = useMemo<GameStats>(() => ({}), [state]);
  return (
    <GameContext.Provider value={{ state, dispatch, stats }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
