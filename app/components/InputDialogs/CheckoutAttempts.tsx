import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ICheckoutAttemptsProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  dartsThrownToCheckout: number;
  setDartsThrownToCheckout: (value: number) => void;
  handleCheckoutConfirm: (value: number) => void;
  handleModalKeyDown: (e: React.KeyboardEvent) => void;
  pendingScore: string;
  pendingRemaining: number;
}

const CheckoutAttempts: FC<ICheckoutAttemptsProps> = ({
  open,
  onOpenChange,
  dartsThrownToCheckout,
  setDartsThrownToCheckout,
  handleCheckoutConfirm,
  handleModalKeyDown,
  pendingScore,
  pendingRemaining,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="text-white"
        onKeyDown={handleModalKeyDown}
        tabIndex={0}
        autoFocus
      >
        <DialogHeader>
          <DialogTitle>Checkout attempts</DialogTitle>

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
                  setDartsThrownToCheckout(number);
                  setTimeout(() => handleCheckoutConfirm(number), 150);
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

export default CheckoutAttempts;
