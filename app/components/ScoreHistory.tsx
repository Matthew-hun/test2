import React, { FC, useEffect, useState } from 'react'
import { GetLegScoreHistory } from '../hooks/selectors'
import { useGame } from '../hooks/GameProvider'
import { Score } from '../types/types';
import { Separator } from "@/components/ui/separator"

interface ScoreHistoryProps {
  teamId: number,
}

const ScoreHistory: FC<ScoreHistoryProps> = ({ teamId }: ScoreHistoryProps) => {

  const { state } = useGame();

  const [scoreHistory, setScoreHistory] = useState<Score[]>([]);

  useEffect(() => {
    setScoreHistory(GetLegScoreHistory(state, teamId, state.currLegIdx).reverse().slice(0, 5));
  }, [state])
  return (
    <div>
      {
        scoreHistory.length > 0 && scoreHistory.map((score, scoreIdx) => {
          return (<div key={scoreIdx} className='flex h-8 items-center space-x-4 bg-background/20 px-4 py-2'>
            <div className='flex flex-1/4 flex justify-center items-center text-gray-400'>{scoreIdx + 1}</div>
            <Separator orientation='vertical' color='#9ca3af' />
            <div className={`flex flex-1/4 flex justify-center items-center text-gray-400 font-bold ${score.score === 180 ? "text-rose-500" : "text-primary"}`}>{score.score}</div>
            <Separator orientation='vertical' />
            <div className='flex flex-1/4 flex justify-center items-center text-gray-400'>{score.remainingScore}</div>
            <Separator orientation='vertical' />
            <div className='flex flex-1/4 flex justify-center items-center text-gray-400'>{score.player.name}</div>
          </div>)
        })
      }
    </div>
  )
}

export default ScoreHistory