import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn("w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden", className)}>
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
        <div className="flex w-full">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="p-4 flex-1">
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex w-full">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="p-4 flex-1">
                <div 
                  className="h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" 
                  style={{ width: `${Math.random() * 40 + 40}%` }} // Random width between 40-80%
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
