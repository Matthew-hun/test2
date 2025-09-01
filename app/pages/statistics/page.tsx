"use client";
import Navbar from "@/app/components/Navbar";
import LegAvgs from "@/app/components/Statistics/LegAvgs";
import PlayerStats from "@/app/components/Statistics/PlayerStats";
import { ScoreChart } from "@/app/components/Statistics/ScoreCharts";
import ScoreTable from "@/app/components/Statistics/ScoreTable";
import { useGame } from "@/app/hooks/GameProvider";
import { GetScoreHistory } from "@/app/hooks/selectors";
import { Player, Score, Team } from "@/app/types/types";
import { Tab, Tabs } from "@heroui/tabs";
import { ConfigProvider, Segmented } from "antd";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    const pOptions = state.teams.flatMap((team) =>
      team.players.map((player) => {
        return { label: player.name, value: player.playerId };
      })
    );

    let seen: number[] = [];
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
        <div className="w-screen h-screen p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 no-scrollbar">
          <Navbar />
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-lg">No players available</p>
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
      <div className="w-screen h-screen p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 no-scrollbar overflow-hidden">
        <Navbar />

        {/* Player Tabs */}
        <div className="w-full flex gap-4">
          <Segmented
            options={playerOptions}
            onChange={(value) => setSelectedPlayer(value)}
            value={selectedPlayer}
          />
          {playerTeamOptions.length > 0 && (
            <Segmented
              options={playerTeamOptions}
              onChange={(value) => setSelectedPlayerTeam(Number(value))}
              value={selectedPlayerTeam}
            />
          )}
        </div>

        {/* Statistics Grid - Desktop & Tablet Layout */}
        <div className="hidden lg:block w-full flex-1 min-h-0">
          <div className="w-full h-full grid grid-rows-3 grid-cols-4 gap-2 sm:gap-4">
            {/* Player Stats - Top Row, Full Width */}
            <div className="col-span-4 bg-background-light/80 rounded-md overflow-hidden">
              {selectedPlayer && (
                <PlayerStats
                  teamId={selectedPlayerTeam}
                  playerId={selectedPlayer}
                />
              )}
            </div>

            {/* Score Chart - Row 2, Left Half */}
            <div className="col-span-2 bg-background-light/80 rounded-md p-2 sm:p-4 overflow-hidden">
              {selectedPlayer && (
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
                />
              )}
            </div>

            {/* Leg Averages - Row 2, Right Half */}
            <div className="col-span-2 bg-background-light/80 rounded-md p-2 sm:p-4 overflow-hidden">
              {selectedPlayer && (
                <LegAvgs
                  teamId={selectedPlayerTeam}
                  playerId={selectedPlayer}
                />
              )}
            </div>

            {/* Score Table - Row 3, Full Width */}
            <div className="col-span-4 bg-background-light/80 rounded-md p-2 sm:p-4 overflow-y-auto">
              {selectedPlayer && (
                <ScoreTable
                  teamId={selectedPlayerTeam}
                  playerId={selectedPlayer}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Page;
