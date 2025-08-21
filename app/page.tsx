"use client";
import { GameActionType, useGame } from "./hooks/GameProvider";
import Main from "./pages/Main";
import { useEffect } from "react";

export default function Home() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    dispatch({ type: GameActionType.LOAD_GAME });
  }, [dispatch]);

  return <Main />;
}
