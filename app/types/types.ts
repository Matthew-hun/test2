import { ReactNode } from "react";
import { Stack } from "../hooks/Stack";

export enum CompareTypes {
  NoCompare = "No compare",
  CompareToTeam = "Compare to Team",
  CompareToEveryBody = "Compare to Everybody"
}

export enum GameModeType {
  FirstTo = "First to",
  BestOf = "BestOf",
}
export enum CheckoutModeType {
  Simple = "Simple",
  Double = "Double",
  Triple = "Triple",
}
export enum GameState {
  Initialized = "Initialized",
  Running = "Running",
  Over = "Over",
}

export type CheckoutStatsType = {
  attempts: number;
  successfull: number;
  rate: number;
};

export type Player = {
  playerId: number;
  name: string;
};

export type Team = {
  teamId: number;
  players: Player[];
  currPlayerIdx: number;
  wins: number;
};

export type Settings = {
  gameMode: GameModeType;
  startingScore: number;
  checkoutMode: CheckoutModeType;
  numberOfLegs: number;
  startingTeam: number;
  randomStartingTeam: boolean;
  displayScore: boolean;
  askNumberOfThrows: boolean;
};

export type Score = {
  scoreId: number;
  player: Player;
  teamId: number;
  legId: number;
  score: number;
  remainingScore: number;
  checkoutAttempts: number;
  throws: number;
};

export type LegData = {
  legId: number;
  legWinnerTeamId: number;
};

export type Game = {
  teams: Team[];
  scores: Score[];
  settings: Settings;
  currLegIdx: number;
  currTeamIdx: number;
  gameState: GameState;
  winnerTeamIdx: number | undefined;
};

export type Badge = {
  name: string;
  desc: string;
  icon: ReactNode;
  color: string;
}