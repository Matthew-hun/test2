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
import {
  CheckoutModeType,
  Game,
  GameModeType,
  Player,
  type Settings,
  Team,
} from "../types/types";
// Javított import:
import {
  Button,
  Checkbox,
  CheckboxProps,
  ColorPicker,
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
import { TimerReset } from "lucide-react";

export interface GameSettingsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const GameSettings: FC<GameSettingsProps> = ({
  open,
  setOpen,
}: GameSettingsProps) => {
  const { state } = useGame();
  const [settings, setSettings] = useState<Settings>(state.settings);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const game = localStorage.getItem("game");
    if (game) {
      const parsedGame: Game = JSON.parse(game);
      setSettings(parsedGame.settings);
      setTeams(parsedGame.teams);
    }
  }, []);

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
          <Settings settings={settings} setSettings={setSettings} />
          <TeamSetup teams={teams} setTeams={setTeams} />
          <AddNewPlayer />
        </div>
        <SheetFooter>
          <ActionButtons setOpen={setOpen} settings={settings} teams={teams} />
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
      <div
        className="cursor-pointer w-4 h-4 rounded-full bg-[#5f5cff]"
        onClick={() => setTheme("purple")}
      ></div>
      <div
        className="cursor-pointer w-4 h-4 rounded-full bg-[#10b981]"
        onClick={() => setTheme("emerald")}
      ></div>
      {/* <div className="cursor-pointer w-4 h-4 rounded-full bg-primary"></div> */}
    </div>
  );
};

