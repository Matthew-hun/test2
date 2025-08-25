import { Game, GameModeType, Player, Score } from "../types/types";

export const GetRaminingScore = (state: Game, teamIdx: number): number => {
    if (!state || state.scores.length === 0) return state.settings.startingScore;

    const totalScores = state.scores.filter((score) =>
        score.legId === state.currLegIdx &&
        score.teamId === teamIdx
    );

    const totalScored = totalScores.reduce((sum, s) => sum + s.score, 0);
    return state.settings.startingScore - totalScored;
}

export const GetLegScoreHistory = (state: Game, teamIdx: number, legIdx: number): Score[] => {
    if (!state || state.scores.length <= 0) return [];

    return state.scores.filter((score) => score.teamId == teamIdx && score.legId == legIdx);
}

export const GetScoreHistory = (state: Game, teamIdx: number): Score[] => {
    if (!state || state.scores.length <= 0) return [];

    return state.scores.filter((score) => score.teamId == teamIdx);
}

export const CalcMaxNumberOfLegs = (state: Game): number => {
    switch (state.settings.gameMode) {
        case GameModeType.FirstTo:
            return (state.settings.numberOfLegs - 1) * state.teams.length + 1;
        case GameModeType.BestOf:
            return state.settings.numberOfLegs
        default:
            return state.settings.numberOfLegs;
    }
}

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
}

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
}

export const CalcLegAvg = (state: Game, teamId: number, legId?: number): number => {
    if (!state) return 0;

    let totalScore = 0;
    let totalThrows = 0;
    const targetLeg = legId ?? state.currLegIdx;

    state.scores.forEach((score) => {
        if (score.teamId === teamId && score.legId === targetLeg) {
            totalScore += score.score;
            totalThrows++;
        }
    });


    return totalThrows > 0 ? Number((totalScore / totalThrows).toFixed(2)) : 0;
}

export const CalcPlayerLegAvg = (state: Game, teamId: number, playerId: number, legId?: number): number => {
    if (!state) return 0;

    let totalScore = 0;
    let totalThrows = 0;
    const targetLeg = legId ?? state.currLegIdx;

    state.scores.forEach((score) => {
        if (score.teamId === teamId && score.player.playerId === playerId && score.legId === targetLeg) {
            totalScore += score.score;
            totalThrows++;
        }
    });


    return totalThrows > 0 ? Number((totalScore / totalThrows).toFixed(2)) : 0;
}

export const CalcGameAvg = (state: Game, teamId: number): number => {
    if (!state) return 0;

    let totalScore = 0;
    let totalThrows = 0;

    state.scores.forEach((score) => {
        if (score.teamId === teamId) {
            totalScore += score.score;
            totalThrows++;
        }
    });


    return totalThrows > 0 ? Number((totalScore / totalThrows).toFixed(2)) : 0;
}

export const CalcPlayerGameAvg = (state: Game, teamId: number, playerId: number): number => {
    if (!state) return 0;

    let totalScore = 0;
    let totalThrows = 0;

    state.scores.forEach((score) => {
        if (score.teamId === teamId && score.player.playerId === playerId) {
            totalScore += score.score;
            totalThrows++;
        }
    });


    return totalThrows > 0 ? Number((totalScore / totalThrows).toFixed(2)) : 0;
}

export const CalcCheckoutRate = (state: Game, teamId: number): { won: number; tries: number; rate: number } => {
    if (!state) return { won: 0, tries: 0, rate: 0 };

    let won = 0;
    let tries = 0;

    state.scores.forEach((score) => {
        if (score.teamId === teamId) {
            if (score.remainingScore === 0) {
                won++;
                tries += score.checkOutAttempts;
            } else {
                tries += score.checkOutAttempts;
            }
        }
    });

    return tries > 0
        ? { won, tries, rate: Number(((won / tries) * 100).toFixed(2)) }
        : { won: 0, tries: 0, rate: 0 };
};

export const CalcPlayerCheckoutRate = (state: Game, teamId: number, playerId: number): { won: number; tries: number; rate: number } => {
    if (!state) return { won: 0, tries: 0, rate: 0 };

    let won = 0;
    let tries = 0;

    state.scores.forEach((score) => {
        if (score.teamId === teamId && score.player.playerId === playerId) {
            if (score.remainingScore === 0) {
                won++;
                tries += score.checkOutAttempts;
            } else {
                tries += score.checkOutAttempts;
            }
        }
    });

    return tries > 0
        ? { won, tries, rate: Number(((won / tries) * 100).toFixed(2)) }
        : { won: 0, tries: 0, rate: 0 };
};

export const GetGreatestScoredPlayer = (state: Game): Player | undefined => {
    if (state.scores.length <= 0) return;

    let greatestScore = 0;
    let player;

    state.scores.forEach((score) => {
        if (score.score > greatestScore) {
            greatestScore = score.score;
            player = score.player;
        }
    });

    return player;
}

export const GetGreatestScoredPlayerInLeg = (state: Game): Player | undefined => {
    if (state.scores.length <= 0) return undefined;

    let greatestScore = 0;
    let player;

    state.scores.forEach((score) => {
        if (score.score > greatestScore && score.legId === state.currLegIdx) {
            greatestScore = score.score;
            player = score.player;
        }
    });

    return player;
}

export const GetGreatestScore = (state: Game, teamId: number, playerId: number): number => {
    if (state.scores.length <= 0) return 0;

    let greatestScore = 0;
    state.scores.forEach((score) => {
        if (score.score > greatestScore && score.teamId === teamId && score.player.playerId === playerId) {
            greatestScore = score.score;
        }
    });

    return greatestScore;
}

export const GetGreatestScorePlayer = (state: Game, playerId: number | null | undefined): number => {
  if (state.scores.length === 0) return 0;

    let l = 0;
    state.scores.filter((score) => score.player.playerId == playerId).forEach((score) => {
        l += score.score;
    })

  return l;
}
