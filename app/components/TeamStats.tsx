import React from "react";
import { Trophy, BarChart2, Target, Star } from "lucide-react";

const TeamStats = () => {
  const wins = 2;
  const legAvg = 33.34;
  const matchAvg = 45.9;
  const checkOutRate = 50.0;

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
          value={legAvg.toFixed(2)}
        />
        <StatBox
          icon={<Target className="w-5 h-5" />}
          label="Match Avg"
          value={matchAvg.toFixed(2)}
        />
        <StatBox
          icon={<Star className="w-5 h-5" />}
          label="Checkout %"
          value={`${checkOutRate.toFixed(1)}%`}
        />
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
  <div className="flex items-center justify-start rounded-xl py-4 px-4 gap-3 bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg hover:bg-black/40 transition-all duration-200">
    <div className="text-emerald-300/80 p-2 bg-emerald-500/20 rounded-lg">
      {icon}
    </div>
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-emerald-300/80 font-medium">{label}</p>
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
    <p className="text-xs text-emerald-300/80 font-medium">{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);
