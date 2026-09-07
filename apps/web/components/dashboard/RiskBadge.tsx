import React from "react";
import { Badge, BadgeProps } from "../ui/badge";
import { RiskLevel } from "@subslash/shared";

export function RiskBadge({
  level,
  showLabel = true,
  size = "md",
}: {
  level: RiskLevel;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const config: Record<RiskLevel, { label: string; color: BadgeProps["variant"] }> = {
    green: { label: "유지", color: "success" },
    yellow: { label: "주의", color: "warning" },
    red: { label: "해지 권고", color: "destructive" },
  };

  const selected = config[level] || config.green;

  return (
    <Badge
      variant={selected.color}
      className={size === "sm" ? "text-[10px] px-1.5" : size === "lg" ? "text-sm px-3 py-1" : ""}
      title={`위험도: ${selected.label}`}
    >
      {showLabel ? selected.label : level === "green" ? "🟢" : level === "yellow" ? "🟡" : "🔴"}
    </Badge>
  );
}
