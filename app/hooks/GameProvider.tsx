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
import { GetRaminingScore, IsWinningThrow } from "./selectors";

interface GameContextType {
  state: Game;
  dispatch: React.Dispatch<GameAction>;
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
  RESET_FULL,
  /* GAME LOGIC */
  SET_ACTIVE_TEAM,
  SET_ACTIVE_PLAYER_IN_TEAM,
  ADD_SCORE,
  INCREASE_TEAM_INDEX,
  INCREASE_LEG_INDEX,
  REMOVE_SCORE,
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
  | { type: GameActionType.RESET_FULL }
  /* GAME LOGIC */
  | { type: GameActionType.SET_ACTIVE_TEAM; payload: number }
  | {
      type: GameActionType.SET_ACTIVE_PLAYER_IN_TEAM;
      payload: { teamIdx: number; playerIdx: number };
    }
  | {
      type: GameActionType.ADD_SCORE;
      payload: {
        score: number;
        thrownDartsToCheckout: number;
        teamId: number;
        player: Player;
      };
    }
  | { type: GameActionType.INCREASE_TEAM_INDEX }
  | { type: GameActionType.INCREASE_LEG_INDEX }
  | { type: GameActionType.REMOVE_SCORE };

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
      const startingTeamIdx = state.settings.randomStartingTeam
        ? Math.floor(Math.random() * state.teams.length)
        : state.settings.startingTeam ?? 0; // Ha nincs startingTeam, 0

      const newGame: Game = {
        ...state,
        teams: state.teams.map((team) => ({
          ...team,
          wins: 0,
          currPlayerIdx: 0,
        })),
        scores: [],
        currLegIdx: 0,
        currTeamIdx: startingTeamIdx,
        gameState: GameState.Running,
        winnerTeamIdx: undefined,
      };

      localStorage.setItem("match", JSON.stringify(newGame));

