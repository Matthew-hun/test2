import { useState, useEffect } from "react";
import { Player } from "../types/types";

export default function usePlayers() {
  const [players, setRegularPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<string>();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("regularPlayers");
      const regularPlayers = stored ? JSON.parse(stored) : [];

      const players = regularPlayers.map((player: string, idx: number) => ({
        playerId: idx,
        name: player,
      }));
      setRegularPlayers(players);
      console.log(players);
    } catch (error) {
      console.error("Nem sikerült beolvasni a játékosokat:", error);
    }
  }, []);

  const AddPlayer = () => {
    const regularPlayers = localStorage.getItem("regularPlayers");
    const items = regularPlayers ? JSON.parse(regularPlayers) : [];
    if (newPlayer === null || newPlayer === undefined || newPlayer === "") {
      throw new Error("Name is necessary");
    } else if (items.includes(newPlayer)) {
      throw new Error("Player with this name already exits")
    } else {
      items.push(newPlayer);
      localStorage.setItem("regularPlayers", JSON.stringify(items));

      const updated = items.map((p: string) => ({
        playerId: p,
        name: p,
      }));
      setRegularPlayers(updated);
      setNewPlayer(""); // Töröljük az input mezőt is
    }
  };

  const RemovePlayer = (player: string) => {
    try {
      const regularPlayers = localStorage.getItem("regularPlayers");
      let items = regularPlayers ? JSON.parse(regularPlayers) : [];

      items = items.filter((x: string) => x !== player);
      localStorage.setItem("regularPlayers", JSON.stringify(items));

      // Frissítjük az állapotot is
      const updated = items.map((p: string) => ({
        playerId: p,
        name: p,
      }));
      setRegularPlayers(updated);
    } catch (error) {
      alert("Sikertelen");
    }
  };

  return {
    players,
    newPlayer,
    setNewPlayer,
    AddPlayer,
    RemovePlayer,
  };
}
