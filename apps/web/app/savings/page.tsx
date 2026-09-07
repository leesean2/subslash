"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/store";
import {
  formatCurrency,
  getAnnualAmountKRW,
  getMonthlyAmountKRW,
  getSavingsEquivalent,
  sumAnnualKRW,
} from "@subslash/shared";
import { SavingsPot } from "../../components/dashboard/SavingsPot";
import { Button } from "../../components/ui/button";

export default function SavingsDashboard() {
  const router = useRouter();
  const { getKilledSubscriptions, reviveSubscription } = useStore();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin text-3xl">✂️</div>
      </div>
    );
  }

  const killedSubs = getKilledSubscriptions();
  const annualSavings = sumAnnualKRW(killedSubs);
  const equivalents = getSavingsEquivalent(annualSavings);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Failed to copy share text:", error);
    }
  };

  const handleShare = async () => {
    const text = `✂️ SubSlash로 불필요한 구독을 해지하여 연간 ₩${annualSavings.toLocaleString()}을 방어했습니다! ${equivalents[0] || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SubSlash 구독 디톡스 결과",
          text,
          url: window.location.origin,
        });
        return;
      } catch (error) {
        // User dismissed the share sheet, or sharing is unavailable — fall back to copying.
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }
    await copyToClipboard(text);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight">절약 & 방어 자산 현황</h1>
        <p className="text-sm text-muted-foreground">
          킬(Kill) 스위치로 차단한 구독료가 실제 방어 자산으로 누적됩니다.
        </p>
      </div>

      {killedSubs.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-2xl space-y-4">
          <div className="text-5xl">🛡️</div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">아직 해지 완료된 구독이 없습니다</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              대시보드에서 각 구독의 이용 횟수를 점검하고, 가성비가 낮은 구독에 대해
              &lsquo;해지하기&rsquo;를 눌러보세요!
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")}>대시보드로 가기 →</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Savings Pot Widget */}
          <SavingsPot killedSubscriptions={killedSubs} />

          {/* Reward Equivalent Cards */}
          <div className="space-y-3">
            <h3 className="font-bold text-base">🎁 절약한 돈으로 누릴 수 있는 현실적 보상</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 border rounded-2xl bg-card space-y-1">
                <p className="text-xs text-muted-foreground">치킨 환산</p>
                <p className="text-lg font-bold text-foreground">
                  🍗 맛있는 치킨 {Math.max(1, Math.floor(annualSavings / 20000))}마리
                </p>
              </div>
              <div className="p-4 border rounded-2xl bg-card space-y-1">
                <p className="text-xs text-muted-foreground">커피 환산</p>
                <p className="text-lg font-bold text-foreground">
                  ☕ 카페 라떼 {Math.max(1, Math.floor(annualSavings / 5000))}잔
                </p>
              </div>
              <div className="p-4 border rounded-2xl bg-card space-y-1">
                <p className="text-xs text-muted-foreground">외식 환산</p>
                <p className="text-lg font-bold text-foreground">
                  🍣 고급 레스토랑 {Math.max(1, Math.floor(annualSavings / 100000))}회
                </p>
              </div>
              <div className="p-4 border rounded-2xl bg-card space-y-1">
                <p className="text-xs text-muted-foreground">여행 환산</p>
                <p className="text-lg font-bold text-foreground">
                  ✈️ {annualSavings >= 500000 ? "해외 여행 경비 지원" : "제주도 힐링 여행"}
                </p>
              </div>
            </div>
          </div>

          {/* Defended Subscriptions List with Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">차단에 성공한 구독 목록 ({killedSubs.length})</h3>
              <Button size="sm" variant="outline" onClick={handleShare}>
                {copied ? "클립보드에 복사됨! 📋" : "결과 공유하기 📤"}
              </Button>
            </div>

            <div className="space-y-2">
              {killedSubs.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 border rounded-2xl bg-card hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sub.iconUrl || "📦"}</span>
                    <div>
                      <h4 className="font-bold text-sm line-through text-muted-foreground">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-emerald-600 font-medium">
                        연간 ₩{getAnnualAmountKRW(sub).toLocaleString()} 방어 성공
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {sub.billingCycle === "yearly" || sub.currency === "USD" ? (
                        <>
                          {formatCurrency(sub.amount, sub.currency)}
                          <span className="text-xs font-normal text-muted-foreground">
                            {" "}
                            (월 ₩{getMonthlyAmountKRW(sub).toLocaleString()})
                          </span>
                        </>
                      ) : (
                        <>월 {formatCurrency(sub.amount, sub.currency)}</>
                      )}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => reviveSubscription(sub.id)}
                    >
                      다시 살리기
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
