"use client";
import React, { useState } from "react";
import GameSettings from "../components/GameSettings";
import { Button } from "@/components/ui/button";
import TeamCard from "../components/TeamCard";
import { useGame } from "../hooks/GameProvider";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import { Modal } from "antd";
import { GameState } from "../types/types";
import MatchReview from "../components/MatchReview";

const Main = () => {
  const { state, dispatch } = useGame();
  return (
    <div className="w-screen min-h-screen h-full p-4 flex flex-col items-center">
      <div>
        <Navbar />
      </div>
      <MatchReview />
      <div className="w-full h-full flex flex-col items-center gap-4">
        <GameCard />
        <div className="flex justify-center h-fit w-full gap-4">
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
