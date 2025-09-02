"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
    CheckoutModeType,
  Game,
  GameModeType,
  GameState,
  Player,
  Score,
  Settings,
  Team,
} from "../types/types";
import { Stack } from "./Stack";
import { GetRaminingScore, GetWinnerTeam, IsWinningThrow } from "./selectors";
import { StatsCalculator } from "./Stats";

interface GameContextType {
  state: Game;
  dispatch: React.Dispatch<GameAction>;
}

const gameHistory = new Stack<Game>();

export enum GameActionType {
  /* SETTINGS */
  SET_SETTINGS,
  SET_TEAMS,
  SET_GAME_MODE,
  SET_CHECKOUT_MODE,
  SET_STARTING_SCORE,
  SET_NUMBER_OF_LEGS,
  SET_STARTING_TEAM,
  SET_RANDOM_STARTING_TEAM,
  SET_TEAM_COLOR,
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
  | { type: GameActionType.SET_CHECKOUT_MODE; payload: CheckoutModeType }
  | { type: GameActionType.SET_NUMBER_OF_LEGS; payload: number }
  | { type: GameActionType.SET_STARTING_TEAM; payload: number }
  | { type: GameActionType.SET_STARTING_SCORE; payload: number }
  | { type: GameActionType.SET_RANDOM_STARTING_TEAM; payload: boolean }
  | { type: GameActionType.SET_TEAM_COLOR; payload: { teamId: number; color: string }}
  | { type: GameActionType.SET_SETTINGS; payload: Settings }
  /* TEAM MANAGEMENT */
  | { type: GameActionType.ADD_TEAM }
  | { type: GameActionType.ADD_PLAYER_TO_TEAM; payload: { teamIdx: number; player: Player }}
  | { type: GameActionType.ADD_EMPTY_PLAYER; payload: number }
  | { type: GameActionType.REMOVE_TEAM; payload: number }
  | { type: GameActionType.REMOVE_PLAYER_FROM_TEAM; payload: { teamIdx: number; playerIdx: number } }
  | { type: GameActionType.UPDATE_PLAYER_IN_TEAM; payload: { teamIdx: number; playerIdx: number; newPlayer: Player } }
  /* GAME MANAGEMENT */
  | { type: GameActionType.CREATE_GAME }
  | { type: GameActionType.SAVE_GAME }
  | { type: GameActionType.LOAD_GAME }
  | { type: GameActionType.RESET_FULL }
  /* GAME LOGIC */
  | { type: GameActionType.SET_ACTIVE_TEAM; payload: number }
  | { type: GameActionType.SET_ACTIVE_PLAYER_IN_TEAM; payload: { teamIdx: number; playerIdx: number } }
  | { type: GameActionType.ADD_SCORE; payload: { score: number; throws: number; checkoutAttempts: number; teamId: number; player: Player } }
  | { type: GameActionType.INCREASE_TEAM_INDEX }
  | { type: GameActionType.INCREASE_LEG_INDEX }
  | { type: GameActionType.REMOVE_SCORE };


const InitialGame: Game = {
  teams: [],
  scores: [],
  settings: {
    gameMode: GameModeType.FirstTo,
    checkoutMode: CheckoutModeType.Double,
    startingScore: 501,
    numberOfLegs: 3,
    startingTeam: 0,
    randomStartingTeam: false,
    displayScore: false,
    askNumberOfThrows: false,
  },
  currLegIdx: 0,
  currTeamIdx: 0,
  gameState: GameState.Initialized,
  winnerTeamIdx: undefined,
};


const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Inicializáló függvény, ami betölti a localStorage-ból a játékot
  const initializer = (): Game => {
    // Csak a böngészőben fut le (Next.js SSR kompatibilitás)
    if (typeof window === 'undefined') {
      return InitialGame;
    }
    
    const saved = localStorage.getItem("game");
    if (saved) {
      try {
        const parsedGame = JSON.parse(saved) as Game;
        
        // Validáljuk, hogy a parsolt game érvényes-e
        if (parsedGame && parsedGame.teams && parsedGame.scores && parsedGame.settings) { 
          return parsedGame;
        }
      } catch (error) {
        console.warn("Nem sikerült betölteni a mentett játékot:", error);
        // Ha hiba van a localStorage-ban, töröljük a rossz adatot
        localStorage.removeItem("game");
      }
    }
    return InitialGame;
  };

