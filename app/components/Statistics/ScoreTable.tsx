import React, { FC } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { useGame } from "@/app/hooks/GameProvider";
import { Score } from "@/app/types/types";
import { StatsCalculator } from "@/app/hooks/Stats";

interface IScoreTableProps {
  teamId: number;
  playerId: number;
}

const ScoreTable: FC<IScoreTableProps> = ({
  teamId,
  playerId,
}: IScoreTableProps) => {
  const { state, dispatch } = useGame();
  type ScoreKeys = keyof Score;

  const columns = [
    {
      key: "teamId",
      label: "Team",
    },
    {
      key: "legId",
      label: "Leg",
    },
    {
      key: "score",
      label: "Score",
    },
    {
      key: "remainingScore",
      label: "Remaining score",
    },
    {
      key: "checkoutAttempts",
      label: "Checkout attempts",
    },
    {
      key: "throws",
      label: "Throws",
    },
  ];
  const team = state.teams.find((t) => t.teamId === teamId);
  const player = team?.players.find((p) => p.playerId === playerId);
  const scores = StatsCalculator.GetScores(state, teamId, playerId) ?? [];

  const rows = scores
    ? scores.map((score, scoreId) => {
        return { ...score, key: scoreId, legId: score.legId + 1, teamId: "Team" + (score.teamId + 1) };
      })
    : [];

  console.log(scores);

  return (
    <Table aria-label="Example table with dynamic content" className="text-white">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key} className={`${item.remainingScore === 0 ? "border-b-1 border-primary/30" : ""} rounded-md hover:bg-background`}>
            {(columnKey) => (
              <TableCell className={`${columnKey === "score" ? "font-bold text-primary" : ""}`}>
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ScoreTable;
