export enum GameModeType {FirstTo = 'First to', BestOf = 'BestOf'}
export enum CheckOutModeType {Simple = 'Simple', Double = 'Double', Triple = 'Triple'}
export enum GameState {Initialized = 'Initialized', Running = 'Running', Over = 'Over'}

export type Player = {
    playerId: number | null,
    name: string,
}

export type Team = {
    teamId: number,
    players: Player[],
    currPlayerIdx: number,
    wins: number,
}

export type Settings = {
    gameMode: GameModeType,
    startingScore: number,
    checkOutMode: CheckOutModeType,
    numberOfLegs: number,
    startingTeam: number,
    randomStartingTeam: boolean,
}

export type Score = {
    scoreId: number,
    player: Player,
    teamId: number,
    legId: number,
    score: number,
    remainingScore: number,
    checkOutAttempts: number,
}

export type LegData = {
    legId: number,
    legWinnerTeamId: number,
}

export type Game = {
    teams: Team[],
    scores: Score[],
    settings: Settings,
    currLegIdx: number,
    currTeamIdx: number,
    gameState: GameState,
    winnerTeamIdx: number | undefined,
}