"use client";

import React, { useEffect, useState } from "react";
import { getDaysUntilBilling, getNextBillingDate } from "@subslash/shared";
import { cn } from "@lib/utils";

/**
 * Uses the shared billing-date helpers so the badge always agrees with the
 * D-Day ordering the dashboard applies to the same list.
 */
function useLocalDday(billingDay: number) {
  const [dDay, setDDay] = useState(() => getDaysUntilBilling(billingDay));
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = getDaysUntilBilling(billingDay, now);
      setDDay(days);

      if (days <= 1) {
        const diffMs = getNextBillingDate(billingDay, now).getTime() - now.getTime();
        const clamped = Math.max(0, diffMs);
        const hours = Math.floor((clamped % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((clamped % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((clamped % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [billingDay]);

  return { dDay, timeLeft };
}

export function DdayCountdown({
  billingDay,
  className,
}: {
  billingDay: number;
  className?: string;
}) {
  const { dDay, timeLeft } = useLocalDday(billingDay);

  const isDanger = dDay <= 1;
  const isWarning = dDay === 2 || dDay === 3;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "text-2xl font-bold transition-all",
          isDanger
            ? "text-red-500 animate-pulse"
            : isWarning
              ? "text-yellow-500"
              : "text-green-500",
        )}
      >
        {dDay === 0 ? "D-Day" : `D-${dDay}`}
      </div>
      {isDanger && <div className="text-xs font-mono text-red-500 mt-1">{timeLeft}</div>}
    </div>
  );
}
