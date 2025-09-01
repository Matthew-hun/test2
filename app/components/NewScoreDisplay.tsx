import React from "react";
import { createPortal } from "react-dom";
import ConfettiExplosion from "react-confetti-explosion";

interface NewScoreDisplayProps {
  currentScore: string;
  isVisible: boolean;
}

const NewScoreDisplay = ({ currentScore, isVisible }: NewScoreDisplayProps) => {
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 50);

      // confetti késleltetve induljon
      const start = setTimeout(() => setShowConfetti(true), 1000);

      return () => {
        clearTimeout(start);
      };
    } else {
      setIsAnimating(false);
      setShowConfetti(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isVisible]);

  if (!shouldRender || !currentScore) return null;

  return createPortal(
    <div
      className="bg-black/0 backdrop-blur-sm rounded-xl border border-blue-500/30"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 8888,
        pointerEvents: "none",
        opacity: isAnimating ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: isAnimating ? "scale(1)" : "scale(0.95)",
          transition: "transform 300ms ease-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          className="text-white font-black text-[500px]"
          style={{
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 400ms ease-out 200ms, transform 400ms ease-out 200ms",
          }}
        >
          {currentScore}
        </div>
        
        {(
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <ConfettiExplosion
              particleCount={Number(currentScore)}
              particleSize={12}
              duration={10000}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default NewScoreDisplay;