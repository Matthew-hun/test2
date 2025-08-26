import React, { useEffect, useRef, useState } from "react";
import { GameActionType, useGame } from "../hooks/GameProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetRaminingScore } from "../hooks/selectors";
import { toast } from "sonner";
import { GameState } from "../types/types";

const ScoreInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [dartsThrownToCheckoutOpen, setDartsThrownToCheckoutOpen] =
    useState<boolean>(false);
  const [dartsThrownToCheckout, setDartsThrownToCheckout] = useState<number>(0);
  const notPossibleCheckouts: number[] = [169, 168, 166, 165, 163, 162, 159];

  // Pending score - amikor várjuk a checkout input-ot
  const [pendingScore, setPendingScore] = useState<string>("");
  const [pendingScoreValue, setPendingScoreValue] = useState<number>(0);

  const { state, dispatch } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);

  // Jelenlegi játékos pontszámának kiszámítása
  const currentRemainingScore = GetRaminingScore(state, state.currTeamIdx);

  useEffect(() => {
    inputRef.current?.focus();
  }, [state]);

  const handleScoreSubmit = () => {
    let scoreValue = 0;

    if (inputValue.toLocaleLowerCase().startsWith("r")) {
      scoreValue = currentRemainingScore - Number(inputValue.slice(1));
    } else {
      scoreValue = Number(inputValue);
    }

    if (scoreValue < 0 || scoreValue > 180) {
      toast("Please provide a valid input between 0-180");
      return;
    } else if (scoreValue === 179) {
      toast("You can not score 179");
      return;
    } else if (currentRemainingScore - scoreValue < 0) {
      toast("Can not score more than the remaining");
      return;
    }

    // Ha 170 alatt lenne a maradék pontszám, nyisd meg a modalt
    if (currentRemainingScore < 170 && currentRemainingScore >= 0 && !notPossibleCheckouts.includes(currentRemainingScore)) {
      setPendingScore(inputValue);
      setPendingScoreValue(scoreValue);
      setDartsThrownToCheckoutOpen(true);
      setInputValue("");
    } else {
      // Ha nem checkout helyzet, küldd el rögtön
      dispatch({
        type: GameActionType.ADD_SCORE,
        payload: {
          score: scoreValue,
          thrownDartsToCheckout: 0,
          teamId: state.currTeamIdx,
          player:
            state.teams[state.currTeamIdx].players[
              state.teams[state.currTeamIdx].currPlayerIdx
            ],
        },
      });
      setInputValue("");
    }
  };

  // JAVÍTOTT FUNKCIÓ: közvetlenül paraméterként kapja meg a dart count-ot
  const handleCheckoutConfirm = (dartCount: number) => {
    dispatch({
      type: GameActionType.ADD_SCORE,
      payload: {
        score: pendingScoreValue,
        thrownDartsToCheckout: dartCount,
        teamId: state.currTeamIdx,
        player:
          state.teams[state.currTeamIdx].players[
            state.teams[state.currTeamIdx].currPlayerIdx
          ],
      },
    });

    // Reset minden state-t
    setPendingScore("");
    setPendingScoreValue(0);
    setDartsThrownToCheckout(0);
    setDartsThrownToCheckoutOpen(false);

    // Focus visszaadása az input-nak CSAK modal bezárás után
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleScoreSubmit();
    }
  };

  // Modal-ban billentyűzet kezelés (0-3 számok)
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const key = e.key;
    if (["0", "1", "2", "3"].includes(key)) {
      const dartCount = parseInt(key);
      console.log("Key pressed, dartCount:", dartCount);
      setDartsThrownToCheckout(dartCount);

      // JAVÍTÁS: közvetlenül a dartCount-ot adjuk át
      setTimeout(() => {
        handleCheckoutConfirm(dartCount);
      }, 150);
    }
    if (key === "Escape") {
      // Escape esetén visszaállítjuk az eredeti állapotot
      setInputValue(pendingScore);
      setPendingScore("");
      setPendingScoreValue(0);
      setDartsThrownToCheckoutOpen(false);
      setDartsThrownToCheckout(0);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className="w-full flex items-center px-20 py-5">
      <Dialog
        open={dartsThrownToCheckoutOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Ha bezárják a modalt, állítsd vissza az eredeti állapotot
            setInputValue(pendingScore);
            setPendingScore("");
            setPendingScoreValue(0);
            setDartsThrownToCheckout(0);
          }
          setDartsThrownToCheckoutOpen(open);
        }}
      >
        <DialogContent
          className="text-white"
          onKeyDown={handleModalKeyDown}
          tabIndex={0}
          autoFocus
        >
          <DialogHeader>
            <DialogTitle>Checkout attempts</DialogTitle>
            <DialogDescription className="mb-4">
              Score:{" "}
              <span className="font-bold text-white">{pendingScore}</span>
              {" → "}
              Remaining:{" "}
              <span className="font-bold text-primary">
                {currentRemainingScore - pendingScoreValue}
              </span>
            </DialogDescription>

            <div className="flex gap-2 py-4">
              {Array.from({ length: 4 }, (_, i) => i).map((number) => (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Clicked dartCount:", number);
                    setDartsThrownToCheckout(number);

                    // JAVÍTÁS: közvetlenül a number-t adjuk át
                    setTimeout(() => {
                      handleCheckoutConfirm(number);
                    }, 150);
                  }}
                  key={number}
                  className={`w-20 h-20 text-3xl font-bold flex justify-center items-center rounded-md cursor-pointer transition-all duration-200 ${
                    dartsThrownToCheckout === number
                      ? "bg-primary text-white"
                      : "bg-background-light hover:bg-primary/20"
                  }`}
                >
                  {number}
                </div>
              ))}
            </div>

            <DialogDescription>
              Press 0-3 or click on the box
              <br />
              <span className="text-xs text-gray-400">ESC to cancel</span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Score"
        pattern="[Rr]?(0|[1-9][0-9]{0,2})"
        disabled={
          dartsThrownToCheckoutOpen || state.gameState === GameState.Over
        }
        className={`w-full text-center text-white font-bold flex-1 bg-transparent border-b-2 border-0 outline-none text-lg placeholder-gray-400 invalid:border-rose-700 invalid:text-rose-700 focus:border-b-2 focus:placeholder-gray-300 transition-all duration-200 ${
          dartsThrownToCheckoutOpen
            ? "opacity-50 cursor-not-allowed"
            : "animate-pulse"
        }`}
      />
    </div>
  );
};

export default ScoreInput;
