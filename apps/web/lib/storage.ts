import type { Subscription, UsageLog } from "@subslash/shared";

const STORAGE_KEYS = {
  SUBSCRIPTIONS: "subslash_subscriptions",
  USAGE_LOGS: "subslash_usage_logs",
  SETTINGS: "subslash_settings",
} as const;

export function getStoredSubscriptions(): Subscription[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
  return data ? JSON.parse(data) : [];
}

export function setStoredSubscriptions(subs: Subscription[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
}

export function getStoredUsageLogs(): UsageLog[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.USAGE_LOGS);
  return data ? JSON.parse(data) : [];
}

export function setStoredUsageLogs(logs: UsageLog[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USAGE_LOGS, JSON.stringify(logs));
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
  localStorage.removeItem(STORAGE_KEYS.USAGE_LOGS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}

export function exportData(): string {
  if (typeof window === "undefined") return "{}";
  const data = {
    subscriptions: getStoredSubscriptions(),
    usageLogs: getStoredUsageLogs(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const data = JSON.parse(json);
    if (data.subscriptions) setStoredSubscriptions(data.subscriptions);
    if (data.usageLogs) setStoredUsageLogs(data.usageLogs);
    return true;
  } catch (error) {
    console.error("Failed to import data:", error);
    return false;
  }
}
