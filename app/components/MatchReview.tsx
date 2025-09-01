import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameActionType, useGame } from "../hooks/GameProvider";
import { GameState } from "../types/types";
import { GetWinnerTeam } from "../hooks/selectors";
import { Trophy, Users, Sparkles } from "lucide-react";

const MatchReview = () => {
  const { state, dispatch } = useGame();
  const winnerTeam = GetWinnerTeam(state);

  const [open, setOpen] = useState<boolean>(state.gameState === GameState.Over);

  useEffect(() => {
    setOpen(state.gameState === GameState.Over);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-white max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center"></div>

          <DialogTitle className="text-3xl font-bold">Victory!</DialogTitle>

          <DialogDescription className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-lg text-purple-200">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Winning Team:</span>
            </div>

            <div className="bg-primary/60 rounded-lg p-4">
              {winnerTeam && winnerTeam.players ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {winnerTeam.players.map((player, index) => (
                    <span
                      key={player.playerId}
                      className="px-3 py-1 text-white font-bold rounded-full text-sm"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {player.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-purple-300 text-center">
                  No winner determined
                </p>
              )}
            </div>
            {/* <div className="w-full flex flex-col bg-primary/50 text-white p-2 rounded-md text-center">
              <p><span className="font-bold">{winnerTeam && CalcCheckoutRate(state, winnerTeam?.teamId).rate}%</span> checkout rate</p>
              <p><span className="font-bold">{winnerTeam && CalcCheckoutRate(state, winnerTeam?.teamId).won}</span> out of <span className="font-bold">{winnerTeam && CalcCheckoutRate(state, winnerTeam?.teamId).tries}</span></p>
            </div> */}
            <div className="text-center text-purple-300 text-sm mt-4">
              Congratulations on an amazing match! 🏆
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center pt-4">
          <Button
            className="bg-gradient-to-r from-transparent to-primary text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={() => dispatch({ type: GameActionType.CREATE_GAME })}
          >
            <span className="flex items-center gap-2">Start Next Game</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchReview;
