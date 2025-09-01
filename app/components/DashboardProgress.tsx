import React, { FC, useEffect, useState } from 'react';
import { useGame } from '../hooks/GameProvider';
import { GetRaminingScore } from '../hooks/selectors';

interface DashboardProgressProps {
    teamId: number
    steps: number;
    completed: number;
    size?: number;
    strokeWidth?: number;
    isActive?: boolean;
    gapDegree?: number;
    stepGap?: number;
}

const DashboardProgress: FC<DashboardProgressProps> = ({
    teamId,
    steps,
    completed,
    size = 265,
    strokeWidth = 20,
    isActive = false,
    gapDegree = 75, // Dashboard gap at bottom
    stepGap = 7 // Gap between segments in degrees
}: DashboardProgressProps) => {
    const { state } = useGame();
    const [remainingScore, setRemainingScore] = useState<number>(state.settings.startingScore);

    useEffect(() => {
        console.log("state:", remainingScore);
        setRemainingScore(GetRaminingScore(state, teamId));
    },[state])
    const progress = Math.min((completed / steps) * 100, 100);
    const radius = (size - strokeWidth) / 2;

    // Dashboard arc settings (275 degrees, leaving 85 degrees gap at bottom)
    const startAngle = (90 + gapDegree / 2) * (Math.PI / 180); // Start angle in radians
    const endAngle = (90 - gapDegree / 2) * (Math.PI / 180); // End angle in radians
    const totalAngle = 2 * Math.PI - (gapDegree * Math.PI / 180); // Total arc length

    // Calculate step positions
    const stepAngle = totalAngle / steps;
    const stepGapRad = stepGap * (Math.PI / 180);

    const rotatingRingSize = size + 25;
    const mainCircleSize = size * 0.78;
    const innerCircleSize = mainCircleSize - 16;

    // Generate path for each step
    const generateStepPath = (stepIndex: number, isCompleted: boolean) => {
        const stepStart = startAngle + (stepIndex * stepAngle) + (stepIndex * stepGapRad);
        const stepEnd = stepStart + stepAngle - stepGapRad;

        const startX = size / 2 + radius * Math.cos(stepStart);
        const startY = size / 2 + radius * Math.sin(stepStart);
        const endX = size / 2 + radius * Math.cos(stepEnd);
        const endY = size / 2 + radius * Math.sin(stepEnd);

        const largeArcFlag = stepAngle > Math.PI ? 1 : 0;

        return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    };

    return (
        <div className="relative flex items-center justify-center" style={{ width: rotatingRingSize, height: rotatingRingSize }}>
            {/* SVG Progress Steps */}
            <svg
                width={size}
                height={size}
                className="absolute z-20"
            >
                <defs>
                    <linearGradient id="completedGradient" gradientUnits="userSpaceOnUse"
                        x1="0" y1="0" x2={size} y2={size}>
                        <stop offset="0%" stopColor="var(--color-primary)" />
                        <stop offset="100%" stopColor="var(--color-primary)" />
                    </linearGradient>

                    <linearGradient id="pendingGradient" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Generate all step segments */}
                {Array.from({ length: steps }, (_, index) => {
                    const isCompleted = index < completed;
                    return (
                        <path
                            key={index}
                            d={generateStepPath(index, isCompleted)}
                            stroke={isCompleted ? "url(#completedGradient)" : "url(#pendingGradient)"}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeLinecap="round"
                            className={`transition-all duration-300 ${isCompleted ? 'opacity-100' : 'opacity-60'}`}
                        />
                    );
                })}
            </svg>

            {/* Rotating dashed ring */}

            {isActive && (<div
                className="absolute rounded-full border-3 border-dashed borderprimary opacity-60"
                style={{
                    width: rotatingRingSize,
                    height: rotatingRingSize,
                    animation: 'spin 40s linear infinite'
                }}
            />)}

            {/* Main score circle */}
            <div
                className={`relative rounded-full shadow-black shadow-xl bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl flex items-center justify-center z-10 transition-all duration-300 ${isActive
                    ? "border-4 borderprimary/60 shadowprimary/30"
                    : "border-4 borderprimary/20"
                    }`}
                style={{ width: mainCircleSize, height: mainCircleSize }}
            >
                {/* Inner glow effect */}
                <div
                    className={`absolute rounded-full blur-sm ${isActive
                        ? "bg-gradient-to-r from-primary/25 to-green-500/10"
                        : "bg-gradient-to-r fromprimary/8 to-green-500/10"
                        }`}
                    style={{
                        width: innerCircleSize,
                        height: innerCircleSize,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                />

                {/* Score text */}
                <span className="relative block font-black bg-gradient-to-br from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent z-20"
                    style={{ fontSize: `${mainCircleSize * 0.35}px` }}>
                    {remainingScore}
                </span>
            </div>

            {/* Progress info */}
            {/* <div className="absolute bottom-5 text-center z-30">
                <div className="text-sm text-gray-400">
                    {completed} / {steps}
                </div>
                <div className="text-xs text-gray-500">
                    {Math.round(progress)}% Complete
                </div>
            </div> */}
        </div>
    );
};

export default DashboardProgress;