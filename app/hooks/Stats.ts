import { stat } from "fs";
import { CheckoutStatsType, Game, Player, Score, Team } from "../types/types";
import { GetGreatestScorePlayer } from "@/test2/app/hooks/selectors";

type playersStat = {
    greatestScore: number,
    bestCheckout: number,
    gameAvg: number,
    bestLegAvg: number,
    checkoutRate: number,
}

export class StatsCalculator {
    static GetScores = (state: Game, teamId?: number, playerId?: number): Score[] => {
        const scores = state.scores;
        if (scores.length === 0) return [];

        const filteredScores = scores.filter((score) =>
            teamId !== undefined && playerId !== undefined
                ? score.teamId === teamId && score.player.playerId === playerId
                : teamId === undefined && playerId !== undefined
                    ? score.player.playerId === playerId
                    : teamId !== undefined && playerId === undefined
                        ? score.teamId === teamId
                        : false
        );

        return filteredScores;
    }

    static CalculateGreatestScore = (state: Game, teamId: number, playerId?: number): number => {
        const scores = state.scores;
        if (scores.length === 0) return 0;

        const allScore: number[] = scores.filter((score) => 
            playerId
                ? score.teamId === teamId && score.player.playerId === playerId
                : score.teamId === teamId
        ).map((score) => score.score);

        return Math.max(...allScore);
    }

    static CalculateLegAvg = (state: Game, teamId: number, playerId?: number, legId?: number): number => {
        const scores = state.scores;
        if (scores.length === 0) return 0;

        const targetLeg = legId ?? state.currLegIdx;
        const filteredScores = scores.filter((score) => 
            playerId
                ? score.teamId === teamId && score.player.playerId === playerId && score.legId === targetLeg
                : score.teamId === teamId && score.legId === targetLeg
        );
        const scoreSum = filteredScores.reduce((acc, curr) => acc + curr.score, 0);
        const throwsSum = filteredScores.reduce((acc, curr) => acc + curr.throws, 0);
        if (throwsSum === 0) return 0;

        return (scoreSum / throwsSum) * 3;
    }

    static CalculateGameAvg = (state: Game, teamId: number, playerId?: number): number => {
        const scores = state.scores;
        if (scores.length === 0) return 0;

        const filteredScores = scores.filter((score) => 
            playerId
                ? score.teamId === teamId && score.player.playerId === playerId
                : score.teamId === teamId
        );
        const scoreSum = filteredScores.reduce((acc, curr) => acc + curr.score, 0);
        const throwsSum = filteredScores.reduce((acc, curr) => acc + curr.throws, 0);
        if (throwsSum === 0) return 0;

        return (scoreSum / throwsSum) * 3;
    }

    static CalculateCheckoutStats = (state: Game, teamId: number, playerId?: number): CheckoutStatsType => {
        const scores = state.scores;
        if (scores.length === 0) return {attempts: 0, successfull: 0, rate: 0};

        const filteredScores = scores.filter((score) => 
            playerId
                ? score.teamId === teamId && score.player.playerId === playerId
                : score.teamId === teamId
        )
        const attempts = filteredScores.map((score) => score.checkoutAttempts).reduce((acc, curr) => acc + curr, 0);
        const successfull = filteredScores.filter((score) => score.remainingScore === 0).length;


        return {
            attempts: attempts,
            successfull: successfull,
            rate: Number(((successfull / attempts) * 100).toFixed(2)),
        };
    }

    static CalcSixties = (state: Game, teamId: number, playerId?: number): number => {
        const scores = state.scores;
        if(scores.length === 0) return 0;

        const sixties = scores.filter((score) => score.score >= 60 && score.score < 120).length;

        return sixties;
    }

    static CalcOneTwenties = (state: Game, teamId: number, playerId?: number): number => {
        const scores = state.scores;
        if(scores.length === 0) return 0;

        const oneTwenties = scores.filter((score) => score.score >= 120 && score.score < 180).length;

        return oneTwenties;
    }

    static CalcOneEighties = (state: Game, teamId: number, playerId?: number): number => {
        const scores = state.scores;
        if(scores.length === 0) return 0;

        const oneEighties = scores.filter((score) => score.score === 180).length;

        return oneEighties;
    }

    static CalcAllLegAvg = (state: Game, teamId: number, playerId: number) => {
        const avgs:number[] = [];
        for (let i = 0; i < state.currLegIdx + 1; i++) {
            avgs.push(this.CalculateLegAvg(state, teamId, playerId, i));
        }

        return avgs;
    }

    static BestCheckout = (state: Game, teamId: number, playerId: number): number => {
        const scores = state.scores;
        if (scores.length <= 0) return 0;

        const checkouts: number[] = scores.filter(score =>
            playerId
                ? score.remainingScore === 0 && score.teamId === teamId && score.player.playerId === playerId
                : score.remainingScore === 0 && score.teamId === teamId
            ).map(score => score.score);
        return Math.max(...checkouts);
    }

    static BestLegAvg = (state: Game, teamId: number, playerId: number): number => {
        const scores = state.scores;
        if (scores.length <= 0) return 0;

        const avgs: number[] = this.CalcAllLegAvg(state, teamId, playerId);
        return Math.max(...avgs);
    }

    static GetBestCheckoutTeam = (state: Game): number | undefined => {
        const scores = state.scores;
        if (!state || state.teams.length <= 0 || scores.length <= 0) return;

        let bestTeam: number | undefined = undefined;
        let bestCheckout: number = 0;
        scores.forEach((score) => {
            if (score.remainingScore === 0 && score.score > bestCheckout) {
                bestCheckout = score.score;
                bestTeam = score.teamId;
            }
        });

        return bestTeam;
    }

    static GetPlayers = (state: Game) => {
        if (!state || state.teams.length <= 0) return;
        let players = [{
            title: "Stats",
            dataIndex: "stats",
            key: -1,
            teamId: -1,
        }];
        state.teams.flatMap((team, teamIdx) => team.players.map((player) => {
            players.push({
                title: player.name,
                dataIndex: player.name,
                key: player.playerId,
                teamId: team.teamId,
            });
        }));

        let seen: number[] = [];
        const filteredPlayers = players.filter(player => {
            if (!seen.includes(player.key)) {
                seen.push(player.key);
                return true;
            }
            return false;
        })
        console.log(players);
        return filteredPlayers;
    }

    static GetPlayersStatsData = (state: Game) => {
        if (!state || state.scores.length <= 0 || state.teams.length <= 0) return;
        const players = this.GetPlayers(state);
        const data: playersStat[] = [];

        players?.map(player => {
            const newRow = {
                greatestScore: this.CalculateGreatestScore(state, player.teamId, player.key),
                bestCheckout: this.BestCheckout(state, player.teamId, player.key),
                gameAvg: this.CalculateGameAvg(state, player.teamId, player.key),
                bestLegAvg: this.BestLegAvg(state, player.teamId, player.key),
                checkoutRate: this.CalculateCheckoutStats(state, player.teamId, player.key).rate,
            }
            data.push(newRow);
        });

        return data;
    }
}