      return newGame;
    }
    case GameActionType.LOAD_GAME: {
      const ls = localStorage.getItem("match");

      const isValidGame = (obj: unknown): obj is Game => {
        if (typeof obj !== "object" || obj === null) return false;

        const gameObj = obj as Partial<Game>;

        if (
          !Array.isArray(gameObj.teams) ||
          !gameObj.teams.every(
            (team) =>
              typeof team.teamId === "number" &&
              Array.isArray(team.players) &&
              team.players.every(
                (player) => player && "playerId" in player && "name" in player
              ) &&
              typeof team.currPlayerIdx === "number" &&
              typeof team.wins === "number"
          )
        )
          return false;

        if (!Array.isArray(gameObj.scores)) return false;

        const settings = gameObj.settings;
        if (
          !settings ||
          typeof settings.startingScore !== "number" ||
          typeof settings.numberOfLegs !== "number" ||
          typeof settings.startingTeam !== "number" ||
          typeof settings.randomStartingTeam !== "boolean" ||
          typeof settings.gameMode !== "string" ||
          typeof settings.checkOutMode !== "string"
        )
          return false;

        if (
          typeof gameObj.currLegIdx !== "number" ||
          typeof gameObj.currTeamIdx !== "number" ||
          typeof gameObj.gameState !== "string"
        )
          return false;

        return true;
      };

      if (ls) {
        try {
          const parsedGame = JSON.parse(ls);
          if (isValidGame(parsedGame)) {
            return parsedGame;
          } else {
            localStorage.setItem("match", JSON.stringify(InitialGame));
            return InitialGame;
          }
        } catch {
          localStorage.setItem("match", JSON.stringify(InitialGame));
          return InitialGame;
        }
      }

      return InitialGame;
    }

    case GameActionType.SET_ACTIVE_TEAM: {
      return {
        ...state,
        currTeamIdx: action.payload,
      };
    }
    case GameActionType.RESET_FULL: {
      localStorage.removeItem("match");
      localStorage.removeItem("players");
      const players = [
        { playerId: 1, name: "Laci" },
        { playerId: 2, name: "Huba" },
        { playerId: 3, name: "Attila" },
        { playerId: 4, name: "Noémi" },
        { playerId: 5, name: "Bea" },
        { playerId: 6, name: "Gábor" },
        { playerId: 7, name: "Nolan" },
        { playerId: 8, name: "Dani" },
        { playerId: 9, name: "Ádám" },
        { playerId: 10, name: "Andris" },
        { playerId: 11, name: "Máté" },
      ];

      // JSON stringgé alakítás és elmentés localStorage-ba
      localStorage.setItem("players", JSON.stringify(players));

      return InitialGame;
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

    case GameActionType.ADD_SCORE: {
      const { score, thrownDartsToCheckout, teamId, player } = action.payload;

      // Ha már vége a játéknak, ne csinálj semmit
      if (state.gameState === GameState.Over) return state;

      const remainingScore = GetRaminingScore(state, state.currTeamIdx);
      const newRemainingScore = remainingScore - score;
      const isLegWin = newRemainingScore === 0;
      const isGameWin = IsWinningThrow(state, score);

      const newScore: Score = {
        scoreId: state.scores.length,
        player: player,
        teamId: teamId,
        legId: state.currLegIdx,
        score: score,
        remainingScore: newRemainingScore,
        checkOutAttempts: Number(thrownDartsToCheckout),
      };

      let newState: Game = {
        ...state,
        scores: [...state.scores, newScore],
      };

      if (isLegWin) {
        // Ez a dobás leg-et nyer (lehet hogy a teljes játékot is)
        const winningTeamIdx = state.currTeamIdx;
        const nextLegStartingTeamIdx =
          (winningTeamIdx + 1) % state.teams.length;

        newState = {
          ...newState,
          gameState: isGameWin ? GameState.Over : state.gameState, // ✨ Ha teljes játékot nyer, állítsd Over-re
          winnerTeamIdx: isGameWin ? winningTeamIdx : state.winnerTeamIdx, // ✨ Győztes csapat beállítása
          currLegIdx: isGameWin ? state.currLegIdx : state.currLegIdx + 1,
          currTeamIdx: nextLegStartingTeamIdx,
          teams: state.teams.map((team, idx) => {
            if (idx === winningTeamIdx) {
              return {
                ...team,
                wins: team.wins + 1,
                currPlayerIdx: (team.currPlayerIdx + 1) % team.players.length,
              };
            } else {
              return {
                ...team,
                currPlayerIdx: team.currPlayerIdx,
              };
            }
          }),
        };
      } else {
        // Ez a dobás nem nyer leg-et, léptetjük a következő játékosra/csapatra
        const currentTeam = state.teams[state.currTeamIdx];
        const nextPlayerIdx =
          (currentTeam.currPlayerIdx + 1) % currentTeam.players.length;
        const nextTeamIdx = (state.currTeamIdx + 1) % state.teams.length;

        newState = {
          ...newState,
          currTeamIdx: nextTeamIdx,
          teams: state.teams.map((team, idx) => {
            if (idx === state.currTeamIdx) {
              return {
                ...team,
                currPlayerIdx: nextPlayerIdx,
              };
            }
            return team;
          }),
        };
      }

      localStorage.setItem("match", JSON.stringify(newState));
      return newState;
    }

    case GameActionType.REMOVE_SCORE: {
      if (state.scores.length <= 0) return state;

      const removedScore = state.scores[state.scores.length - 1];
      const newScoreHistory = state.scores.slice(0, -1);

      const newTeams: Team[] = state.teams.map((team) =>
        team.teamId === removedScore?.teamId
          ? removedScore.remainingScore === 0
            ? {
                ...team,
                currPlayerIdx:
                  (team.currPlayerIdx - 1 + team.players.length) %
                  team.players.length,
                wins: Math.max(0, team.wins - 1),
              }
            : {
                ...team,
                currPlayerIdx:
                  (team.currPlayerIdx - 1 + team.players.length) %
                  team.players.length,
              }
          : team
      );

      const newCurrTeamIdx =
        (state.currTeamIdx - 1 + state.teams.length) % state.teams.length;

      const newCurrLegIdx =
        removedScore?.remainingScore === 0
          ? state.currLegIdx - 1
          : state.currLegIdx;

      const newState: Game = {
        ...state,
        scores: newScoreHistory,
        teams: newTeams,
        currTeamIdx: newCurrTeamIdx,
        currLegIdx: newCurrLegIdx,
      };

      localStorage.setItem("match", JSON.stringify(newState));

      return newState;
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
  return (
    <GameContext.Provider value={{ state, dispatch }}>
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
