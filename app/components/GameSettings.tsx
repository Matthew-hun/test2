"use client";
import React, { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { CheckOutModeType, GameModeType, Player, Team } from "../types/types";
// Javított import:
import {
  Button,
  Checkbox,
  CheckboxProps,
  ConfigProvider,
  Input,
  InputNumber,
  message,
  Segmented,
  Select,
} from "antd";
import {
  IoAddCircle,
  IoClose,
  IoPeople,
  IoPersonAdd,
  IoPlay,
  IoSettings,
} from "react-icons/io5";
import usePlayers from "../hooks/usePlayers";
import { GameActionType, useGame } from "../hooks/GameProvider";
import { useTheme } from "next-themes";

export interface GameSettingsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const GameSettings: FC<GameSettingsProps> = ({
  open,
  setOpen,
}: GameSettingsProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="min-w-[50vw] bg-background-light text-white border-0 overflow-y-scroll custom-scrollbar"
      >
        <SheetHeader>
          <SheetTitle className="text-white">Game Settings</SheetTitle>
        </SheetHeader>
        <div className="w-full flex flex-col gap-4 p-4">
          <Theme />
          <Settings />
          <TeamSetup />
          <AddNewPlayer />
        </div>
        <SheetFooter>
          <ActionButtons setOpen={setOpen} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};


export default GameSettings;

const Theme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-4 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="cursor-pointer w-4 h-4 rounded-full bg-[#5f5cff]" onClick={() => setTheme('purple')}></div>
      <div className="cursor-pointer w-4 h-4 rounded-full bg-[#10b981]" onClick={() => setTheme('emerald')}></div>
      {/* <div className="cursor-pointer w-4 h-4 rounded-full bg-primary"></div> */}
    </div>
  )
}

