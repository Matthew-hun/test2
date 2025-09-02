"use client";
import Navbar from "@/app/components/Navbar";
import LegAvgs from "@/app/components/Statistics/LegAvgs";
import PlayerStats from "@/app/components/Statistics/PlayerStats";
import { ScoreChart } from "@/app/components/Statistics/ScoreCharts";
import ScoreTable from "@/app/components/Statistics/ScoreTable";
import { useGame } from "@/app/hooks/GameProvider";
import { GetScoreHistory } from "@/app/hooks/selectors";
import { CompareTypes, Player, Score, Team } from "@/app/types/types";
import { Tab, Tabs } from "@heroui/tabs";
import { ConfigProvider, Segmented } from "antd";
import React, { useEffect, useState } from "react";
import { BarChart3, Users, TrendingUp, Target } from "lucide-react";

export interface PlayerOption {
  label: string;
  value: number; // playerId
}

export interface TeamOption {
  label: string;
  value: number; // teamId
}

const Page = () => {
  const { state, dispatch } = useGame();

  const [playerOptions, setPlayerOptions] = useState<PlayerOption[]>([]);
  const [playerTeamOptions, setPlayerTeamOptions] = useState<TeamOption[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState<number>(0);
  const [compareType, setCompareType] = useState<CompareTypes>(
    CompareTypes.NoCompare
  );

  useEffect(() => {
    const pOptions = state.teams.flatMap((team) =>
      team.players.map((player) => {
        return { label: player.name, value: player.playerId };
      })
    );

    const seen: number[] = [];
    const filteredPlayerOptions = pOptions.filter((player) => {
      if (!seen.includes(player.value) && player.value !== -1) {
        seen.push(player.value);
        return true;
      }
      return false;
    });

    setPlayerOptions(filteredPlayerOptions);

    // Ha vannak játékosok, de nincs kiválasztva senki, válasszuk ki az elsőt
    if (pOptions.length > 0 && selectedPlayer === 0) {
      setSelectedPlayer(pOptions[0].value);
    }
  }, [state, selectedPlayer]);

  useEffect(() => {
    if (!selectedPlayer) {
      setPlayerTeamOptions([]);
      setSelectedPlayerTeam(0);
      return;
    }

    const pTeamOptions = state.teams
      .filter((team) =>
        team.players.some((player) => player.playerId === selectedPlayer)
      )
      .map((team) => ({
        label: "Team " + (team.teamId + 1),
        value: team.teamId!,
      }));

    setPlayerTeamOptions(pTeamOptions);

    // Automatikusan válasszuk ki az első elérhető csapatot
    if (pTeamOptions.length > 0) {
      setSelectedPlayerTeam(pTeamOptions[0].value);
    } else {
      setSelectedPlayerTeam(0);
    }
  }, [state, selectedPlayer]);

  // Don't render if no players available
  if (playerOptions.length === 0) {
    return (
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              itemActiveBg: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              itemHoverBg: "rgba(59, 130, 246, 0.1)",
              itemSelectedBg:
                "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              trackBg: "rgba(15, 23, 42, 0.8)",
              itemColor: "#94a3b8",
              itemHoverColor: "#e2e8f0",
              itemSelectedColor: "white",
              borderRadius: 12,
            },
          },
          token: {
            colorBgContainer: "transparent",
            colorTextPlaceholder: "#64748b",
            colorText: "white",
            colorBorder: "rgba(51, 65, 85, 0.5)",
          },
        }}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 no-scrollbar">
          <Navbar />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center space-y-4 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-2xl">
              <Users className="w-16 h-16 text-slate-400 mx-auto" />
              <h2 className="text-2xl font-bold text-white">
                No Players Available
              </h2>
              <p className="text-slate-400">
                Add some players to view statistics
              </p>
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 no-scrollbar overflow-hidden">
        <Navbar />

        {/* Controls Header */}
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Statistics Dashboard
                </h1>
                <p className="text-slate-400 text-sm">
                  Player performance analytics
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 ml-auto">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-400" />
                <Segmented
                  options={playerOptions}
                  onChange={(value) => setSelectedPlayer(value)}
                  value={selectedPlayer}
                />
              </div>

              {playerTeamOptions.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  <Segmented
                    options={playerTeamOptions}
                    onChange={(value) => setSelectedPlayerTeam(Number(value))}
                    value={selectedPlayerTeam}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <Segmented
                  options={Object.values(CompareTypes)}
                  onChange={(value) => setCompareType(value)}
                  value={compareType}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid - Desktop & Tablet Layout */}
        <div className="hidden lg:block w-full flex-1 min-h-0">
          <div className="w-full h-full grid grid-rows-3 grid-cols-4 gap-4">
            {/* Player Stats - Top Row, Full Width */}
            <div className="col-span-4 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
              {selectedPlayer && (
                <div className="h-full p-6">
                  <PlayerStats
                    teamId={selectedPlayerTeam}
                    playerId={selectedPlayer}
                    compare={compareType}
                  />
                </div>
              )}
            </div>

            {/* Score Chart - Row 2, Left Half */}
            <div className="col-span-2 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
              {selectedPlayer && (
                <div className="h-full">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-white">
                        Score Performance
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 h-full">
                    <ScoreChart
                      playerOptions={playerOptions}
                      selectedPlayer={selectedPlayer}
                      selectedPlayerName={
                        playerOptions.find(
                          (player) => player.value === selectedPlayer
                        )?.label ?? ""
                      }
                      selectedTeam={selectedPlayerTeam}
                      teamOptions={playerTeamOptions}
                      compare={compareType}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Leg Averages - Row 2, Right Half */}
            <div className="col-span-2 bg-background-light/90 h-fit rounded-xl backdrop-blur-sm">
              {selectedPlayer && (
                <div className="h-full">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg shadow-lg">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-white">Leg Averages</h3>
                    </div>
                  </div>
                  <div className="p-4 h-full">
                    <LegAvgs
                      teamId={selectedPlayerTeam}
                      playerId={selectedPlayer}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Score Table - Row 3, Full Width */}
            <div className="col-span-4 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
              {selectedPlayer && (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-white">Detailed Scores</h3>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    <ScoreTable
                      teamId={selectedPlayerTeam}
                      playerId={selectedPlayer}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
