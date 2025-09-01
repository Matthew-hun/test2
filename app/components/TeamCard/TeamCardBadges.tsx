import { useGame } from "@/app/hooks/GameProvider";
import { StatsCalculator } from "@/app/hooks/Stats";
import { Badge, Team } from "@/app/types/types";
import { Preahvihear } from "next/font/google";
import React, { FC, useEffect, useState } from "react";
import { GiDart } from "react-icons/gi";

interface ITeamCardBadgesProps {
  teamId: number;
}

const TeamCardBadges: FC<ITeamCardBadgesProps> = ({ teamId }) => {
  const { state } = useGame();
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const bestCheckoutTeam = StatsCalculator.GetBestCheckoutTeam(state);
    console.log(bestCheckoutTeam);
    if (bestCheckoutTeam) {
        const newBadge: Badge = {
            name: "Best checkout",
            desc: "",
            icon: <GiDart />,
            color: "#000",
        }
        setBadges((prev) => [...prev, newBadge]);
    }
  }, [state]);

  return (
    <div className="w-[20px] h-full absolute left-0 bg-red-500 flex flex-col justify-center items-center">
        asd
      {badges.map((badge) => {
        return (<div>{badge.icon}</div>)
      })}
    </div>
  );
};

export default TeamCardBadges;
