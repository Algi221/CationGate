"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarData {
  id: string;
  name: string;
  image: string;
}

interface AvatarGroupProps {
  avatars: AvatarData[];
  max?: number;
  className?: string;
}

export function AvatarGroup({ avatars, max = 5, className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn("flex items-center", className)}>
      {visibleAvatars.map((avatar, index) => (
        <motion.div
          key={avatar.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          whileHover={{
            scale: 1.15,
            zIndex: 20,
            y: -5,
          }}
          className={cn(
            "relative -ml-3 first:ml-0 rounded-full border-2 border-background shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-background"
          )}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <Avatar className="w-10 h-10 border-none">
            <AvatarImage src={avatar.image} alt={avatar.name} />
            <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </motion.div>
      ))}
      {remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative -ml-3 rounded-full border-2 border-background bg-slate-100 dark:bg-slate-800 flex items-center justify-center w-10 h-10 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm z-0"
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  );
}
