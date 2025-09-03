import { Badge } from '@/app/types/types';
import React, { FC } from 'react'

interface ITeamBadgeProps{
    teamId: number;
    badges: Badge[];
}

const TeamBadges:FC<ITeamBadgeProps> = ({teamId, badges}) => {
  return (
    <div className='relative left-5 top-5 flex -gap-4'>
        {badges.map((badge, badgeIdx) => {
            return (
                <div key={badgeIdx} className={badgeIdx === 0 ? "" : "-ml-2"}><BadgeDiv {...badge}/></div>
            )
        })}
    </div>
  )
}

export default TeamBadges;

const BadgeDiv:FC<Badge> = ({name, desc, icon: Icon, color}) => {
    return(
        <div className='relative group w-fit h-fit flex justify-center items-center z-100'>
            <div className='absolute -bottom-12 rounded-sm left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-background p-2 h-10 transition'>
                <p>{name}</p>
            </div>
            <div className='w-fit h-fit rounded-full flex justify-center items-center p-2 bg-background'><Icon color={color} size={20}/></div>
        </div>
    )
}