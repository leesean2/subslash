"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Select } from "./select";
import { cn } from "../../lib/utils";

export const COMMON_EMAIL_DOMAINS = [
  { label: "naver.com (네이버)", value: "naver.com", provider: "naver" as const },
  { label: "gmail.com (구글)", value: "gmail.com", provider: "google" as const },
  { label: "kakao.com (카카오)", value: "kakao.com", provider: "kakao" as const },
  { label: "daum.net (다음)", value: "daum.net", provider: "kakao" as const },
  { label: "icloud.com (애플)", value: "icloud.com", provider: "apple" as const },
  { label: "outlook.com (MS)", value: "outlook.com", provider: "email" as const },
  { label: "직접 입력", value: "custom", provider: "email" as const },
];

export interface EmailDomainInputProps {
  value?: string;
  onChange: (fullEmail: string, localPart: string, domain: string) => void;
  placeholderId?: string;
  className?: string;
  size?: "sm" | "default";
  onProviderChange?: (provider: "google" | "naver" | "kakao" | "apple" | "email") => void;
  required?: boolean;
}

export function EmailDomainInput({
  value = "",
  onChange,
  placeholderId = "아이디 입력",
  className,
  size = "default",
  onProviderChange,
  required = false,
}: EmailDomainInputProps) {
  // Parse initial value
  const parseEmail = (val: string) => {
    if (!val || !val.includes("@")) {
      return { local: val || "", domain: "naver.com", isPreset: true };
    }
    const [local, ...rest] = val.split("@");
    const dom = rest.join("@");
    const matched = COMMON_EMAIL_DOMAINS.find((d) => d.value === dom);
    return {
      local: local || "",
      domain: dom || "naver.com",
      isPreset: !!matched,
    };
  };

  const parsed = parseEmail(value);
  const [localPart, setLocalPart] = useState(parsed.local);
  const [selectedPreset, setSelectedPreset] = useState(parsed.isPreset ? parsed.domain : "custom");
  const [customDomain, setCustomDomain] = useState(parsed.isPreset ? "" : parsed.domain);

  // Sync state if value changes externally
  useEffect(() => {
    const p = parseEmail(value);
    setLocalPart(p.local);
    if (p.isPreset) {
      setSelectedPreset(p.domain);
      setCustomDomain("");
    } else if (value.includes("@")) {
      setSelectedPreset("custom");
      setCustomDomain(p.domain);
    }
  }, [value]);

  const emitChange = (newLocal: string, preset: string, custom: string) => {
    const finalDomain = preset === "custom" ? custom.trim() : preset;
    const full = newLocal.trim() ? `${newLocal.trim()}@${finalDomain}` : "";
    onChange(full, newLocal.trim(), finalDomain);

    if (onProviderChange) {
      const matched = COMMON_EMAIL_DOMAINS.find((d) => d.value === finalDomain);
      if (matched) {
        onProviderChange(matched.provider);
      } else if (finalDomain.includes("naver")) {
        onProviderChange("naver");
      } else if (finalDomain.includes("gmail") || finalDomain.includes("google")) {
        onProviderChange("google");
      } else if (finalDomain.includes("kakao") || finalDomain.includes("daum")) {
        onProviderChange("kakao");
      } else if (finalDomain.includes("icloud") || finalDomain.includes("apple")) {
        onProviderChange("apple");
      } else {
        onProviderChange("email");
      }
    }
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalPart(val);
    emitChange(val, selectedPreset, customDomain);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = e.target.value;
    setSelectedPreset(preset);
    emitChange(localPart, preset, customDomain);
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.target.value;
    setCustomDomain(dom);
    emitChange(localPart, "custom", dom);
  };

  const isSmall = size === "sm";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1.5 w-full">
        <Input
          type="text"
          placeholder={placeholderId}
          value={localPart}
          onChange={handleLocalChange}
          required={required}
          className={cn(
            "flex-1 min-w-0 font-mono",
            isSmall ? "h-8 text-xs px-2.5" : "text-sm px-3",
          )}
        />
        <span className="text-muted-foreground font-bold text-sm select-none">@</span>
        <Select
          value={selectedPreset}
          onChange={handlePresetChange}
          className={cn("w-40 shrink-0 font-mono", isSmall ? "h-8 text-xs py-1" : "text-sm")}
        >
          {COMMON_EMAIL_DOMAINS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </Select>
      </div>

      {selectedPreset === "custom" && (
        <div className="flex items-center gap-1.5 pt-0.5">
          <Input
            type="text"
            placeholder="도메인 직접 입력 (예: company.com)"
            value={customDomain}
            onChange={handleCustomDomainChange}
            required={required && selectedPreset === "custom"}
            className={cn("font-mono text-xs", isSmall ? "h-8 text-xs px-2.5" : "h-9 px-3")}
          />
        </div>
      )}
    </div>
  );
}
