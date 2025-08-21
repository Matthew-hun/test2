import React, { FC } from "react";
import { Player } from "../types/types";
import { Badge } from "antd";
import { GameActionType, useGame } from "../hooks/GameProvider";

interface TeamPlayersProps {
  player: Player;
  isActiveTeam: boolean;
  isActivePlayer: boolean;
  teamIdx: number;
  playerIdx: number;
}

const TeamPlayers: FC<TeamPlayersProps> = ({
  player,
  isActiveTeam,
  isActivePlayer,
  teamIdx,
  playerIdx,
}: TeamPlayersProps) => {
  const { state, dispatch } = useGame();
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        dispatch({
          type: GameActionType.SET_ACTIVE_PLAYER_IN_TEAM,
          payload: { teamIdx: teamIdx, playerIdx: playerIdx },
        });
      }}
      className={`${
        isActiveTeam
          ? isActivePlayer
            ? "bg-primary"
            : "bg-primary/20"
          : "bg-white/20"
      } cursor-pointer flex justify-center items-center gap-2 text-white font-bold px-4 py-2 w-fit rounded-full`}
    >
      <div
        className={`${
          isActivePlayer
            ? isActiveTeam
              ? "bg-white"
              : "bg-primary"
            : "bg-background"
        } w-2 h-2 rounded-full`}
      ></div>
      <p>{player.name}</p>
    </div>
  );
};

export default TeamPlayers;
