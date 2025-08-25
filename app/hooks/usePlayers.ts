import { useState, useEffect } from "react";
import { Player } from "../types/types";

export default function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadPlayers = () => {
      const storedPlayers = localStorage.getItem("players");
      if (storedPlayers) {
        setPlayers(JSON.parse(storedPlayers));
      } else {
        setPlayers([]);
      }
    };

    loadPlayers(); // első betöltés
    window.addEventListener("storage", loadPlayers);

    return () => window.removeEventListener("storage", loadPlayers);
  }, []);

  const AddPlayer = (newPlayerName: string) => {
    if (!newPlayerName) {
      throw new Error("Name cannot be empty!");
    }

    if (players.some(player => player.name === newPlayerName)) {
      throw new Error("Player with this name already exists!");
    }

    // biztonságos ID generálás
    const newId =
      players.length === 0
        ? 0
        : Math.max(...players.map(p => p.playerId ?? -1)) + 1;

    const newPlayer: Player = {
      name: newPlayerName,
      playerId: newId,
    };

    const newPlayers = [...players, newPlayer];
    setPlayers(newPlayers);
    localStorage.setItem("players", JSON.stringify(newPlayers));
  };

  const RemovePlayer = (playerId: number | null) => {
    if (playerId === null) return;

    const newPlayers = players.filter(player => player.playerId !== playerId);
    setPlayers(newPlayers);
    localStorage.setItem("players", JSON.stringify(newPlayers));
  };

  return {
    players,
    AddPlayer,
    RemovePlayer,
  };
}
