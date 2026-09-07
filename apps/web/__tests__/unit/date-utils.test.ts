import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getNextBillingDate,
  getDaysUntilBilling,
  isPaymentImminent,
  formatDday,
  formatCountdown,
} from "@subslash/shared";

describe("Date Utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getNextBillingDate", () => {
    it("기본: billingDay=15, now=Sep 6 -> Sep 15", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      const next = getNextBillingDate(15, now);
      expect(next.getMonth()).toBe(8); // September is 8 (0-indexed)
      expect(next.getDate()).toBe(15);
    });

    it("이미 지남: billingDay=5, now=Sep 6 -> Oct 5", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      const next = getNextBillingDate(5, now);
      expect(next.getMonth()).toBe(9); // October
      expect(next.getDate()).toBe(5);
    });

    it("월말 보정: billingDay=31, now=Sep 6 -> Sep 30 (9월은 30일까지)", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      const next = getNextBillingDate(31, now);
      expect(next.getMonth()).toBe(8);
      expect(next.getDate()).toBe(30);
    });

    it("월말 보정 2월: billingDay=31, now=Feb 15 -> Feb 28 (평년)", () => {
      const now = new Date("2023-02-15T00:00:00Z");
      const next = getNextBillingDate(31, now);
      expect(next.getMonth()).toBe(1); // February
      expect(next.getDate()).toBe(28);
    });

    it("당일: billingDay=6, now=Sep 6 -> Oct 6", () => {
      // Assuming it's already passed for the day or counts as passed
      const now = new Date("2023-09-06T10:00:00Z");
      const next = getNextBillingDate(6, now);
      expect(next.getMonth()).toBe(9);
      expect(next.getDate()).toBe(6);
    });

    it("연말: billingDay=15, now=Dec 20 -> Jan 15 next year (month rollover)", () => {
      const now = new Date("2023-12-20T00:00:00Z");
      const next = getNextBillingDate(15, now);
      expect(next.getFullYear()).toBe(2024);
      expect(next.getMonth()).toBe(0); // January
      expect(next.getDate()).toBe(15);
    });
  });

  describe("getDaysUntilBilling", () => {
    it("billingDay=9, now=Sep 6 -> 3", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      expect(getDaysUntilBilling(9, now)).toBe(3);
    });

    it("billingDay=6, now=Sep 6 -> next month", () => {
      const now = new Date("2023-09-06T10:00:00Z");
      expect(getDaysUntilBilling(6, now)).toBeGreaterThan(25);
    });
  });

  describe("isPaymentImminent", () => {
    it("D-3 with threshold 3: true", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      expect(isPaymentImminent(9, 3, now)).toBe(true);
    });

    it("D-7 with threshold 3: false", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      expect(isPaymentImminent(13, 3, now)).toBe(false);
    });

    it("D-1 with threshold 1: true", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      expect(isPaymentImminent(7, 1, now)).toBe(true);
    });
  });

  describe("formatDday", () => {
    it("0 -> D-Day", () => {
      expect(formatDday(0)).toBe("D-Day");
    });

    it("3 -> D-3", () => {
      expect(formatDday(3)).toBe("D-3");
    });

    it("-2 -> D+2", () => {
      expect(formatDday(-2)).toBe("D+2");
    });
  });

  describe("formatCountdown", () => {
    it("Target 1 day ahead: starts with D-", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      const target = new Date("2023-09-07T00:00:00Z");
      expect(formatCountdown(target, now)).toMatch(/^D-/);
    });

    it("Target in the past: D-Day 00:00:00", () => {
      const now = new Date("2023-09-06T00:00:00Z");
      const target = new Date("2023-09-05T00:00:00Z");
      expect(formatCountdown(target, now)).toBe("D-Day 00:00:00");
    });
  });
});