interface ISettingsProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const Settings: FC<ISettingsProps> = ({
  settings,
  setSettings,
}: ISettingsProps) => {
  const { state, dispatch } = useGame();

  useEffect(() => {
    setSettings(state.settings);
  }, [state.settings]);

  const handleSettingsChange = <T extends keyof Settings>(
    key: T,
    value: Settings[T]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

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

        <div className="flex flex-wrap gap-6">
          {/* Game Mode */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Game Mode
            </label>
            <Segmented
              options={Object.values(GameModeType)}
              value={settings?.gameMode ?? GameModeType.FirstTo}
              onChange={(value) => handleSettingsChange("gameMode", value)}
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
              value={settings?.numberOfLegs ?? 3}
              onChange={(value) => handleSettingsChange("numberOfLegs", value)}
              size="large"
            />
          </div>

          {/* Checkout Mode */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Checkout Mode
            </label>
            <Segmented
              options={Object.values(CheckoutModeType)}
              value={settings?.checkoutMode ?? CheckoutModeType.Double}
              onChange={(value) => handleSettingsChange("checkoutMode", value)}
              size="large"
            />
          </div>

          {/* Starting Score */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Starting Score
            </label>
            <InputNumber
              value={settings?.startingScore ?? 501}
              onChange={(value) =>
                handleSettingsChange("startingScore", Number(value))
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
                checked={settings?.randomStartingTeam ?? false}
                onChange={(e) =>
                  handleSettingsChange("randomStartingTeam", e.target.checked)
                }
                className="text-white"
              />
              <span className="text-slate-300 font-medium">
                Random Starting Team
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={settings?.displayScore ?? false}
                onChange={(e) =>
                  handleSettingsChange("displayScore", e.target.checked)
                }
                className="text-white"
              />
              <span className="text-slate-300 font-medium">Display score</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={settings?.askNumberOfThrows ?? false}
                onChange={(e) =>
                  handleSettingsChange("askNumberOfThrows", e.target.checked)
                }
                className="text-white"
              />
              <span className="text-slate-300 font-medium">
                Ask number of throws
              </span>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

interface ITeamSetupProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamSetup: FC<ITeamSetupProps> = ({
  teams,
  setTeams,
}: ITeamSetupProps) => {
  const { players } = usePlayers();
  const { state, dispatch } = useGame();

  const [messageApi, contextHolder] = message.useMessage();
  const Message = (type: "error" | "success", message: string) => {
    messageApi.open({ type, content: message });
  };

  const AddTeam = () => {
    const newTeam: Team = {
      teamId: teams.length,
      players: [
        {
          playerId: -1, // üres slot
          name: "",
        },
      ],
      currPlayerIdx: 0,
      wins: 0,
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const RemoveTeam = (teamIndex: number) => {
    setTeams((prev) => prev.filter((_, idx) => idx !== teamIndex));
  };

  const AddPlayer = (teamIndex: number) => {
    const newEmptyPlayer: Player = {
      playerId: -1, // üres slot
      name: "",
    };

    setTeams((prev) =>
      prev.map((team, idx) =>
        idx === teamIndex
          ? {
              ...team,
              players: [...team.players, newEmptyPlayer],
            }
          : team
      )
    );
  };

  const RemovePlayer = (teamIndex: number, playerIndex: number) => {
    setTeams((prev) =>
      prev.map((team, idx) =>
        idx === teamIndex
          ? {
              ...team,
              players:
                team.players.length > 1
                  ? team.players.filter((_, pIdx) => pIdx !== playerIndex)
                  : team.players,
            }
          : team
      )
    );
  };

  const UpdatePlayerInTeam = (
    teamIndex: number,
    playerIndex: number,
    newPlayer: Player
  ) => {
    setTeams((prev) =>
      prev.map((team, idx) =>
        idx === teamIndex
          ? {
              ...team,
              players: team.players.map((p, pIdx) =>
                pIdx === playerIndex ? newPlayer : p
              ),
            }
          : team
      )
    );
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
              {teams.length} {teams.length === 1 ? "Team" : "Teams"}
            </span>
          </div>
          <button
            onClick={AddTeam}
            className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-primary/25"
          >
            <IoAddCircle className="text-lg" />
            Add Team
          </button>
        </div>

        {teams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team, teamIndex) => (
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
                    onClick={() => RemoveTeam(teamIndex)}
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
                          options={players.map((p) => ({
                            label: p.name,
                            value: p.playerId,
                          }))}
                          value={
                            player.playerId !== -1 ? player.playerId : undefined
                          }
                          placeholder={`Select Player ${playerIndex + 1}`}
                          onChange={(value) => {
                            const selectedPlayer = players.find(
                              (p) => p.playerId === value
                            );
                            if (selectedPlayer) {
                              UpdatePlayerInTeam(
                                teamIndex,
                                playerIndex,
                                selectedPlayer
                              );
                            }
                          }}
                          showSearch
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentElement
                          }
                          dropdownStyle={{ zIndex: 999999 }}
                          style={{ pointerEvents: "auto" }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (team.players.length <= 1) {
                            toast("You need at least one Player");
                          } else {
                            RemovePlayer(teamIndex, playerIndex);
                          }
                        }}
                        className="cursor-pointer w-8 h-8 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                      >
                        <IoClose className="text-sm" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => AddPlayer(teamIndex)}
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
              onClick={AddTeam}
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
  settings: Settings;
  teams: Team[];
}

const ActionButtons: FC<ActionButtonsProps> = ({
  setOpen,
  settings,
  teams,
}) => {
  const { state, dispatch } = useGame();
  return (
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
          dispatch({ type: GameActionType.RESET_FULL });
          setOpen(false);
        }}
        className="cursor-pointer flex items-center gap-2 bg-background hover:bg-primary/70 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-primary/25"
      >
        <TimerReset className="text-lg" />
        Reset Default
      </button>
      <button
        onClick={() => {
          dispatch({ type: GameActionType.SET_SETTINGS, payload: settings });
          dispatch({ type: GameActionType.SET_TEAMS, payload: teams });
          dispatch({ type: GameActionType.CREATE_GAME });
          setOpen(false);
        }}
        className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-primar/50 to-primary hover:from-primary/50 hover:to-primary text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-primary/25"
      >
        <IoPlay className="text-lg" />
        Start Game
      </button>
    </div>
  );
};
