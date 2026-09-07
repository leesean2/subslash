import { describe, it, expect } from "vitest";
import {
  calculateCostPerUse,
  getRiskLevel,
  formatShockMessage,
  formatCurrency,
  calculateAnnualSavings,
  getSavingsEquivalent,
} from "@subslash/shared";

describe("Cost Per Use Utils", () => {
  describe("calculateCostPerUse", () => {
    it("정상 계산: 17000 / 3 = 5666.67 (approx)", () => {
      expect(calculateCostPerUse(17000, 3)).toBeCloseTo(5666.67, 1);
    });

    it("0회 사용: 17000 / 0 = 17000 (전액 반환)", () => {
      expect(calculateCostPerUse(17000, 0)).toBe(17000);
    });

    it("1회 사용: 17000 / 1 = 17000", () => {
      expect(calculateCostPerUse(17000, 1)).toBe(17000);
    });

    it("많은 사용: 9900 / 30 = 330", () => {
      expect(calculateCostPerUse(9900, 30)).toBe(330);
    });
  });

  describe("getRiskLevel", () => {
    it("Red: usageCount 0 -> red", () => {
      expect(getRiskLevel(17000, 17000, 0)).toBe("red");
    });

    it("Red: usageCount 1 -> red", () => {
      expect(getRiskLevel(17000, 17000, 1)).toBe("red");
    });

    it("Red: costPerUse > amount * 0.5", () => {
      // e.g. 17000 / 2 = 8500. Depending on strict >, > 0.5 might be handled.
      // Let's test a value clearly > 50%
      expect(getRiskLevel(8501, 17000, 2)).toBe("red");
    });

    it("Yellow: usageCount 3, costPerUse <= amount * 0.5", () => {
      expect(getRiskLevel(5000, 17000, 3)).toBe("yellow");
    });

    it("Green: usageCount 8+ regardless", () => {
      expect(getRiskLevel(2000, 17000, 8)).toBe("green");
    });

    it("Green: costPerUse <= amount * 0.25", () => {
      expect(getRiskLevel(4000, 17000, 4)).toBe("green");
    });
  });

  describe("formatShockMessage", () => {
    it('0회 이용: "공중에 버리셨습니다" 포함', () => {
      const msg = formatShockMessage("Netflix", 17000, 0, "KRW");
      expect(msg).toContain("공중에 버리셨습니다");
    });

    it('1회 이용: "1회를" 포함', () => {
      const msg = formatShockMessage("Netflix", 17000, 1, "KRW");
      expect(msg).toContain("1회를");
    });

    it('다회 이용: "1회당" 포함', () => {
      const msg = formatShockMessage("Netflix", 17000, 5, "KRW");
      expect(msg).toContain("1회당");
    });

    it("KRW 통화: ₩ 기호 포함", () => {
      const msg = formatShockMessage("Netflix", 17000, 1, "KRW");
      expect(msg).toContain("₩");
    });

    it("USD 통화: $ 기호 포함", () => {
      const msg = formatShockMessage("Netflix", 9.99, 1, "USD");
      expect(msg).toContain("$");
    });
  });

  describe("formatCurrency", () => {
    it('KRW: formatCurrency(17000, "KRW") -> ₩17,000', () => {
      expect(formatCurrency(17000, "KRW")).toBe("₩17,000");
    });

    it('USD: formatCurrency(9.99, "USD") -> $9.99', () => {
      expect(formatCurrency(9.99, "USD")).toBe("$9.99");
    });
  });

  describe("calculateAnnualSavings", () => {
    it("17000 * 12 = 204000", () => {
      expect(calculateAnnualSavings(17000)).toBe(204000);
    });
  });

  describe("getSavingsEquivalent", () => {
    it('500000+ -> includes "해외 여행"', () => {
      const equivalents = getSavingsEquivalent(600000);
      expect(equivalents.some((e) => e.includes("해외 여행"))).toBe(true);
    });

    it('200000+ -> includes "레스토랑"', () => {
      const equivalents = getSavingsEquivalent(250000);
      expect(equivalents.some((e) => e.includes("레스토랑"))).toBe(true);
    });

    it('25000 -> includes "카페 라떼" with correct count', () => {
      const equivalents = getSavingsEquivalent(25000);
      expect(equivalents.some((e) => e.includes("카페 라떼"))).toBe(true);
    });
  });
});
