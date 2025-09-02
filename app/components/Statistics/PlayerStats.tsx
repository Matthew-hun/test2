import { useGame } from "@/app/hooks/GameProvider";
import { StatsCalculator } from "@/app/hooks/Stats";
import React, { FC } from "react";
import { Tag } from 'antd';
import { TrendingUp, Trophy, Target } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompareTypes } from "@/app/types/types";

interface IPlayerStatsProps {
  teamId: number;
  playerId: number;
  compare: CompareTypes;
}

const PlayerStats: FC<IPlayerStatsProps> = ({
  teamId,
  playerId,
  compare,
}: IPlayerStatsProps) => {
  const { state } = useGame();

  const player = state.teams[Number(teamId)]?.players.find(
    (p) => p.playerId === playerId
  );

  const players = StatsCalculator.GetPlayers(state, compare, teamId, playerId);
  const tableData = StatsCalculator.GetTableFormattedData(state, compare, teamId, playerId);

  if (!player) return (
    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700">
      <div className="text-center">
        <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-300 text-lg font-medium">No player data available</p>
      </div>
    </div>
  );
  
  if (!players || !tableData) return (
    <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700">
      <div className="text-center">
        <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-300 text-lg font-medium">No stats data available</p>
      </div>
    </div>
  );

  // Függvény a legnagyobb érték(ek) megtalálásához egy sorban
  const getMaxIndices = (values: (string | number)[]): number[] => {
    const numericValues = values.map((val, index) => {
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return { value: isNaN(num) ? -Infinity : num, index };
    });

    const maxValue = Math.max(...numericValues.map(item => item.value));
    
    if (maxValue === -Infinity) return [];
    
    return numericValues
      .filter(item => item.value === maxValue)
      .map(item => item.index);
  };

  // Komponens a cellák renderelésére
  const renderCell = (value: string | number, isMax: boolean, hasMultipleMax: boolean) => {
    if (isMax) {
      if (hasMultipleMax) {
        return (
          <Tag 
            color="#1677ff" 
            className="font-semibold shadow-sm border-0"
            style={{
              background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
              color: 'white',
              borderRadius: '8px',
              padding: '4px 12px',
              fontWeight: '600'
            }}
          >
            <Trophy className="w-3 h-3 inline mr-1" />
            {value}
          </Tag>
        );
      } else {
        return (
          <Tag 
            color="#52c41a" 
            className="font-semibold shadow-sm border-0"
            style={{
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              color: 'white',
              borderRadius: '8px',
              padding: '4px 12px',
              fontWeight: '600'
            }}
          >
            <Trophy className="w-3 h-3 inline mr-1" />
            {value}
          </Tag>
        );
      }
    }
    return <span className="text-slate-300 font-medium">{value}</span>;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header szekció */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Player Statistics</h2>
            <p className="text-slate-400">Performance metrics and comparisons</p>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Tag 
              color="#52c41a" 
              className="font-semibold"
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                color: 'white',
                borderRadius: '6px'
              }}
            >
              <Trophy className="w-3 h-3 inline mr-1" />
              Best
            </Tag>
            <span className="text-slate-300 text-sm">Egyetlen legjobb érték</span>
          </div>
        </div>
      </div>

      {/* Főtáblázat */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
              <TableHead className="w-[200px] text-white font-bold text-base py-4 px-6 border-r border-slate-600">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Statistic</span>
                </div>
              </TableHead>
              {players.map((player, index) => (
                <TableHead 
                  key={`player-${index}`} 
                  className="text-white font-bold text-center py-4 px-4 border-r border-slate-600 last:border-r-0"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">{player.title}</div>
                    <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, rowIndex) => {
              const maxIndices = getMaxIndices(row.values);
              const hasMultipleMax = maxIndices.length > 1;

              return (
                <TableRow 
                  key={`row-${rowIndex}`} 
                  className="border-slate-700 hover:bg-slate-800/50 transition-all duration-200"
                >
                  <TableCell className="font-bold text-slate-200 py-4 px-6 border-r border-slate-700 bg-slate-800/30">
                    {row.statName}
                  </TableCell>
                  {row.values.map((value, valueIndex) => {
                    const isMax = maxIndices.includes(valueIndex);
                    
                    return (
                      <TableCell
                        key={`cell-${rowIndex}-${valueIndex}`}
                        className="text-center py-4 px-4 border-r border-slate-700 last:border-r-0"
                      >
                        <div className="flex justify-center">
                          {renderCell(value, isMax, hasMultipleMax)}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayerStats;