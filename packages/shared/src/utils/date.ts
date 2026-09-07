export function getNextBillingDate(billingDay: number, now: Date = new Date()): Date {
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentDate = now.getDate();

  let nextBillingDate = new Date(currentYear, currentMonth, billingDay);

  // If the billing day is invalid for the current month (e.g., Feb 30), JS adjusts it to the next month automatically
  // But we want to cap it at the end of the month
  const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const effectiveBillingDay = Math.min(billingDay, lastDayOfCurrentMonth);
  nextBillingDate = new Date(currentYear, currentMonth, effectiveBillingDay);

  if (currentDate >= effectiveBillingDay) {
    // Need to calculate for the next month
    const lastDayOfNextMonth = new Date(currentYear, currentMonth + 2, 0).getDate();
    const nextEffectiveBillingDay = Math.min(billingDay, lastDayOfNextMonth);
    nextBillingDate = new Date(currentYear, currentMonth + 1, nextEffectiveBillingDay);
  }

  return nextBillingDate;
}

export function getDaysUntilBilling(billingDay: number, now: Date = new Date()): number {
  const nextBillingDate = getNextBillingDate(billingDay, now);
  const diffTime = nextBillingDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isPaymentImminent(
  billingDay: number,
  thresholdDays: number,
  now: Date = new Date(),
): boolean {
  const daysLeft = getDaysUntilBilling(billingDay, now);
  return daysLeft >= 0 && daysLeft <= thresholdDays;
}

export function formatDday(daysLeft: number): string {
  if (daysLeft === 0) return "D-Day";
  if (daysLeft > 0) return `D-${daysLeft}`;
  return `D+${Math.abs(daysLeft)}`;
}

export function formatCountdown(targetDate: Date, now: Date = new Date()): string {
  const diffTime = targetDate.getTime() - now.getTime();
  if (diffTime <= 0) return "D-Day 00:00:00";

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  const formatUnit = (unit: number) => unit.toString().padStart(2, "0");

  return `D-${days} ${formatUnit(hours)}:${formatUnit(minutes)}:${formatUnit(seconds)}`;
}
