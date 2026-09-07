import React from "react";
import { Progress } from "../ui/progress";
import { Currency, formatCurrency } from "@subslash/shared";

interface CostPerUseBarProps {
  costPerUse: number;
  originalAmount: number;
  currency: Currency;
  usageCount: number;
}

export function CostPerUseBar({
  costPerUse,
  originalAmount,
  currency,
  usageCount,
}: CostPerUseBarProps) {
  const ratio = usageCount === 0 ? 100 : Math.min(100, (costPerUse / originalAmount) * 100 * 5);
  const variant = usageCount === 0 ? "destructive" : ratio > 30 ? "warning" : "success";

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-muted-foreground">1회 이용당 비용</span>
        <span className="text-xl font-bold">
          {formatCurrency(Math.round(costPerUse), currency)}
        </span>
      </div>

      <Progress value={ratio} variant={variant} className="h-3" />

      <div className="text-xs text-center text-muted-foreground">
        총 {usageCount}회 이용 · 월 {formatCurrency(originalAmount, currency)} 결제
      </div>
    </div>
  );
}
