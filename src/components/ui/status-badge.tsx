"use client";

import React from "react";
import {
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock5,
  ScanSearch,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType =
  | "success"
  | "verified"
  | "full_verified"
  | "FULL_VERIFIED"
  | "failed"
  | "rejected"
  | "ditolak"
  | "pending"
  | "pending_verification"
  | "PENDING_VERIFICATION"
  | "menunggu"
  | "in_progress"
  | "in_review"
  | "ditinjau"
  | "expired"
  | "suspended"
  | "SUSPENDED"
  | "takedown"
  | "TAKEDOWN"
  | "unverified"
  | "UNVERIFIED"
  | "submitted"
  | "diajukan"
  | string;

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, label, className, size = "md" }: StatusBadgeProps) {
  const norm = (status || "").toLowerCase().trim();

  let config = {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-[#EAA65D] dark:text-orange-400",
    border: "border border-orange-200/60 dark:border-orange-900/60",
    icon: TriangleAlert,
    defaultLabel: "Menunggu",
  };

  if (norm === "full_verified" || norm === "verified" || norm === "success") {
    config = {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-[#57BC6C] dark:text-emerald-400",
      border: "border border-emerald-200/60 dark:border-emerald-900/60",
      icon: CircleCheck,
      defaultLabel: "Terverifikasi",
    };
  } else if (norm === "pending" || norm === "pending_verification" || norm === "menunggu") {
    config = {
      bg: "bg-orange-50 dark:bg-orange-950/40",
      text: "text-[#EAA65D] dark:text-orange-400",
      border: "border border-orange-200/60 dark:border-orange-900/60",
      icon: TriangleAlert,
      defaultLabel: "Menunggu Verifikasi",
    };
  } else if (norm === "in_review" || norm === "ditinjau") {
    config = {
      bg: "bg-yellow-50 dark:bg-yellow-950/40",
      text: "text-[#F0B13D] dark:text-yellow-400",
      border: "border border-yellow-200/60 dark:border-yellow-900/60",
      icon: ScanSearch,
      defaultLabel: "Sedang Ditinjau",
    };
  } else if (norm === "in_progress" || norm === "proses") {
    config = {
      bg: "bg-sky-50 dark:bg-sky-950/40",
      text: "text-[#008AF5] dark:text-sky-400",
      border: "border border-sky-200/60 dark:border-sky-900/60",
      icon: CircleDashed,
      defaultLabel: "Dalam Proses",
    };
  } else if (norm === "failed" || norm === "rejected" || norm === "ditolak") {
    config = {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-[#D57463] dark:text-rose-400",
      border: "border border-rose-200/60 dark:border-rose-900/60",
      icon: CircleX,
      defaultLabel: "Ditolak / Gagal",
    };
  } else if (norm === "suspended" || norm === "takedown" || norm === "expired") {
    config = {
      bg: "bg-zinc-100 dark:bg-zinc-800/80",
      text: "text-[#777777] dark:text-zinc-400",
      border: "border border-zinc-200/60 dark:border-zinc-700/60",
      icon: Clock5,
      defaultLabel: "Dibekukan",
    };
  } else if (norm === "unverified" || norm === "belum_verifikasi") {
    config = {
      bg: "bg-zinc-100 dark:bg-zinc-800/80",
      text: "text-[#777777] dark:text-zinc-400",
      border: "border border-zinc-200/60 dark:border-zinc-700/60",
      icon: Clock5,
      defaultLabel: "Belum Verifikasi",
    };
  } else if (norm === "submitted" || norm === "diajukan") {
    config = {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      text: "text-[#6C3CF0] dark:text-violet-400",
      border: "border border-violet-200/60 dark:border-violet-900/60",
      icon: Clock5,
      defaultLabel: "Diajukan",
    };
  }

  const Icon = config.icon;
  const displayText = label || config.defaultLabel;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-xl transition-colors shrink-0",
        config.bg,
        config.border,
        size === "sm" ? "h-[28px] px-3 text-[11px]" : "h-[34px] px-3.5 text-xs",
        className
      )}
    >
      <span className={cn("inline-flex items-center font-bold tracking-tight gap-1.5", config.text)}>
        <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} strokeWidth={2.5} />
        {displayText}
      </span>
    </div>
  );
}

export default StatusBadge;
