import { Game, GameModeType, Player, Score, Team } from "../types/types";
import { Checkout, dartsCheckouts } from "./checkOuts";
import { StatsCalculator } from "./Stats";

export const GetRaminingScore = (state: Game, teamIdx: number): number => {
  if (!state || state.scores.length === 0) return state.settings.startingScore;

  const totalScores = state.scores.filter(
    (score) => score.legId === state.currLegIdx && score.teamId === teamIdx
  );
  const totalScored = totalScores.reduce((sum, s) => sum + s.score, 0);
  return state.settings.startingScore - totalScored;
};

export const GetLegScoreHistory = (
  state: Game,
  teamIdx: number,
  legIdx: number
): Score[] => {
  if (!state || state.scores.length <= 0) return [];

  return state.scores.filter(
    (score) => score.teamId == teamIdx && score.legId == legIdx
  );
};

export const GetScoreHistory = (
  state: Game,
  teamId: number,
  playerId: number
): Score[] => {
  if (!state || state.scores.length <= 0) return [];

  return state.scores.filter(
    (score) => score.teamId == teamId && score.player.playerId == playerId
  );
};

export const CalcMaxNumberOfLegs = (state: Game): number => {
  switch (state.settings.gameMode) {
    case GameModeType.FirstTo:
      return (state.settings.numberOfLegs - 1) * state.teams.length + 1;
    case GameModeType.BestOf:
      return state.settings.numberOfLegs;
    default:
      return state.settings.numberOfLegs;
  }
};

export const CalcWinsNeeded = (state: Game): number => {
  if (!state) return 0;

  switch (state.settings.gameMode) {
    case GameModeType.FirstTo:
      return state.settings.numberOfLegs;
    case GameModeType.BestOf:
      return Math.ceil(state.settings.numberOfLegs / 2);

    default:
      return 0;
  }
};

export const GetGreatestScoredPlayer = (state: Game): {player: Player, teamId: number, score: number} | undefined => {
  if (state.scores.length <= 0) return;

  let greatestScore = 0;
  let player;
  let teamId;

  state.scores.forEach((score) => {
    if (score.score > greatestScore) {
      greatestScore = score.score;
      player = score.player;
      teamId = score.teamId;
    }
  });


  if (player === undefined || teamId === undefined) return undefined;
  return { player, teamId: teamId, score: greatestScore };
};

export const GetGreatestScoredPlayerInLeg = (
  state: Game
): {player: Player, score: number} | undefined => {
  if (state.scores.length <= 0) return undefined;

  let greatestScore = 0;
  let player;

  state.scores.forEach((score) => {
    if (score.score > greatestScore && score.legId === state.currLegIdx) {
      greatestScore = score.score;
      player = score.player;
    }
  });

  if (!player) return;
  return { player, score: greatestScore };
};

export const IsWinningThrow = (state: Game, score: number): boolean => {
  if (!state) return false;

  // Először ellenőrizzük, hogy ez a dobás leg-et nyer-e
  const remainingScore = GetRaminingScore(state, state.currTeamIdx);
  const newRemainingScore = remainingScore - score;
  const isLegWin = newRemainingScore === 0;

  // Ha ez a dobás nem nyer leg-et, akkor biztosan nem over a játék
  if (!isLegWin) return false;

  switch (state.settings.gameMode) {
    case GameModeType.FirstTo:
      // Ha ez a dobás megnyeri a leg-et, akkor a jelenlegi csapat wins-e + 1 lesz
      const newWins = state.teams[state.currTeamIdx].wins + 1;
      return newWins >= state.settings.numberOfLegs;

    case GameModeType.BestOf:
      // BestOf esetén a játék akkor ér véget, ha valaki több mint a fele leg-et megnyerte
      const requiredWins = Math.ceil(state.settings.numberOfLegs / 2);
      const newWinsForBestOf = state.teams[state.currTeamIdx].wins + 1;
      return newWinsForBestOf >= requiredWins;

    default:
      return false;
  }
};

export const GetCheckOut = (state: Game, teamId: number) => {
  const remainingScore = GetRaminingScore(state, teamId);

  return dartsCheckouts.find(
    (checkOut: Checkout) => checkOut.remaining === remainingScore
  )?.checkout;
};

export const GetWinnerTeam = (state: Game): Team | undefined => {
  if (!state || state.scores.length <= 0) return;

  let teamWins = 0;
  let winnerTeam: Team = {} as Team;
  state.teams.forEach((team) => {
    if (team.wins > teamWins) {
      teamWins = team.wins;
      winnerTeam = team;
    }
  });

  return winnerTeam;
};

export const CalcSixties = (state: Game, teamId: number): number => {
  if (!state || state.scores.length <= 0) return 0;

  let numberOfSixties = 0;
  state.scores.forEach((score) => {
    if (score.teamId === teamId && score.score >= 60 && score.score < 120) {
        numberOfSixties++;
    }
  });

  return numberOfSixties;
};

export const CalcOneTwenties = (state: Game, teamId: number): number => {
  if (!state || state.scores.length <= 0) return 0;

  let numberOfOneTwenties = 0;
  state.scores.forEach((score) => {
    if (score.teamId === teamId && score.score >= 120 && score.score < 180) {
        numberOfOneTwenties++;
    }
  });

  return numberOfOneTwenties;
};

export const CalcOneEighties = (state: Game, teamId: number): number => {
  if (!state || state.scores.length <= 0) return 0;

  let numberOfOneEighties = 0;
  state.scores.forEach((score) => {
    if (score.teamId === teamId && score.score == 180) {
        numberOfOneEighties++;
    }
  });

  return numberOfOneEighties;
};

export const CalcPlayerGreatestScore = (state: Game, teamId: number, playerId: number) => {

}

export const CalcPlayerLegAvg = (state: Game, teamId: number, playerId: number) => {

}

export const CalcPlayerGameAvg = (state: Game, teamId: number, playerId: number) => {

}

export const CalcPlayerCheckoutRate = (state: Game, teamId: number, playerId: number) => {

}

export const CalcPlayerSuccessfullCheckouts = (state: Game, teamId: number, playerId: number) => {

}

export const CalcPlayerSixties = (state: Game, teamId: number, playerId: number) => {

}

export const CalcPlayerOneTwenties = (state: Game, teamId: number, playerId: number) => {

}

export const CalcPlayerOneEighties = (state: Game, teamId: number, playerId: number) => {

}