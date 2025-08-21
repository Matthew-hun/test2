"use client";
import React, { useState } from "react";
import GameSettings from "../components/GameSettings";
import { Button } from "@/components/ui/button";
import TeamCard from "../components/TeamCard";
import { useGame } from "../hooks/GameProvider";
import GameCard from "../components/GameCard";

const Main = () => {
  const [gameSettingsOpen, setGameSettingsOpen] = useState<boolean>(false);
  const { state, dispatch } = useGame();
  return (
    <div className="w-screen h-screen p-4 flex justify-center">
      <div className="w-fit flex flex-col gap-4">
        <GameCard />
        <div className="flex justify-center w-full gap-4">
          {state.teams.map((team, teamIdx) => {
            return (
              <TeamCard
                key={teamIdx}
                teamId={team.teamId}
                players={team.players}
                currPlayerIdx={team.currPlayerIdx}
                wins={team.wins}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
