import { useGame } from "@/app/hooks/GameProvider";
import { StatsCalculator } from "@/app/hooks/Stats";
import { Table } from "antd";
import React, { FC } from "react";

interface IPlayerStatsProps {
  teamId: number;
  playerId: number;
}

const PlayerStats: FC<IPlayerStatsProps> = ({ teamId, playerId }: IPlayerStatsProps) => {
  const { state } = useGame();

  const player = state.teams[Number(teamId)]?.players.find(
    (p) => p.playerId === playerId
  );

  // const columns = StatsCalculator.GetPlayers(state);
  // const data = StatsCalculator.GetPlayersStatsData(state);
  // console.log(data);

  if (!player) return <div>No player data available</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 w-full h-full p-4">
      {[
        { title: "Greatest score", value: StatsCalculator.CalculateGreatestScore(state, teamId, player.playerId) },
        { title: "Best checkout", value: isFinite(StatsCalculator.BestCheckout(state, teamId, player.playerId)) ? StatsCalculator.BestCheckout(state, teamId, player.playerId) : 0 },
        { title: "Game Avg", value: StatsCalculator.CalculateGameAvg(state, teamId, player.playerId).toFixed(2) },
        { title: "Best Leg Avg", value: StatsCalculator.BestLegAvg(state, teamId, player.playerId).toFixed(2) },
        {
          title: "Checkout rate",
          value: isNaN(StatsCalculator.CalculateCheckoutStats(state, teamId, player.playerId).rate) ? 0 : StatsCalculator.CalculateCheckoutStats(state, teamId, player.playerId).rate.toFixed(2) + "%",
          desc: `${StatsCalculator.CalculateCheckoutStats(state, teamId, player.playerId).successfull} out of ${StatsCalculator.CalculateCheckoutStats(state, teamId, player.playerId).attempts}`
        }
      ].map((stat, index) => (
        <div
          key={index}
          className="stat h-full bg-background-light rounded-md p-3 sm:p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10"
        >
          <div className="stat-title text-white text-center text-sm sm:text-base">{stat.title}</div>
          <div className="stat-value text-white text-center text-2xl sm:text-3xl lg:text-4xl xl:text-[50px] font-bold leading-tight">{stat.value}</div>
          {stat.desc && <div className="stat-desc text-center text-xs sm:text-sm text-gray-400">{stat.desc}</div>}
        </div>
      ))}
    </div>
    // <Table columns={columns} dataSource={data}>

    // </Table>
  );
};

export default PlayerStats;