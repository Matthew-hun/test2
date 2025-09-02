import React, { FC, useEffect, useState, useRef } from "react";
import { Player } from "../types/types";
import { Badge } from "antd";
import { GameActionType, useGame } from "../hooks/GameProvider";
import { ChevronRight, Divide, Medal } from "lucide-react";
import { IoPlay } from "react-icons/io5";
import {
  CalcPlayerCheckoutRate,
  CalcPlayerGameAvg,
  CalcPlayerLegAvg,
  GetGreatestScoredPlayer,
  GetGreatestScoredPlayerInLeg,
} from "../hooks/selectors";
import { StatsCalculator } from "../hooks/Stats";

interface TeamPlayersProps {
  teamId: number;
  player: Player;
  isActiveTeam: boolean;
  isActivePlayer: boolean;
  teamIdx: number;
  playerIdx: number;
}

const TeamPlayers: FC<TeamPlayersProps> = ({
  teamId,
  player,
  isActiveTeam,
  isActivePlayer,
  teamIdx,
  playerIdx,
}: TeamPlayersProps) => {
  const { state, dispatch } = useGame();
  const playerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [legAvg, setLegAvg] = useState<number>(0);
  const [gameAvg, setGameAvg] = useState<number>(0);
  const [greatestScore, setGreatestScore] = useState<number>(0);
  const [checkOutRate, setCheckOutRate] = useState<{
    won: number;
    tries: number;
    rate: number;
  }>({ won: 0, tries: 0, rate: 0 });

  const handleMouseEnter = () => {
    if (
      playerRef.current &&
      (StatsCalculator.CalculateGreatestScore(state, teamId, player.playerId) >
        0 ||
        StatsCalculator.CalculateLegAvg(state, teamId, player.playerId) > 0 ||
        StatsCalculator.CalculateGameAvg(state, teamId, player.playerId) > 0 ||
        StatsCalculator.CalculateCheckoutStats(state, teamId, player.playerId)
          .rate > 0 ||
        StatsCalculator.BestCheckout(state, teamId, player.playerId) > 0)
    ) {
      const rect = playerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div
        ref={playerRef}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({
            type: GameActionType.SET_ACTIVE_PLAYER_IN_TEAM,
            payload: { teamIdx: teamIdx, playerIdx: playerIdx },
          });
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${
          isActiveTeam
            ? isActivePlayer
              ? "bg-primary"
              : "bg-primary/20"
            : "bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg"
        } relative flex-1/${
          state.teams[teamIdx].players.length
        } py-2 w-full cursor-pointer flex justify-center items-center text-white font-bold rounded-md`}
      >
        <p
          className={`text-[clamp(0.5rem,1vw,1.5rem)] ${
            !isActiveTeam && isActivePlayer && "text-primary"
          }`}
        >
          {player.name}
        </p>
        <div className="absolute -top-1 -right-1 flex">
          {GetGreatestScoredPlayer(state)?.player.playerId ===
            player.playerId &&
            GetGreatestScoredPlayer(state)?.teamId === teamId && (
              <Medal
                color={`${
                  GetGreatestScoredPlayer(state)?.score == 180
                    ? "#B9F2FF"
                    : "#FFD700"
                }`}
              />
            )}
          {GetGreatestScoredPlayerInLeg(state)?.player.playerId ===
            player.playerId &&
            GetGreatestScoredPlayer(state)?.teamId === teamId &&
            GetGreatestScoredPlayer(state)?.player.playerId !==
              player.playerId && <Medal color="#c0c0c0" />}
        </div>
      </div>

      {/* Portal-like tooltip rendered at the end of body */}
      {showTooltip && (
        <div
          className={`fixed ${
            isActiveTeam ? "bg-primary" : "bg-background"
          } p-4 rounded-md flex justify-center items-center min-w-max shadow-lg border border-white/10 pointer-events-none`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, -100%)",
            zIndex: 10000,
          }}
        >
          <div className="text-sm text-white">
            {StatsCalculator.BestCheckout(state, teamId, player.playerId) >
              0 && (
              <p>
                Best checkout{" "}
                <span>
                  {StatsCalculator.BestCheckout(state, teamId, player.playerId)}
                </span>
              </p>
            )}
            {StatsCalculator.CalculateGreatestScore(
              state,
              teamId,
              player.playerId
            ) > 0 && (
              <p>
                Greatest score:{" "}
                <span>
                  {StatsCalculator.CalculateGreatestScore(
                    state,
                    teamId,
                    player.playerId
                  )}
                </span>
              </p>
            )}

            {StatsCalculator.CalculateLegAvg(state, teamId, player.playerId) >
              0 && (
              <p>
                Leg Avg:{" "}
                <span>
                  {StatsCalculator.CalculateLegAvg(
                    state,
                    teamId,
                    player.playerId
                  ).toFixed(2)}
                </span>
              </p>
            )}

            {StatsCalculator.CalculateGameAvg(
              state,
              teamId,
              player.playerId
            ) && (
              <p>
                Game Avg:{" "}
                <span>
                  {StatsCalculator.CalculateGameAvg(
                    state,
                    teamId,
                    player.playerId
                  ).toFixed(2)}
                </span>
              </p>
            )}
            {StatsCalculator.CalculateCheckoutStats(
              state,
              teamId,
              player.playerId
            ).rate > 0 && (
              <p>
                Checkout rate:{" "}
                <span>
                  {StatsCalculator.CalculateCheckoutStats(
                    state,
                    teamId,
                    player.playerId
                  ).rate.toFixed(2)}
                  %
                </span>
              </p>
            )}
          </div>
          {/* Tooltip arrow pointing down */}
          <div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
              isActiveTeam ? "border-t-primary" : "border-t-background"
            }`}
          ></div>
        </div>
      )}
    </>
  );
};

export default TeamPlayers;
