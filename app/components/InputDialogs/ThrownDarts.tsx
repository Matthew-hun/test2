import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { FC } from "react";

interface IThrownDartsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  dartsThrownToCheckout: number;
  setThrownDarts: (value: number) => void;
  handleConfirm: (value: number) => void;
  pendingScore: string;
  pendingRemaining: number;
}

const ThrownDarts: FC<IThrownDartsProps> = ({
  open,
  setOpen,
  dartsThrownToCheckout,
  setThrownDarts,
  handleConfirm,
  pendingScore,
  pendingRemaining,
}) => {

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const key = e.key;
    if (["0", "1", "2", "3"].includes(key)) {
      const dartCount = parseInt(key);
      setThrownDarts(dartCount);
    }
    if (key === "Escape") {
      setOpen(false);
      setThrownDarts(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="text-white"
        onKeyDown={handleModalKeyDown}
        tabIndex={0}
        autoFocus
      >
        <DialogHeader>
          <DialogTitle>Thrown darts</DialogTitle>

          <DialogDescription className="mb-4">
            Score: <span className="font-bold text-white">{pendingScore}</span>
            {" → "}
            Remaining:{" "}
            <span className="font-bold text-primary">{pendingRemaining}</span>
          </DialogDescription>

          <div className="flex gap-2 py-4">
            {Array.from({ length: 4 }, (_, i) => i).map((number) => (
              <div
                key={number}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setThrownDarts(number);
                  setTimeout(() => handleConfirm(number), 150);
                }}
                className={`w-20 h-20 text-3xl font-bold flex justify-center items-center rounded-md cursor-pointer transition-all duration-200 ${
                  dartsThrownToCheckout === number
                    ? "bg-primary text-white"
                    : "bg-background-light hover:bg-primary/20"
                }`}
              >
                {number}
              </div>
            ))}
          </div>

          <DialogDescription>
            Press 0-3 or click on the box
            <br />
            <span className="text-xs text-gray-400">ESC to cancel</span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ThrownDarts;
