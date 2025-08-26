"use client";
import Navbar from "@/app/components/Navbar";
import { GameActionType, useGame } from "@/app/hooks/GameProvider";
import {
  CalcPlayerCheckoutRate,
  CalcPlayerGameAvg,
  CalcPlayerLegAvg,
  GetGreatestScorePlayer,
  GetScoreHistory,
} from "@/app/hooks/selectors";
import { Player, Score } from "@/app/types/types";
import { Checkbox, ConfigProvider, Radio, Segmented } from "antd";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface PlayerOption {
  label: string;
  value: number; // playerId
  teamId: number;
}

const Page = () => {
  const { state, dispatch } = useGame();

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(
    null
  );

  const [scoreHistory, setScoreHistory] = useState<Score[]>([]);
  const [compare, setCompare] = useState<boolean>(false);

  // Betöltéskor a játék állapotának lekérése
  useEffect(() => {
    dispatch({ type: GameActionType.LOAD_GAME });
  }, [dispatch]);

  // Opciók létrehozása
  const playerOptions: PlayerOption[] = state.teams.flatMap((team) =>
    team.players.map((player: Player) => ({
      label: player.name,
      value: player.playerId!,
      teamId: team.teamId,
    }))
  );

  // Ha nincs kiválasztott játékos, vegyük az elsőt
  useEffect(() => {
    if (!selectedPlayer && playerOptions.length > 0) {
      setSelectedPlayer(playerOptions[0]);
    }
  }, [playerOptions, selectedPlayer]);

  const data = () => {
    // lekérjük minden játékos pontjait külön tömbben
    const playerScores = playerOptions.map((player) => ({
      label: player.label,
      scores: GetScoreHistory(state, player.teamId, player.value),
    }));

    // feltételezzük, hogy mindenkinek ugyanannyi score van
    const maxLength = Math.max(...playerScores.map((p) => p.scores.length));

    // sorok összerakása
    const dat = Array.from({ length: maxLength }, (_, scoreId) => {
      const row: Record<string, any> = { name: scoreId };
      playerScores.forEach((p) => {
        row[p.label] = p.scores[scoreId]?.score ?? 0; // ha nincs, akkor 0
      });
      return row;
    });

    console.log(dat);
    return dat;
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemActiveBg: "var(--color-primary-active)",
            itemHoverBg: "var(--color-primary-hover)",
            itemSelectedBg: "var(--color-primary)",
            trackBg: "var(--color-background-light)",
            itemColor: "white",
            itemHoverColor: "white",
            itemSelectedColor: "white",
          },
        },
        token: {
          colorBgContainer: "var(--color-background)",
          colorTextPlaceholder: "var(--color-placeholder)",
          colorText: "white",
          colorBorder: "transparent",
        },
      }}
    >
      <div className="w-screen h-screen p-4 flex flex-col gap-4">
        <div>
          <Navbar />
        </div>
        <div className="flex w-full">
          <Segmented
            size="large"
            value={selectedPlayer?.value}
            onChange={(value) => {
              const option = playerOptions.find(
                (opt) => opt.value === Number(value)
              );
              if (option) setSelectedPlayer(option);
            }}
            options={playerOptions}
          />
        </div>

        <div className="w-fit grid grid-cols-4 gap-2 p-4 rounded-md bg-background-light/50">
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center z-2">
              Greatest score
            </div>
            <div className="stat-value text-white text-center z-2">
              {selectedPlayer
                ? GetGreatestScorePlayer(state, selectedPlayer.value)
                : 0}
            </div>
          </div>
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center">Leg Avg</div>
            <div className="stat-value text-white text-center">
              {selectedPlayer
                ? CalcPlayerLegAvg(
                    state,
                    selectedPlayer.teamId,
                    selectedPlayer.value
                  )
                : 0}
            </div>
          </div>
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center">Match Avg</div>
            <div className="stat-value text-white text-center">
              {selectedPlayer
                ? CalcPlayerGameAvg(
                    state,
                    selectedPlayer.teamId,
                    selectedPlayer.value
                  )
                : 0}
            </div>
          </div>
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center">
              Checkout rate
            </div>
            <div className="stat-value text-white text-center">
              {selectedPlayer
                ? CalcPlayerCheckoutRate(
                    state,
                    selectedPlayer.teamId,
                    selectedPlayer.value
                  ).rate
                : 0}
            </div>
            <div className="stat-desc text-center">
              {selectedPlayer
                ? CalcPlayerCheckoutRate(
                    state,
                    selectedPlayer.teamId,
                    selectedPlayer.value
                  ).won
                : 0}{" "}
              out of{" "}
              {selectedPlayer
                ? CalcPlayerCheckoutRate(
                    state,
                    selectedPlayer.teamId,
                    selectedPlayer.value
                  ).tries
                : 0}
            </div>
          </div>
        </div>
        <div className="w-fit bg-background-light/50 rounded-md flex flex-col justify-center items-center gap-4 p-4">
          <Checkbox value={compare} onChange={(e) => setCompare(e.target.checked)}>Compare to other</Checkbox>
          <AreaChart
            width={730}
            height={250}
            data={data()}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id="primaryGradientStroke"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--color-primary-hover)" />
                <stop offset="100%" stopColor="var(--color-primary)" />
              </linearGradient>
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
                border: `none`,
                borderRadius: "8px",
                color: "white",
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
              }}
              labelFormatter={() => ""}
              labelStyle={{ color: "var(--color-primary)" }}
              formatter={(value, name) => [`${name}: ${value}`]}
            />

            {compare ? (
              <>
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

                {playerOptions.map((player, idx) => (
                  <Area
                    key={player.value}
                    type="monotone"
                    dataKey={player.label}
                    stroke={`var(--color-chart-${idx + 1})`}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#gradient-${idx})`}
                  />
                ))}
              </>
            ) : (
              <Area
                type="monotone"
                dataKey={selectedPlayer?.label as string}
                stroke="url(#primaryGradientStroke)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#primaryGradient)"
              />
            )}
          </AreaChart>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
