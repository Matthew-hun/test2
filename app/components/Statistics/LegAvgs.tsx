import { useGame } from "@/app/hooks/GameProvider";
import { StatsCalculator } from "@/app/hooks/Stats";
import React, { FC, useEffect, useState } from "react";

interface ILegAvgsProps {
    teamId: number;
    playerId: number;
}

const LegAvgs:FC<ILegAvgsProps> = ({teamId, playerId} : ILegAvgsProps) => {
  const { state } = useGame();
  const [legs, setLegs] = useState<number[]>([]);
  useEffect(() => {
    setLegs(StatsCalculator.CalcAllLegAvg(state, teamId, playerId));
  }, [state, teamId, playerId])

  return (
    <div className={`w-full h-full grid grid-cols-2 gap-2`}>
      {legs.map((leg, legId) => {
        return (
          <div
            key={leg}
            className="stat h-full bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10"
          >
            <div className="stat-title text-white text-center">Leg: {legId + 1}</div>
            <div className="stat-value text-white text-center text-[50px]">
              {leg.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LegAvgs;
