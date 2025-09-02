// ScoreInput.tsx - Display timing javítás
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
import NewScoreDisplay from "./NewScoreDisplay";
import CheckoutAttempts from "./InputDialogs/CheckoutAttempts";
import { inputScoreRegex } from "../types/regex";

interface ScoreInputProps {
  onScoreChange?: (score: string) => void;
}

const ScoreInput = ({ onScoreChange }: ScoreInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [dartsThrownToCheckoutOpen, setDartsThrownToCheckoutOpen] =
    useState<boolean>(false);
  const [dartsThrownToCheckout, setDartsThrownToCheckout] = useState<number>(0);
  const [showScoreDisplay, setShowScoreDisplay] = useState(false);
  const [displayedScore, setDisplayedScore] = useState("");
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

  // Update parent component when input changes
  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(inputValue);
    }
  }, [inputValue, onScoreChange]);

  // Új függvény a display score megjelenítéshez
  const showScoreDisplayAnimation = (scoreValue: number) => {
    setDisplayedScore(scoreValue.toString());
    setShowScoreDisplay(true);

    // Hide after 2 seconds
    setTimeout(() => {
      setShowScoreDisplay(false);
      // displayedScore törlése CSAK az animáció után
      setTimeout(() => {
        setDisplayedScore("");
      }, 300); // 300ms = animáció hossza
    }, 2000);
  };

  const handleScoreSubmit = () => {
    let scoreValue = 0;

    if (!inputScoreRegex.test(inputValue)) {
      toast("Please provide a valid input between 0-180");
      return;
    }

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

    if (isNaN(scoreValue)) {
      return;
    }

    // Ha 170 alatt lenne a maradék pontszám, nyisd meg a modalt
    if (
      currentRemainingScore < 170 &&
      currentRemainingScore >= 0 &&
      !notPossibleCheckouts.includes(currentRemainingScore)
    ) {
      setPendingScore(inputValue);
      setPendingScoreValue(scoreValue);
      setDartsThrownToCheckoutOpen(true);
      // JAVÍTÁS: Az inputValue törlését késleltesd, hogy a display lássa
      setTimeout(() => {
        setInputValue("");
      }, 100);
    } else {
      // Ha nem checkout helyzet, küldd el rögtön ÉS mutasd a display-t
      showScoreDisplayAnimation(scoreValue);
      
      dispatch({
        type: GameActionType.ADD_SCORE,
        payload: {
          score: scoreValue,
          checkoutAttempts: 0,
          teamId: state.currTeamIdx,
          player:
            state.teams[state.currTeamIdx].players[
              state.teams[state.currTeamIdx].currPlayerIdx
            ],
          throws: 3,
        },
      });
      // JAVÍTÁS: Az inputValue törlését is késleltesd
      setTimeout(() => {
        setInputValue("");
      }, 100);
    }
  };

  // JAVÍTOTT FUNKCIÓ: közvetlenül paraméterként kapja meg a dart count-ot
  const handleCheckoutConfirm = (dartCount: number) => {
    // JAVÍTÁS: Itt jelenítsd meg a display animációt checkout esetén
    showScoreDisplayAnimation(pendingScoreValue);

    dispatch({
      type: GameActionType.ADD_SCORE,
      payload: {
        score: pendingScoreValue,
        checkoutAttempts: dartCount,
        teamId: state.currTeamIdx,
        player:
          state.teams[state.currTeamIdx].players[
            state.teams[state.currTeamIdx].currPlayerIdx
          ],
        throws: 3 - dartCount,
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
      // Reset display states is
      setShowScoreDisplay(false);
      setDisplayedScore("");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className="w-full flex items-center px-20 py-5">
      <NewScoreDisplay
        currentScore={displayedScore}
        isVisible={showScoreDisplay && state.settings.displayScore}
      />
      <CheckoutAttempts
        open={dartsThrownToCheckoutOpen}
        onOpenChange={(open) => {
          if (!open) {
            setInputValue(pendingScore);
            setPendingScore("");
            setPendingScoreValue(0);
            setDartsThrownToCheckout(0);
            setShowScoreDisplay(false);
            setDisplayedScore("");
          }
          setDartsThrownToCheckoutOpen(open);
        }}
        dartsThrownToCheckout={dartsThrownToCheckout}
        setDartsThrownToCheckout={setDartsThrownToCheckout}
        handleCheckoutConfirm={handleCheckoutConfirm}
        handleModalKeyDown={handleModalKeyDown}
        pendingScore={pendingScore}
        pendingRemaining={currentRemainingScore - pendingScoreValue}
      />

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