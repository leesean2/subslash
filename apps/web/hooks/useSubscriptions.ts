import { useStore } from "../lib/store";
import { getDaysUntilBilling } from "@subslash/shared";
import { useMemo } from "react";

export function useSubscriptions() {
  const store = useStore();

  const { subscriptions, getActiveSubscriptions } = store;

  const sortedByDday = useMemo(() => {
    void subscriptions;
    return [...getActiveSubscriptions()].sort(
      (a, b) => getDaysUntilBilling(a.billingDay) - getDaysUntilBilling(b.billingDay),
    );
  }, [subscriptions, getActiveSubscriptions]);

  const upcomingBillings = (days: number) => {
    return sortedByDday.filter((sub) => getDaysUntilBilling(sub.billingDay) <= days);
  };

  return {
    ...store,
    sortedByDday,
    upcomingBillings,
  };
}
