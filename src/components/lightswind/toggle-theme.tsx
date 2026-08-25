"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

export type AnimationType =
  | "none"
  | "circle-spread"
  | "round-morph"
  | "swipe-left"
  | "swipe-up"
  | "diag-down-right"
  | "fade-in-out"
  | "shrink-grow"
  | "flip-x-in"
  | "split-vertical"
  | "swipe-right"
  | "swipe-down"
  | "wave-ripple";

export interface ToggleThemeProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  animationType?: AnimationType;
}

export const ToggleTheme: React.FC<ToggleThemeProps> = ({
  className,
  duration = 1000,
  animationType = "circle-spread",
  ...props
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  useEffect(() => {
    if (animationType === "flip-x-in") return;

    let styleElement = document.getElementById("toggle-theme-vt-override") as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "toggle-theme-vt-override";
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      ::view-transition-group(root) {
        animation-duration: ${duration}ms !important;
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation: none !important;
        mix-blend-mode: normal !important;
      }
      ::view-transition-old(root) {
        z-index: 1 !important;
      }
      ::view-transition-new(root) {
        z-index: 9999 !important;
      }
    `;
  }, [animationType, duration]);

  const toggleTheme = useCallback(async () => {
    const nextTheme = isDark ? "light" : "dark";

    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      !buttonRef.current
    ) {
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setTheme(nextTheme);
      return;
    }

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transition = (document as any).startViewTransition(() => {
      flushSync(() => {
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        setTheme(nextTheme);
      });
    });

    await transition.ready;

    switch (animationType) {
      case "circle-spread":
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "round-morph":
        document.documentElement.animate(
          [
            { opacity: 0, transform: "scale(0.8) rotate(5deg)" },
            { opacity: 1, transform: "scale(1) rotate(0deg)" },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "swipe-left":
        document.documentElement.animate(
          {
            clipPath: [
              `inset(0 0 0 ${viewportWidth}px)`,
              `inset(0 0 0 0)`,
            ],
          },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "swipe-up":
        document.documentElement.animate(
          {
            clipPath: [
              `inset(${viewportHeight}px 0 0 0)`,
              `inset(0 0 0 0)`,
            ],
          },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "diag-down-right":
        document.documentElement.animate(
          {
            clipPath: [
              `polygon(0 0, 0 0, 0 0, 0 0)`,
              `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
            ],
          },
          {
            duration: duration * 1.3,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "fade-in-out":
        document.documentElement.animate(
          {
            opacity: [0, 1],
          },
          {
            duration: duration * 0.7,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "shrink-grow":
        document.documentElement.animate(
          [
            { transform: "scale(0.9)", opacity: 0 },
            { transform: "scale(1)", opacity: 1 },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.19, 1, 0.22, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        document.documentElement.animate(
          [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(1.05)", opacity: 0 },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.19, 1, 0.22, 1)",
            pseudoElement: "::view-transition-old(root)",
          }
        );
        break;

      case "wave-ripple":
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0% at 50% 50%)`,
              `circle(${maxRadius}px at 50% 50%)`,
            ],
          },
          {
            duration: duration * 1.3,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "none":
      default:
        break;
    }
  }, [isDark, setTheme, duration, animationType]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center",
        isDark
          ? "bg-slate-800/80 text-amber-400 hover:bg-slate-700/80 hover:text-amber-300 border border-slate-700"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80",
        className
      )}
      {...props}
    >
      {mounted && isDark ? (
        <Sun className="h-4.5 w-4.5 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
};