"use client";

import React, { useState } from "react";
import { SubscriptionFormData, ServicePreset, PAYMENT_METHOD_OPTIONS } from "@subslash/shared";
import { useStore } from "../../lib/store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { EmailDomainInput } from "../ui/email-domain-input";

export function SubForm({
  onSubmit,
  initialData,
  popularServices,
  submitLabel = "구독 등록하기",
}: {
  onSubmit: (data: SubscriptionFormData) => void;
  initialData?: Partial<SubscriptionFormData>;
  popularServices: ServicePreset[];
  submitLabel?: string;
}) {
  const { accounts, addAccount } = useStore();

  const [isCustomAccount, setIsCustomAccount] = useState<boolean>(
    Boolean(!initialData?.linkedAccountId && initialData?.linkedAccountName),
  );
  const [customEmail, setCustomEmail] = useState<string>(
    (!initialData?.linkedAccountId && initialData?.linkedAccountName) || "",
  );

  // Defaults are merged into state (not only into the rendered `value`) so the
  // selects can never display one thing while submitting `undefined`.
  const [formData, setFormData] = useState<Partial<SubscriptionFormData>>(() => ({
    name: "",
    amount: 0,
    currency: "KRW",
    billingDay: 1,
    billingCycle: "monthly",
    category: "ott",
    paymentMethod: "credit_card",
    ...initialData,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "billingDay" ? Number(value) : value,
    }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__custom__") {
      setIsCustomAccount(true);
      setFormData((prev) => ({
        ...prev,
        linkedAccountId: undefined,
        linkedAccountName: customEmail.trim() || undefined,
      }));
    } else if (!val) {
      setIsCustomAccount(false);
      setFormData((prev) => ({
        ...prev,
        linkedAccountId: undefined,
        linkedAccountName: undefined,
      }));
    } else {
      setIsCustomAccount(false);
      const acc = accounts.find((a) => a.id === val);
      setFormData((prev) => ({
        ...prev,
        linkedAccountId: val,
        linkedAccountName: acc ? `${acc.name} (${acc.emailOrId})` : undefined,
      }));
    }
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = popularServices.find(
      (s) => s.id === e.target.value || s.name === e.target.value,
    );
    if (service) {
      setFormData((prev) => ({
        ...prev,
        name: service.nameKo || service.name,
        amount: service.defaultAmount,
        currency: service.currency,
        cancelUrl: service.cancelUrl,
        cancelGuide: service.cancelGuide,
        category: service.category,
        iconUrl: service.iconEmoji,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalAccountId = formData.linkedAccountId;
    let finalAccountName = formData.linkedAccountName;

    if (isCustomAccount && customEmail.trim()) {
      finalAccountName = customEmail.trim();
      const found = accounts.find(
        (a) => a.emailOrId.toLowerCase() === customEmail.trim().toLowerCase(),
      );
      if (found) {
        finalAccountId = found.id;
        finalAccountName = `${found.name} (${found.emailOrId})`;
      } else {
        const localPart = customEmail.split("@")[0] || "직접 입력 계정";
        const provider = customEmail.includes("naver")
          ? "naver"
          : customEmail.includes("gmail")
            ? "google"
            : customEmail.includes("kakao")
              ? "kakao"
              : customEmail.includes("icloud") || customEmail.includes("apple")
                ? "apple"
                : "email";
        const newAcc = addAccount({
          name: localPart,
          emailOrId: customEmail.trim(),
          provider,
        });
        finalAccountId = newAcc.id;
        finalAccountName = `${newAcc.name} (${newAcc.emailOrId})`;
      }
    }

    onSubmit({
      ...formData,
      linkedAccountId: finalAccountId,
      linkedAccountName: finalAccountName,
    } as SubscriptionFormData);
  };

  return (
    <form className="space-y-4 text-left" onSubmit={handleSubmit}>
      {/* Quick Select from Presets */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          빠른 프리셋 선택
        </label>
        <Select onChange={handlePresetSelect} defaultValue="">
          <option value="" disabled>
            인기 서비스를 선택하세요 (자동 완성)
          </option>
          {popularServices.map((s) => (
            <option key={s.id} value={s.id}>
              {s.iconEmoji} {s.nameKo} (₩{s.defaultAmount.toLocaleString()})
            </option>
          ))}
        </Select>
      </div>

      {/* Service Name & Linked Account */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">서비스 이름</label>
          <Input
            name="name"
            placeholder="예: 넷플릭스"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Linked Account Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>사용/로그인 계정</span>
            <span className="text-[10px] text-muted-foreground font-normal">해지 시 직통 연동</span>
          </label>
          <Select
            name="linkedAccountId"
            value={isCustomAccount ? "__custom__" : formData.linkedAccountId || ""}
            onChange={handleAccountChange}
          >
            <option value="">계정 지정 안 함 (직접 관리)</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - {acc.emailOrId}
              </option>
            ))}
            <option value="__custom__">✏️ 새 이메일 직접 입력 매핑</option>
          </Select>
        </div>
      </div>

      {/* Custom Email Input with Domain Selector */}
      {isCustomAccount && (
        <div className="p-3 rounded-xl bg-muted/40 border border-border/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground">
              매핑할 이메일 계정 (아이디 입력 @ 도메인 선택)
            </label>
            <span className="text-[10px] text-muted-foreground">
              도메인을 선택하면 해당 서비스로 자동 연계됩니다
            </span>
          </div>
          <EmailDomainInput
            value={customEmail}
            onChange={(full) => {
              setCustomEmail(full);
              setFormData((prev) => ({
                ...prev,
                linkedAccountName: full,
              }));
            }}
            placeholderId="아이디 입력"
            size="default"
          />
        </div>
      )}

      {/* Amount & Currency */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">월 결제 금액</label>
          <Input
            type="number"
            name="amount"
            value={formData.amount || 0}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">통화</label>
          <Select name="currency" value={formData.currency || "KRW"} onChange={handleChange}>
            <option value="KRW">KRW (₩)</option>
            <option value="USD">USD ($)</option>
          </Select>
        </div>
      </div>

      {/* Billing Day & Cycle */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">결제일 (1-31)</label>
          <Input
            type="number"
            min="1"
            max="31"
            name="billingDay"
            value={formData.billingDay || 1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">주기</label>
          <Select
            name="billingCycle"
            value={formData.billingCycle || "monthly"}
            onChange={handleChange}
          >
            <option value="monthly">매월 결제</option>
            <option value="yearly">매년 결제</option>
          </Select>
        </div>
      </div>

      {/* Category & Payment Method */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">카테고리</label>
          <Select name="category" value={formData.category || "ott"} onChange={handleChange}>
            <option value="ott">OTT / 동영상</option>
            <option value="music">음악 스트리밍</option>
            <option value="shopping">쇼핑 / 멤버십</option>
            <option value="cloud">클라우드 / 저장공간</option>
            <option value="ai">AI 툴 / 생산성</option>
            <option value="fitness">피트니스 / 건강</option>
            <option value="news">뉴스 / 도서</option>
            <option value="other">기타</option>
          </Select>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">결제 수단</label>
          <Select
            name="paymentMethod"
            value={formData.paymentMethod || "credit_card"}
            onChange={handleChange}
          >
            {PAYMENT_METHOD_OPTIONS.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Direct Cancellation URL */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-bold text-foreground flex items-center justify-between">
          <span>직통 해지 URL (선택)</span>
          <span className="text-[10px] text-muted-foreground font-normal">
            킬 스위치 1클릭 연결
          </span>
        </label>
        <Input
          name="cancelUrl"
          placeholder="https://.../cancel"
          value={formData.cancelUrl || ""}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full mt-4 h-11 font-bold">
        {submitLabel}
      </Button>
    </form>
  );
}
