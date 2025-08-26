"use client"
import { Player } from '@/app/types/types';
import React, { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import usePlayers from '@/app/hooks/usePlayers';
import { Trash2, UserPlus, Users } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

const Page = () => {
  const { players, AddPlayer, RemovePlayer } = usePlayers();
  const [newPlayer, setNewPlayer] = useState<string>("");

  const handleAddPlayer = () => {
    if (newPlayer.trim()) {
      AddPlayer(newPlayer.trim());
      setNewPlayer("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8'>
      <Navbar />
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8 text-center'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <Users className='w-8 h-8 text-purple-400' />
            <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
              Player Management
            </h1>
          </div>
          <p className='text-slate-400 text-lg'>Manage your team players with ease</p>
        </div>

        {/* Add Player Section */}
        <div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50'>
          <div className='flex flex-col sm:flex-row gap-4 items-end'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-slate-300 mb-2'>
                Player Name
              </label>
              <input 
                value={newPlayer} 
                onChange={(e) => setNewPlayer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter player name..."
                className='w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200'
              />
            </div>
            <button 
              onClick={handleAddPlayer}
              disabled={!newPlayer.trim()}
              className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 disabled:shadow-none'
            >
              <UserPlus className='w-4 h-4' />
              Add Player
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-white'>
              Players ({players.length})
            </h2>
            {players.length > 0 && (
              <div className='text-sm text-slate-400'>
                Total players registered
              </div>
            )}
          </div>

          {players.length === 0 ? (
            <div className='text-center py-12'>
              <Users className='w-16 h-16 text-slate-600 mx-auto mb-4' />
              <h3 className='text-xl font-medium text-slate-400 mb-2'>No players yet</h3>
              <p className='text-slate-500'>Add your first player to get started</p>
            </div>
          ) : (
            <div className='overflow-hidden rounded-xl border border-slate-700/50'>
              <Table>
                <TableHeader>
                  <TableRow className='border-slate-700/50 hover:bg-slate-700/30'>
                    <TableHead className='text-slate-300 font-semibold py-4 px-6 bg-slate-700/30'>
                      Player Name
                    </TableHead>
                    <TableHead className='text-slate-300 font-semibold py-4 px-6 bg-slate-700/30 text-center'>
                      Player ID
                    </TableHead>
                    <TableHead className='text-slate-300 font-semibold py-4 px-6 bg-slate-700/30 text-center'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player, index) => (
                    <TableRow 
                      key={player.playerId}
                      className='border-slate-700/50 hover:bg-slate-700/20 transition-colors duration-200'
                    >
                      <TableCell className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm'>
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className='text-white font-medium'>{player.name}</div>
                            <div className='text-slate-400 text-sm'>Player #{index + 1}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='py-4 px-6 text-center'>
                        <span className='px-3 py-1 bg-slate-700/50 rounded-full text-slate-300 text-sm font-mono'>
                          {player.playerId}
                        </span>
                      </TableCell>
                      <TableCell className='py-4 px-6 text-center'>
                        <button 
                          onClick={() => RemovePlayer(player.playerId)}
                          className='inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10'
                        >
                          <Trash2 className='w-4 h-4' />
                          Remove
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;