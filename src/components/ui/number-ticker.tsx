"use client"

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react"
import { useMotionValue, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      if (isCancelled) return;

      const status = sessionStorage.getItem("cationgate_loading_session");
      if (status === "active") {

        const handleLoadingComplete = () => setIsReady(true);
        window.addEventListener("cationgate:loading-complete", handleLoadingComplete);

        const safety = setTimeout(() => setIsReady(true), 6000);

        return () => {
          window.removeEventListener("cationgate:loading-complete", handleLoadingComplete);
          clearTimeout(safety);
        };
      } else {

        setIsReady(true);
      }
    }, 50);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isReady) {

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [isReady, motionValue, direction, startValue, value])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)))
        }
      }),
    [springValue, decimalPlaces]
  )

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  )
}