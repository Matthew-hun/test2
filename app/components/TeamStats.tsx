import React, { FC } from "react";
import { BarChart2, Target, Star, ArrowUp, ArrowBigLeft } from "lucide-react";
import { useGame } from "../hooks/GameProvider";
import { StatsCalculator } from "../hooks/Stats";
import { Tabs, Tab } from "@heroui/tabs";
import { Game } from "../types/types";

interface TeamStatsProps {
  teamId: number;
}

const TeamStats: FC<TeamStatsProps> = ({ teamId }: TeamStatsProps) => {
  const { state } = useGame();

  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl p-6">
      <div className="grid grid-cols-2 gap-2">
        <CurrLegAvg
          icon={<BarChart2 className="w-5 h-5" />}
          label="Leg Avg"
          state={state}
          value={
            isNaN(StatsCalculator.CalculateLegAvg(state, teamId))
              ? 0
              : StatsCalculator.CalculateLegAvg(state, teamId).toFixed(2)
          }
          status={
            StatsCalculator.CalculateLegAvg(state, teamId) >
            StatsCalculator.CalculateLegAvg(
              state,
              teamId,
              undefined,
              state.currLegIdx - 1
            )
              ? "greater"
              : StatsCalculator.CalculateLegAvg(state, teamId) <
                StatsCalculator.CalculateLegAvg(
                  state,
                  teamId,
                  undefined,
                  state.currLegIdx - 1
                )
              ? "less"
              : "same"
          }
        />
        <StatBox
          icon={<ArrowBigLeft className="w-5 h-5"/>}
          label="Previous Leg Avg"
          value={
            isNaN(
              StatsCalculator.CalculateLegAvg(
                state,
                teamId,
                undefined,
                state.currLegIdx - 1
              )
            )
              ? 0
              : StatsCalculator.CalculateLegAvg(
                  state,
                  teamId,
                  undefined,
                  state.currLegIdx - 1
                ).toFixed(2)
          }
        />
        <StatBox
          icon={<Target className="w-5 h-5" />}
          label="Game Avg"
          value={
            isNaN(StatsCalculator.CalculateGameAvg(state, teamId))
              ? 0
              : StatsCalculator.CalculateGameAvg(state, teamId).toFixed(2)
          }
        />
        <div className="group relative w-full flex justify-center items-center">
          {StatsCalculator.CalculateCheckoutStats(state, teamId).attempts >
            0 && (
            <>
              <div className="absolute bg-primary rounded-md p-4 -top-10 invisible group-hover:visible z-10">
                <p>
                  <span className="font-bold">
                    {
                      StatsCalculator.CalculateCheckoutStats(state, teamId)
                        .successfull
                    }
                  </span>{" "}
                  ot of{" "}
                  <span className="font-bold">
                    {
                      StatsCalculator.CalculateCheckoutStats(state, teamId)
                        .attempts
                    }
                  </span>
                </p>
              </div>
            </>
          )}
          <StatBox
            icon={<Star className="w-5 h-5" />}
            label="Checkout %"
            value={`${
              isNaN(StatsCalculator.CalculateCheckoutStats(state, teamId).rate)
                ? 0
                : StatsCalculator.CalculateCheckoutStats(
                    state,
                    teamId
                  ).rate.toFixed(2)
            }%`}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <MileStones
          label="60:"
          value={StatsCalculator.CalcSixties(state, teamId)}
        />
        <MileStones
          label="120:"
          value={StatsCalculator.CalcOneTwenties(state, teamId)}
        />
        <MileStones
          label="180:"
          value={StatsCalculator.CalcOneEighties(state, teamId)}
        />
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
    <div className="text-primary/80 p-2 bg-primary/20 rounded-lg">{icon}</div>
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-primary/80 font-medium">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const CurrLegAvg = ({
  icon,
  label,
  value,
  status,
  state,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  status: "less" | "greater" | "same";
  state: Game;
}) => (
  <div className="w-full flex items-center justify-start rounded-xl py-4 px-4 gap-3 bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg hover:bg-black/40 transition-all duration-200">
    <div className="text-primary/80 p-2 bg-primary/20 rounded-lg">{icon}</div>
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-primary/80 font-medium">{label}</p>
      <div className="flex items-center gap-1">
        {status !== "same" && state.currLegIdx > 0  && (
          <ArrowUp
            className={`${
              status === "greater" ? "text-green-500" : "rotate-180 text-red-500"
            }`}
          />
        )}
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
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
