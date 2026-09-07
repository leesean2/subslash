import { useState, useEffect } from "react";
import { getDaysUntilBilling, getNextBillingDate } from "@subslash/shared";

export function useDday(billingDay: number) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const days = getDaysUntilBilling(billingDay);
    const next = getNextBillingDate(billingDay);
    return {
      daysLeft: days,
      formatted: `D-${days === 0 ? "Day" : days}`,
      isImminent: days <= 3,
      nextBillingDate: next,
    };
  });

  useEffect(() => {
    const updateCountdown = () => {
      const days = getDaysUntilBilling(billingDay);
      const next = getNextBillingDate(billingDay);
      setTimeLeft({
        daysLeft: days,
        formatted: `D-${days === 0 ? "Day" : days}`,
        isImminent: days <= 3,
        nextBillingDate: next,
      });
    };

    updateCountdown();
    // Update every hour since days don't change often
    const intervalId = setInterval(updateCountdown, 1000 * 60 * 60);

    return () => clearInterval(intervalId);
  }, [billingDay]);

  return timeLeft;
}
