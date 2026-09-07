"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "대시보드", href: "/dashboard", icon: "🏠" },
    { name: "구독 관리", href: "/subs", icon: "📋" },
    { name: "절약 현황", href: "/savings", icon: "💰" },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 w-full border-t bg-background z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className={cn("text-xl transition-transform", isActive && "scale-110")}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
