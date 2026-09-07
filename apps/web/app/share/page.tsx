"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AutoImportModal } from "../../components/import/AutoImportModal";
import { Button } from "../../components/ui/button";

/**
 * PWA share target (see public/manifest.json). Android hands the shared
 * payment SMS / receipt over as query params; we feed it straight into the
 * auto-import parser.
 */
function ShareReceiver() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  const sharedText = [searchParams.get("title"), searchParams.get("text"), searchParams.get("url")]
    .filter(Boolean)
    .join("\n")
    .trim();

  useEffect(() => {
    if (!sharedText) {
      router.replace("/subs");
    }
  }, [sharedText, router]);

  const handleClose = () => {
    setIsOpen(false);
    router.replace("/subs");
  };

  if (!sharedText) return null;

  return (
    <div className="space-y-4 text-center py-10">
      <div className="text-4xl">📥</div>
      <h1 className="text-xl font-black tracking-tight">공유된 결제 내역을 분석하는 중입니다</h1>
      <p className="text-sm text-muted-foreground">
        다른 앱에서 공유한 결제 문자 / 영수증을 구독 목록으로 가져옵니다.
      </p>
      <Button variant="outline" onClick={handleClose}>
        구독 목록으로 이동
      </Button>

      <AutoImportModal isOpen={isOpen} onClose={handleClose} initialSmsText={sharedText} />
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin text-3xl">✂️</div>
        </div>
      }
    >
      <ShareReceiver />
    </Suspense>
  );
}
