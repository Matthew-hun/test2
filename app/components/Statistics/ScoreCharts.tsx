import { useGame } from "@/app/hooks/GameProvider";
import { GetScoreHistory } from "@/app/hooks/selectors";
import { StatsCalculator } from "@/app/hooks/Stats";
import { PlayerOption, TeamOption } from "@/app/pages/statistics/page";
import { Checkbox, Radio } from "antd";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CompareTypes, Score } from "@/app/types/types";

interface ChartDataRow {
  name: number; // scoreId vagy game index
  [player: string]: number; // játékos neve → score
}

interface AreaChartProps {
  playerOptions: PlayerOption[];
  teamOptions: TeamOption[];
  selectedPlayer: number;
  selectedPlayerName: string;
  selectedTeam: number;
}

export const ScoreChart: React.FC<AreaChartProps> = ({
  playerOptions,
  teamOptions,
  selectedPlayer,
  selectedPlayerName,
  selectedTeam,
}) => {
  const { state } = useGame();
  const [selectedCompare, setSelectedCompare] = useState<CompareTypes>(
    CompareTypes.NoCompare
  );
  const [chartData, setChartData] = useState<ChartDataRow[]>([]);

  useEffect(() => {
    // lekérjük minden játékos pontjait külön tömbben
    let playerScores: {label: string, scores: Score[]}[] = [];
    switch (selectedCompare) {
      case CompareTypes.NoCompare:
        playerScores = playerOptions.map((player) => ({
          label: player.label,
          scores: StatsCalculator.GetScores(state, selectedTeam, player.value),
        }));
        break;
      case CompareTypes.CompareToTeam:
        playerScores = playerOptions.map((player) => ({
          label: player.label,
          scores: StatsCalculator.GetScores(state, selectedTeam, player.value),
        }));
        break;
      case CompareTypes.CompareToEveryBody:
        playerScores = playerOptions.map((player) => ({
          label: player.label,
          scores: StatsCalculator.GetScores(state, undefined, player.value),
        }));
        break;
      default:
        playerScores = [];
        break;
    }
    
    console.log("player", playerScores);
    
    // meghatározzuk a leghosszabb score-listát
    const maxLength = Math.max(...playerScores.map((p) => p.scores.length));

    // sorok összerakása
    const chartData: ChartDataRow[] = Array.from(
      { length: maxLength },
      (_, scoreId) => {
        const row: ChartDataRow = { name: scoreId };
        playerScores.forEach((p) => {
          // ha nincs score, 0-t adunk
          row[p.label] = p.scores[scoreId]?.score || 0;
        });
        return row;
      }
    );
    setChartData(chartData);
  }, [selectedPlayer, selectedPlayerName, selectedTeam, selectedCompare, state, playerOptions]);

  const renderChartAreas = () => {
    switch (selectedCompare) {
      case CompareTypes.NoCompare:
        return (
          <Area
            type="monotone"
            dataKey={selectedPlayerName}
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            fill="url(#gradient-0)"
            fillOpacity={1}
          />
        );
        
      case CompareTypes.CompareToTeam:
        const teamPlayers = playerOptions.filter(player => {
          const playerTeams = state.teams.filter(team => 
            team.players.some(p => p.playerId === player.value)
          );
          return playerTeams.some(team => team.teamId === selectedTeam);
        });
        
        return teamPlayers.map((player, idx) => (
          <Area
            key={player.value}
            type="monotone"
            dataKey={player.label}
            stroke={`var(--color-chart-${idx + 1})`}
            strokeWidth={2}
            fill={`url(#gradient-${idx})`}
            fillOpacity={1}
          />
        ));
        
      case CompareTypes.CompareToEveryBody:
        return playerOptions.map((player, idx) => (
          <Area
            key={player.value}
            type="monotone"
            dataKey={player.label}
            stroke={`var(--color-chart-${idx + 1})`}
            strokeWidth={2}
            fill={`url(#gradient-${idx})`}
            fillOpacity={1}
          />
        ));
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-2">
      <Radio.Group
        value={selectedCompare}
        options={Object.values(CompareTypes)}
        onChange={(e) => setSelectedCompare(e.target.value as CompareTypes)}
      />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {playerOptions.map((player, idx) => (
              <linearGradient
                key={player.value}
                id={`gradient-${idx}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-chart-${idx + 1})`}
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-chart-${idx + 1})`}
                  stopOpacity={1}
                />
              </linearGradient>
            ))}
          </defs>

          <XAxis
            dataKey="name"
            axisLine={{ stroke: "var(--color-primary)", strokeWidth: 1 }}
            tickLine={{ stroke: "var(--color-primary)" }}
            tick={{ fill: "#e2e8f0", fontSize: 12 }}
          />

          <YAxis
            domain={[0, 180]}
            axisLine={{ stroke: "var(--color-primary)", strokeWidth: 1 }}
            tickLine={{ stroke: "var(--color-primary)" }}
            tick={{ fill: "#e2e8f0", fontSize: 12 }}
          />

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-primary)"
            strokeOpacity={0.2}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-background-light)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
            labelFormatter={() => ""} // ID nem jelenik meg
            formatter={(value: number, name: string) => [
              `Score: ${value}`,
              name,
            ]}
          />

          {renderChartAreas()}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};