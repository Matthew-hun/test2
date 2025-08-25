import React, { useState } from "react";
import GameSettings from "./GameSettings";
import { Button } from "@/components/ui/button";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { GameActionType, useGame } from "../hooks/GameProvider";
import { Settings, Undo2 } from "lucide-react";
import ScoreInput from "./ScoreInput";
import { CalcMaxNumberOfLegs } from "../hooks/selectors";

const GameCard = () => {
  const [gameSettingsOpen, setGameSettingsOpen] = useState<boolean>(false);
  const { state, dispatch } = useGame();

  
  return (
    <div className="w-[600px] flex justify-evenly items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
      <div className="text-white hover:text-primary transition">
        <Settings className="cursor-pointer" onClick={() => { setGameSettingsOpen(true) }} />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-center">
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
                | {CalcMaxNumberOfLegs(state)}
              </div>
            </div>
            <div className="flex gap-1 mt-2 justify-center">
              {[...Array(CalcMaxNumberOfLegs(state))].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1 rounded-full transition-all ${i < (state?.currLegIdx ?? -1) + 1
                    ? "bg-primary"
                    : "bg-white/30"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <ScoreInput />
        </div>
      </div>
      <div className="text-white hover:text-primary transition">
        <Undo2 className="cursor-pointer" onClick={() => dispatch({type: GameActionType.REMOVE_SCORE})} />
      </div>
      <GameSettings open={gameSettingsOpen} setOpen={setGameSettingsOpen} />
    </div>
  );
};

export default GameCard;