const Settings = () => {
  const { state, dispatch } = useGame();
  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemActiveBg: "var(--color-primary-active)",
            itemHoverBg: "var(--color-primary-hover)",
            itemSelectedBg: "var(--color-primary)",
            trackBg: "var(--color-background)",
            itemColor: "white",
            itemHoverColor: "white",
            itemSelectedColor: "white",
          },
          InputNumber: {
            colorBgContainer: "var(--color-background)",
            colorText: "white",
            colorBorder: "transparent",
            colorPrimary: "var(--color-primary)",
            colorPrimaryHover: "var(--color-primary-hover)",
          },
        },
        token: {
          colorText: "white",
          colorPrimary: "var(--color-primary)",
          colorPrimaryBorder: "var(--color-primary)",
          colorPrimaryHover: "var(--color-primary-hover)",
          colorBgContainer: "var(--color-background)",
          colorBorder: "transparent",
        },
      }}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <IoSettings className="text-white text-sm" />
          </div>
          <h2 className="text-xl font-semibold text-white">Match Settings</h2>
        </div>

        <div className="flex gap-6">
          {/* Game Mode */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Game Mode
            </label>
            <Segmented
              options={Object.values(GameModeType)}
              value={state.settings.gameMode}
              onChange={(value) =>
                dispatch({ type: GameActionType.SET_GAME_MODE, payload: value })
              }
              size="large"
            />
          </div>

          {/* Legs */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Number of Legs
            </label>
            <Segmented
              options={Array.from({ length: 5 }, (_, i) => i + 1)}
              value={state.settings.numberOfLegs}
              onChange={(value) =>
                dispatch({
                  type: GameActionType.SET_NUMBER_OF_LEGS,
                  payload: value,
                })
              }
              size="large"
            />
          </div>

          {/* Checkout Mode */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Checkout Mode
            </label>
            <Segmented
              options={Object.values(CheckOutModeType)}
              value={state.settings.checkOutMode}
              onChange={(value) =>
                dispatch({
                  type: GameActionType.SET_CHECKOUT_MODE,
                  payload: value,
                })
              }
              size="large"
            />
          </div>

          {/* Starting Score */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Starting Score
            </label>
            <InputNumber
              value={state.settings.startingScore}
              onChange={(value) =>
                dispatch({
                  type: GameActionType.SET_STARTING_SCORE,
                  payload: Number(value),
                })
              }
              controls={false}
              size="large"
            />
          </div>
        </div>

        {/* Random Options */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={state.settings.randomStartingTeam}
                onChange={(e) =>
                  dispatch({
                    type: GameActionType.SET_RANDOM_STARTING_TEAM,
                    payload: e.target.checked,
                  })
                }
                className="text-white"
              />
              <span className="text-slate-300 font-medium">
                Random Starting Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

interface PlayerOptions {
  label: string;
  value: string | number | null; // vagy csak number, ha nem lehet null
}

const TeamSetup = () => {
  const { players } = usePlayers();
  const { state, dispatch } = useGame();

  const [messageApi, contextHolder] = message.useMessage();
  const Message = (type: "error" | "success", message: string) => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorBgContainer: "var(--color-background-light)",
            colorText: "white",
            optionSelectedBg: "var(--color-primary-hover)",
            optionSelectedColor: "black",
            controlOutline: "var(--color-primary)",
            borderRadius: 8,
            clearBg: "var(--color-background-light)",
            colorTextPlaceholder: "gray",
          },
          Message: {
            contentBg: "var(--color-background)",
            colorText: "white",
          },
        },
      }}
    >
      {contextHolder}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <IoPeople className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Teams & Players
            </h2>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
              {state.teams.length} {state.teams.length === 1 ? "Team" : "Teams"}
            </span>
          </div>
          <button
            onClick={() => {
              dispatch({ type: GameActionType.ADD_TEAM });
              dispatch({
                type: GameActionType.ADD_EMPTY_PLAYER,
                payload: state.teams.length,
              });
            }}
            className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-primary/25"
          >
            <IoAddCircle className="text-lg" />
            Add Team
          </button>
        </div>

        {/* Teams Grid */}
        {state.teams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {state.teams.map((team, teamIndex) => (
              <div
                key={`team-${teamIndex}`}
                className="bg-white/10 border border-slate-600 rounded-xl p-5 hover:border-primary/50 transition-all duration-300 group"
              >
                {/* Team Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {!state.settings.randomStartingTeam && (
                        <input
                          name="startingTeam"
                          type="radio"
                          className="accent-primary w-4 h-4"
                          checked={state.settings.startingTeam === teamIndex}
                          onChange={() =>
                            dispatch({
                              type: GameActionType.SET_STARTING_TEAM,
                              payload: teamIndex,
                            })
                          }
                        />
                      )}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary rounded-lg flex items-center justify-center text-white font-bold">
                      {teamIndex + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Team {team.teamId + 1}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {team.players.length} players
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      dispatch({
                        type: GameActionType.REMOVE_TEAM,
                        payload: teamIndex,
                      })
                    }
                    className="cursor-pointer w-8 h-8 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <IoClose className="text-sm" />
                  </button>
                </div>

                {/* Players */}
                <div className="space-y-3">
                  {team.players.map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                        {playerIndex + 1}
                      </div>
                      <div className="flex-1">
                        <Select
                          size="large"
                          className="w-full"
                          options={players.map((player) => ({
                            label: player.name,
                            value: player.playerId, // <-- csak az ID kerül ide
                          }))}
                          value={player.playerId ?? undefined}
                          placeholder={`Select Player ${playerIndex + 1}`}
                          onChange={(value) => {
                            const selectedPlayer = players.find(p => p.playerId === value);
                            if (selectedPlayer) {
                              dispatch({
                                type: GameActionType.UPDATE_PLAYER_IN_TEAM,
                                payload: {
                                  teamIdx: teamIndex,
                                  playerIdx: playerIndex,
                                  newPlayer: selectedPlayer,
                                },
                              });
                            }
                          }}
                          showSearch
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          getPopupContainer={(triggerNode) => triggerNode.parentElement}
                          dropdownStyle={{ zIndex: 999999 }}
                          style={{ pointerEvents: "auto" }}
                        />

                      </div>
                      <button
                        onClick={() => {
                          if (state.teams[teamIndex].players.length <= 1) {
                            // Message("error", "You need atleast one player");
                            toast("You need at least one Player");
                          } else {
                            dispatch({
                              type: GameActionType.REMOVE_PLAYER_FROM_TEAM,
                              payload: {
                                teamIdx: teamIndex,
                                playerIdx: playerIndex,
                              },
                            });
                          }
                        }}
                        className="cursor-pointer w-8 h-8 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                      >
                        <IoClose className="text-sm" />
                      </button>
                    </div>
                  ))}

                  {/* Add Player Button */}
                  <button
                    onClick={() =>
                      dispatch({
                        type: GameActionType.ADD_EMPTY_PLAYER,
                        payload: teamIndex,
                      })
                    }
                    className="cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-primary/20 border border-dashed border-slate-500 hover:border-primary text-slate-400 hover:text-primary py-3 rounded-lg transition-all duration-200 font-medium"
                  >
                    <IoAddCircle className="text-lg" />
                    Add Player
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoPeople className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No teams yet
            </h3>
            <p className="text-slate-400 mb-6">
              Add your first team to get started
            </p>
            <button
              onClick={() => {
                dispatch({ type: GameActionType.ADD_TEAM });
                dispatch({
                  type: GameActionType.ADD_EMPTY_PLAYER,
                  payload: state.teams.length,
                });
              }}
              className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary text-white px-6 py-3 rounded-lg font-medium mx-auto transition-all duration-200 shadow-lg hover:shadow-primary/25"
            >
              <IoAddCircle className="text-lg" />
              Add First Team
            </button>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

const AddNewPlayer = () => {
  const { AddPlayer } = usePlayers();

  const [newPalyerName, setNewPlayerName] = useState<string>("");

  const [messageApi, contextHolder] = message.useMessage();
  const Message = (type: "error" | "success", message: string) => {
    messageApi.open({
      type: type,
      content: message,
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            activeBorderColor: "var(--color-primary)",
          },
          Message: {
            contentBg: "var(--color-background)",
            colorText: "white",
          },
        },
        token: {
          colorBgContainer: "var(--color-background)",
          colorTextPlaceholder: "var(--color-placeholder)",
          colorText: "white",
          colorBorder: "transparent",
        },
      }}
    >
      {contextHolder}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <IoPersonAdd className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-white">Add new Player</h2>
          </div>
        </div>

        <div className="flex gap-4">
          <Input
            value={newPalyerName}
            placeholder="Player name"
            onChange={(e) => setNewPlayerName(e.target.value)}
            size="large"
          />
          <button
            onClick={() => {
              try {
                AddPlayer(newPalyerName);
              } catch (error) {
                error instanceof Error && Message("error", error.message);
              }
            }}
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-primary/20 border border-dashed border-slate-500 hover:border-primary text-slate-400 hover:text-primary py-3 rounded-lg transition-all duration-200 font-medium"
          >
            <IoAddCircle className="text-lg" />
            Add Player
          </button>
        </div>
      </div>
    </ConfigProvider>
  );
};

interface ActionButtonsProps {
  setOpen: (value: boolean) => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ setOpen }) => {
  const { state, dispatch } = useGame();
  return (
    state.teams.length > 0 && (
      <div className="flex justify-end gap-4 mt-8">
        {/* Save Button - Medium emerald */}
        {/* <button
              onClick={Close}
              className="cursor-pointer flex items-center gap-2 bg-emerald-700/30 hover:bg-primary/40 border border-primary/40 hover:border-primary/60 text-emerald-200 hover:text-emerald-100 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-primary/15"
            >
              <IoSave className="text-lg" />
              Save current match
            </button> */}

        {/* Primary Action Button - Full emerald */}
        <button
          onClick={() => {
            dispatch({ type: GameActionType.CREATE_GAME });
            setOpen(false);
          }}
          className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-primar/50 to-primary hover:from-primary/50 hover:to-primary text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-primary/25"
        >
          <IoPlay className="text-lg" />
          Start Game
        </button>
      </div>
    )
  );
};
