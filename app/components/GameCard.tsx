import React, { useState } from "react";
import GameSettings from "./GameSettings";
import { Button } from "@/components/ui/button";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { useGame } from "../hooks/GameProvider";
import { Settings, Undo2 } from "lucide-react";
import ScoreInput from "./ScoreInput";

const GameCard = () => {
  const [gameSettingsOpen, setGameSettingsOpen] = useState<boolean>(false);
  const { state, dispatch } = useGame();

  const maxLeg =
    state.settings.gameMode === "First to"
      ? (state.settings.numberOfLegs - 1) * state.teams.length + 1 // Legrosszabb eset: minden csapat (legs-1)-et nyer, majd az egyik megnyeri a legs-ediket
      : state.settings.numberOfLegs; // Best of esetén pontosan legs db leg lesz
  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
        <div className="w-full flex items-center justify-between gap-5">
          <div className="text-white hover:text-primary transition">
            <Settings className="cursor-pointer" onClick={() => {setGameSettingsOpen(true)}} />
          </div>
          <div className="relative w-fit flex flex-col">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">
                  {state?.settings.gameMode} {state?.settings.numberOfLegs}
                </span>
              </div>
              <div className="relative bg-white/10 px-2 py-1 rounded text-sm font-medium text-white">
                {typeof state?.currLegIdx === "number"
                  ? state.currLegIdx + 1
                  : "-"}{" "}
                | {maxLeg}
              </div>
            </div>
            <div className="flex gap-1 mt-2 justify-center">
              {[...Array(maxLeg)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1 rounded-full transition-all ${
                    i < (state?.currLegIdx ?? -1) + 1
                      ? "bg-emerald-400"
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-white hover:text-primary transition">
            <Undo2 className="cursor-pointer" onClick={() => {}} />
          </div>
        </div>
        <div className="w-full flex justify-center">
          <ScoreInput />
        </div>
      </div>
      <GameSettings open={gameSettingsOpen} setOpen={setGameSettingsOpen} />
    </div>
  );
};

export default GameCard;
