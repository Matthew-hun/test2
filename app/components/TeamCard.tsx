import React, { FC } from "react";
import { Player } from "../types/types";
import { GameActionType, useGame } from "../hooks/GameProvider";
import TeamPlayers from "./TeamPlayers";
import TeamStats from "./TeamStats";
import ScoreHistory from "./ScoreHistory";
import { ConfigProvider, Progress } from "antd";

interface TeamCardProps {
  teamId: number;
  players: Player[];
  currPlayerIdx: number;
  wins: number;
}

const TeamCard: FC<TeamCardProps> = ({
  teamId,
  players,
  currPlayerIdx,
  wins,
}: TeamCardProps) => {
  const { state, dispatch } = useGame();

  const isActiveTeam = state.currTeamIdx == teamId;
  const winsNeeded = 3;
  const progressPercent = 100;
  const remainingScore = 501;
  return (
    <ConfigProvider
      theme={{
        components: {
          Progress: {
            defaultColor: "var(--color-progress)",
          },
        },
        token: {
          colorSuccess: "var(--color-progress)",
        },
      }}
    >
      <div
        onClick={() =>
          dispatch({ type: GameActionType.SET_ACTIVE_TEAM, payload: teamId })
        }
        className={`${
          isActiveTeam
            ? "bg-gradient-to-br from-primary to-background"
            : "bg-not-active-team-card"
        }
      w-full min-w-[400px] max-w-[700px] h-fit p-4 rounded-md flex flex-col flex-1/${
        state.teams.length
      } text-white
      `}
      >
        <div id="remainingScore" className="flex-1/2">
          <div className="relative my-12 flex items-center justify-center z-2">
            <Progress
              type="dashboard"
              steps={winsNeeded}
              percent={progressPercent}
              showInfo={false}
              trailColor="transparent"
              strokeWidth={8}
              size={265}
              className="absolute z-100"
            />

            {/* Rotating ring for active team - nagyobb */}
            {isActiveTeam && (
              <div
                className="absolute w-72 h-72 rounded-full border-3 border-dashed border-primary animate-spin"
                style={{ animationDuration: "40s" }}
              />
            )}

            {/* Main score circle - nagyobb */}
            <div
              className={`relative w-52 h-52 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl flex items-center justify-center z-10 transition-all duration-300 ${
                isActiveTeam
                  ? "border-4 border-primary/60 shadow-primary/30"
                  : "border-4 border-primary/20"
              }`}
            >
              <div
                className={`absolute inset-2 rounded-full blur-sm ${
                  isActiveTeam
                    ? "bg-gradient-to-r from-primary/25 to-secondary/25"
                    : "bg-gradient-to-r from-primary/8 to-secondary/8"
                }`}
              />
              <span className="relative block text-7xl font-black bg-gradient-to-br from-white via-primary-100 to-primary-200 bg-clip-text text-transparent z-20">
                {remainingScore}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 w-full">
          {state.teams[teamId].players.map((player, playerIdx) => {
            return (
              <TeamPlayers
                key={playerIdx}
                player={player}
                isActiveTeam={isActiveTeam}
                isActivePlayer={state.teams[teamId].currPlayerIdx === playerIdx}
                teamIdx={teamId}
                playerIdx={playerIdx}
              />
            );
          })}
        </div>
        <TeamStats />
        <ScoreHistory />
      </div>
    </ConfigProvider>
  );
};

export default TeamCard;
