import React, { FC, useEffect, useState, useRef } from "react";
import { Player } from "../types/types";
import { Badge } from "antd";
import { GameActionType, useGame } from "../hooks/GameProvider";
import { ChevronRight, Divide, Medal } from "lucide-react";
import { IoPlay } from "react-icons/io5";
import { CalcCheckoutRate, CalcGameAvg, CalcLegAvg, CalcPlayerCheckoutRate, CalcPlayerGameAvg, CalcPlayerLegAvg, GetGreatestScore, GetGreatestScoredPlayer, GetGreatestScoredPlayerInLeg } from "../hooks/selectors";

interface TeamPlayersProps {
  teamId: number,
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
  const [checkOutRate, setCheckOutRate] = useState<{ won: number; tries: number; rate: number }>({ won: 0, tries: 0, rate: 0 });

  useEffect(() => {
    if (player.playerId === undefined || player.playerId === null) return;

    setLegAvg(CalcPlayerLegAvg(state, teamId, player.playerId));
    setGameAvg(CalcPlayerGameAvg(state, teamId, player.playerId));
    setCheckOutRate(CalcPlayerCheckoutRate(state, teamId, player.playerId));
    setGreatestScore(GetGreatestScore(state, teamId, player.playerId));

    console.log(player.name, ":", CalcPlayerLegAvg(state, teamId, player.playerId));
  }, [state])

  const handleMouseEnter = () => {
    if (playerRef.current && (legAvg !== 0 || gameAvg !== 0 || checkOutRate.rate !== 0)) {
      const rect = playerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
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
        className={`${isActiveTeam
          ? isActivePlayer
            ? "bg-primary"
            : "bg-primary/20"
          : "bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg"
          } relative flex-1/${state.teams[teamIdx].players.length} py-2 w-full cursor-pointer flex justify-center items-center text-white font-bold rounded-md`}
      >
        <p className={`text-[clamp(0.5rem,1vw,1.5rem)] ${!isActiveTeam && isActivePlayer && "text-primary"}`}>{player.name}</p>
        <div className="absolute -top-1 -right-1 flex">
          {
            GetGreatestScoredPlayer(state)?.playerId === player.playerId &&
            <Medal color="#FFD700"/>
          }
          {
            GetGreatestScoredPlayerInLeg(state)?.playerId === player.playerId  && GetGreatestScoredPlayer(state)?.playerId !== player.playerId &&
            <Medal color="#c0c0c0"/>
          }
        </div>
      </div>

      {/* Portal-like tooltip rendered at the end of body */}
      {showTooltip && (legAvg !== 0 || gameAvg !== 0 || checkOutRate.rate !== 0) && (
        <div
          className={`fixed ${isActiveTeam ? "bg-primary" : "bg-background"} p-4 rounded-md flex justify-center items-center min-w-max shadow-lg border border-white/10 pointer-events-none`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 10000
          }}
        >
          <div className="text-sm text-white">
            {greatestScore !== 0 && <p className="whitespace-nowrap">Greatest score: <span className="font-semibold">{greatestScore}</span></p>}
            {legAvg !== 0 && <p className="whitespace-nowrap">Leg Avg: <span className="font-semibold">{legAvg.toFixed(2)}</span></p>}
            {gameAvg !== 0 && <p className="whitespace-nowrap">Game Avg: <span className="font-semibold">{gameAvg.toFixed(2)}</span></p>}
            {checkOutRate.rate !== 0 && <p className="whitespace-nowrap">Checkout rate: <span className="font-semibold">{checkOutRate.rate.toFixed(2)}%</span></p>}
          </div>
          {/* Tooltip arrow pointing down */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${isActiveTeam ? "border-t-primary" : "border-t-background"}`}></div>
        </div>
      )}
    </>
  );
};

export default TeamPlayers;