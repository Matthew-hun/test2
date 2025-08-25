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

const Page = () => {
  const { players, AddPlayer, RemovePlayer } = usePlayers();
  const [newPlayer, setNewPlayer] = useState<string>("");

  return (
    <div className='w-screen h-screen text-white'>
      <input value={newPlayer} onChange={(e) => setNewPlayer(e.target.value)} />
      <button onClick={() => AddPlayer(newPlayer)}>Add</button>
      <Table className='w-fit'>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            return (<TableRow key={player.playerId}><TableCell>{player.name}</TableCell><TableCell>{player.playerId}</TableCell><TableCell><button onClick={() => RemovePlayer(player.playerId)}>Delete</button></TableCell></TableRow>)
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