  const [state, dispatch] = useReducer(gameReducer, undefined, initializer);

  // Minden state változáskor mentjük a localStorage-be
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("game", JSON.stringify(state));
    }
  }, [state]);

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


const gameReducer = (state: Game, action: GameAction): Game => {
    switch (action.type) {
        case GameActionType.SET_SETTINGS: {
            const settings = action.payload;
            return {...state, settings}
        }
        case GameActionType.SET_TEAMS: {
          const teams = action.payload;
          return {...state, teams}
        }
        case GameActionType.LOAD_GAME: {
          // Explicit betöltés localStorage-ból
          if (typeof window !== 'undefined') {
            const game = localStorage.getItem("game");
            if (game) {
              try {
                const parsedGame = JSON.parse(game);
                return parsedGame;
              } catch (error) {
                console.warn("Hiba a játék betöltésekor:", error);
              }
            }
          }
          return state;
        }
        case GameActionType.CREATE_GAME: {
            const resetTeams: Team[] = state.teams.map(team => ({
              teamId: team.teamId,
              wins: 0,
              currPlayerIdx: 0,
              players: team.players.map(player => ({
                playerId: player.playerId,
                name: player.name
              }))
            }));

            const newState: Game = {
              ...InitialGame,
              teams: resetTeams,
              settings: state.settings,
              gameState: GameState.Running,
              currLegIdx: 0
            };
            if (typeof window !== 'undefined') {
              localStorage.setItem("game", JSON.stringify(newState));
            }

            gameHistory.reset();
            gameHistory.push(newState);
            return newState;
        }
        case GameActionType.SET_ACTIVE_TEAM: {
            const teamId = action.payload;
            return { ...state, currTeamIdx: teamId };
        }
        case GameActionType.SET_ACTIVE_PLAYER_IN_TEAM: {
            const { teamIdx, playerIdx } = action.payload;
            return {
                ...state,
                teams: state.teams.map((team, tIdx) => tIdx === teamIdx 
                    ? {...team}
                    : {...team, currPlayerIdx: playerIdx})
            }
        }
        case GameActionType.ADD_SCORE: {
            const { score, throws, checkoutAttempts, teamId, player } = action.payload;

            if(state.gameState === GameState.Over) return state;
            const remainingScore = GetRaminingScore(state, teamId);
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
                checkoutAttempts: Number(checkoutAttempts),
                throws: throws
            }

            const updatedScores = [...state.scores, newScore];
            const currTeam = state.teams[state.currTeamIdx];
            const currPlayer = currTeam.players[currTeam.currPlayerIdx];


            const newTeam: Team = {
                ...currTeam,
                wins: isLegWin ? currTeam.wins + 1 : currTeam.wins,
                currPlayerIdx: (currTeam.currPlayerIdx + 1) % currTeam.players.length,
            }

            let nextTeamIdx: number = 
              isLegWin
                ? (state.settings.startingTeam + state.currLegIdx + 1) % state.teams.length
                : (state.currTeamIdx + 1) % state.teams.length;

            const newState: Game = {
                ...state,
                scores: updatedScores,
                currLegIdx: isGameWin ? state.currLegIdx : isLegWin ? state.currLegIdx + 1 : state.currLegIdx,
                currTeamIdx: isGameWin ? state.currTeamIdx : nextTeamIdx,
                teams: state.teams.map((team, tIdx) => 
                    tIdx === state.currTeamIdx
                        ? newTeam
                        : team
                ),
                gameState: isGameWin ? GameState.Over : state.gameState,
                winnerTeamIdx: isGameWin ? GetWinnerTeam(state)?.teamId : state.winnerTeamIdx
            }

            if (typeof window !== 'undefined') {
              localStorage.setItem("game", JSON.stringify(newState));
            }

            gameHistory.push(newState);
            return newState;
        }
        case GameActionType.REMOVE_SCORE: {       
            gameHistory.pop();
            const newState = gameHistory.peek();
            console.log(gameHistory);
            if (!newState) return state;
            return newState;
        }

        default:
            return state;
    }
}