import React, { FC, useEffect, useState } from "react";
import { Trophy, BarChart2, Target, Star } from "lucide-react";
import { useGame } from "../hooks/GameProvider";
import { CalcCheckoutRate, CalcGameAvg, CalcLegAvg } from "../hooks/selectors";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TeamStatsProps {
  teamId: number,
}

const TeamStats: FC<TeamStatsProps> = ({ teamId }: TeamStatsProps) => {
  const { state } = useGame();
  const [legAvg, setLegAvg] = useState<number>(0);
  const [gameAvg, setGameAvg] = useState<number>(0);
  const [wins, setWins] = useState<number>(0);
  const [checkOutRate, setCheckOutRate] = useState<{ won: number; tries: number; rate: number }>({ won: 0, tries: 0, rate: 0 });

  useEffect(() => {
    setLegAvg(CalcLegAvg(state, teamId));
    setGameAvg(CalcGameAvg(state, teamId));
    setWins(state.teams[teamId].wins);
    setCheckOutRate(CalcCheckoutRate(state, teamId));
  }, [state])

  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl p-6">
      <div className="grid grid-cols-2 gap-2">
        <StatBox
          icon={<Trophy className="w-5 h-5" />}
          label="Wins"
          value={wins}
        />
        <StatBox
          icon={<BarChart2 className="w-5 h-5" />}
          label="Leg Avg"
          value={legAvg}
        />
        <StatBox
          icon={<Target className="w-5 h-5" />}
          label="Match Avg"
          value={gameAvg}
        />
        <div className="group relative w-full flex justify-center items-center">
          {checkOutRate.tries > 0 && (
            <>
              <div className="absolute bg-primary rounded-md p-4 -top-10 invisible group-hover:visible z-10">
                <p><span className="font-bold">{checkOutRate.won}</span> ot of <span className="font-bold">{checkOutRate.tries}</span></p>
              </div>
             
            </>
          )}
          <StatBox
            icon={<Star className="w-5 h-5" />}
            label="Checkout %"
            value={`${checkOutRate.rate}%`}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <MileStones label="60:" value={3} />
        <MileStones label="100:" value={3} />
        <MileStones label="140:" value={3} />
      </div>
    </div>
  );
};

export default TeamStats;

const StatBox = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="w-full flex items-center justify-start rounded-xl py-4 px-4 gap-3 bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg hover:bg-black/40 transition-all duration-200">
    <div className="text-primary/80 p-2 bg-primary/20 rounded-lg">
      {icon}
    </div>
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-primary/80 font-medium">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const MileStones = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-center rounded-xl py-4 px-3 gap-2 bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg hover:bg-black/40 transition-all duration-200">
    <p className="text-md text-primary/80 font-medium">{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);
