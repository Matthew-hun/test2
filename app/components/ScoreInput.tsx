import { Button, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useGame } from "../hooks/GameProvider";

const ScoreInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { state, dispatch } = useGame();

  const [messageApi, contextHolder] = message.useMessage();

  // Native HTML input ref
  const inputRef = useRef<HTMLInputElement>(null);

  const info = (message: string) => {
    messageApi.open({
      type: "warning",
      content: message,
      className: "text-black",
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [state]);

  return (
    <div className="w-full flex items-center px-20 py-5">
      {contextHolder}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {setInputValue(e.target.value)}}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        placeholder="Score"
        pattern="[Rr]?(0|[1-9][0-9]{0,2})"
        className="w-full text-center text-white font-bold flex-1 bg-transparent border-b-2 border-0 outline-none text-lg placeholder-gray-400 invalid:border-rose-700 invalid:text-rose-700 focus:border-b-2 focus:placeholder-gray-300 disabled:opacity-50 animate-pulse"
      />
    </div>
  );
};

export default ScoreInput;
