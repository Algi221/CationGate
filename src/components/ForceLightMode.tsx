"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ForceLightMode() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return null;
}
