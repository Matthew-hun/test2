"use client";
import Navbar from '@/app/components/Navbar';
import { GameActionType, useGame } from '@/app/hooks/GameProvider';
import { CalcPlayerCheckoutRate, CalcPlayerGameAvg, CalcPlayerLegAvg, GetGreatestScorePlayer } from '@/app/hooks/selectors';
import { Player } from '@/app/types/types';
import { ConfigProvider, Segmented } from 'antd';
import React, { useEffect, useState } from 'react';

interface PlayerOption {
  label: string;
  value: number; // playerId
  teamId: number;
}

const Page = () => {
  const { state, dispatch } = useGame();

  const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(null);

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
        }
      }}>
      <div className='w-screen h-screen p-4 flex flex-col gap-4'>
        <div>
          <Navbar />
        </div>
        <div className='flex w-full'>
          <Segmented
            value={selectedPlayer?.value}
            onChange={(value) => {
              const option = playerOptions.find((opt) => opt.value === Number(value));
              if (option) setSelectedPlayer(option);
            }}
            options={playerOptions}
          />
        </div>

        <div className='w-fit grid grid-cols-4 gap-2'>
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center z-2">Greatest score</div>
            <div className="stat-value text-white text-center z-2">
              {selectedPlayer ? GetGreatestScorePlayer(state, selectedPlayer.value) : 0}
            </div>
          </div>
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center">Leg Avg</div>
            <div className="stat-value text-white text-center">
              {selectedPlayer ? CalcPlayerLegAvg(state, selectedPlayer.teamId, selectedPlayer.value) : 0}
            </div>
          </div>
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center">Match Avg</div>
            <div className="stat-value text-white text-center">
              {selectedPlayer ? CalcPlayerGameAvg(state, selectedPlayer.teamId, selectedPlayer.value) : 0}
            </div>
          </div>
          <div className="stat bg-background-light rounded-md p-4 z-2 border-1 border-transparent hover:shadow-black/80 hover:shadow-lg hover:border-1 hover:border-white/10">
            <div className="stat-title text-white text-center">Checkout rate</div>
            <div className="stat-value text-white text-center">
              {selectedPlayer ? CalcPlayerCheckoutRate(state, selectedPlayer.teamId, selectedPlayer.value).rate : 0}
            </div>
            <div className='stat-desc text-center'>{selectedPlayer ? CalcPlayerCheckoutRate(state, selectedPlayer.teamId, selectedPlayer.value).won : 0} out of {selectedPlayer ? CalcPlayerCheckoutRate(state, selectedPlayer.teamId, selectedPlayer.value).tries : 0}</div>
          </div>
        </div>

      </div>
    </ConfigProvider>
  );
};

export default Page;
