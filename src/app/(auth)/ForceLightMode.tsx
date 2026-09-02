"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ForceLightMode() {
  const { setTheme } = useTheme();

  useEffect(() => {
    try {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
      setTheme("light");
    } catch (_e) {}
  }, [setTheme]);

  return null;
}
