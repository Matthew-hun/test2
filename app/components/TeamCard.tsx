import React, { FC, useEffect, useState } from "react";
import { Badge, Player } from "../types/types";
import { GameActionType, useGame } from "../hooks/GameProvider";
import TeamPlayers from "./TeamPlayers";
import TeamStats from "./TeamStats";
import ScoreHistory from "./ScoreHistory";
import { ConfigProvider, Progress } from "antd";
import {
  CalcWinsNeeded,
  GetCheckOut,
  GetRaminingScore,
} from "../hooks/selectors";
import DashboardProgress from "./DashboardProgress";

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
  const [remainingScore, setRemainingScore] = useState<number>(
    state.settings.startingScore
  );
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setRemainingScore(GetRaminingScore(state, teamId));
    setProgress(
      state.teams[teamId].wins === 0
        ? 0
        : Math.floor((state.teams[teamId].wins / CalcWinsNeeded(state)) * 100)
    );
  }, [state]);

  const isActiveTeam = state.currTeamIdx == teamId;
  return (
    <ConfigProvider
      theme={{
        components: {
          Progress: {
            defaultColor: "var(--color-progress)",
            remainingColor: "transparent",
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
      cursor-pointer w-full min-w-[400px] max-w-[600px] h-full p-4 rounded-md flex flex-col justify-start gap-2 flex-1/${
        state.teams.length
      } text-white ${
          isActiveTeam
            ? "shadow-primary/50 border-2 border-primary"
            : "shadow-black"
        } shadow-xl
      `}
      >
        <div id="remainingScore" className="h-fit">
          <div className="relative h-fit my-4 flex items-center justify-center z-2">
            <DashboardProgress
              teamId={teamId}
              steps={CalcWinsNeeded(state)}
              completed={state.teams[teamId].wins}
              isActive={teamId == state.currTeamIdx}
            />
          </div>
        </div>
        {GetCheckOut(state, teamId) && (
          <div className="w-full h-fit flex justify-center items-center">
            <p className="bg-background p-2 rounded-md">
              {GetCheckOut(state, teamId)}
            </p>
          </div>
        )}
        <div className="flex justify-center gap-3 w-full px-6">
          {state.teams[teamId].players.map((player, playerIdx) => {
            return (
              <TeamPlayers
                key={playerIdx}
                teamId={teamId}
                player={player}
                isActiveTeam={isActiveTeam}
                isActivePlayer={state.teams[teamId].currPlayerIdx === playerIdx}
                teamIdx={teamId}
                playerIdx={playerIdx}
              />
            );
          })}
        </div>
        <TeamStats teamId={teamId} />
        <ScoreHistory teamId={teamId} />
      </div>
    </ConfigProvider>
  );
};

export default TeamCard;
