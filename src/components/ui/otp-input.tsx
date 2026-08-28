"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const CROSSFADE = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 0.8,
} as const;
const EASE = [0.23, 1, 0.32, 1] as const;

export type OtpMode = "numeric" | "alphanumeric";

const ALLOW: Record<OtpMode, RegExp> = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[0-9a-zA-Z]$/,
};

export type UseOtpInputOptions = {
  length?: number;
  mode?: OtpMode;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
};

export type OtpCellProps = {
  ref: (el: HTMLInputElement | null) => void;
  value: string;
  disabled: boolean;
  type: "text";
  inputMode: "numeric" | "text";
  autoComplete: string;
  autoCorrect: "off";
  autoCapitalize: "off";
  spellCheck: false;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
};

export type UseOtpInputReturn = {
  chars: string[];
  value: string;
  length: number;
  complete: boolean;
  focusedIndex: number;
  getCellProps: (index: number) => OtpCellProps;
  focusAt: (index: number) => void;
  clear: () => void;
};

export function useOtpInput({
  length = 6,
  mode = "numeric",
  defaultValue = "",
  disabled = false,
  onChange,
  onComplete,
}: UseOtpInputOptions = {}): UseOtpInputReturn {
  const allow = ALLOW[mode];

  const keep = useCallback(
    (text: string) =>
      text
        .split("")
        .filter((c) => allow.test(c))
        .join(""),
    [allow],
  );

  const [chars, setChars] = useState<string[]>(() => {
    const seed = defaultValue
      .split("")
      .filter((c) => ALLOW[mode].test(c))
      .slice(0, length);
    return Array.from({ length }, (_, i) => seed[i] ?? "");
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const charsRef = useRef(chars);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const changed = useRef(onChange);
  const completed = useRef(onComplete);

  useEffect(() => {
    charsRef.current = chars;
  }, [chars]);

  useEffect(() => {
    changed.current = onChange;
  }, [onChange]);

  useEffect(() => {
    completed.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setChars((prev) =>
      prev.length === length
        ? prev
        : Array.from({ length }, (_, i) => prev[i] ?? ""),
    );
    refs.current.length = length;
  }, [length]);

  const commit = useCallback((next: string[]) => {
    charsRef.current = next;
    setChars(next);
    const value = next.join("");
    changed.current?.(value);
    if (next.length > 0 && next.every((c) => c !== ""))
      completed.current?.(value);
  }, []);

  const focusAt = useCallback(
    (index: number) => {
      const el = refs.current[Math.max(0, Math.min(length - 1, index))];
      if (!el) return;
      el.focus();
      el.select();
    },
    [length],
  );

  const fillFrom = useCallback(
    (index: number, text: string) => {
      const incoming = keep(text);
      if (incoming.length === 0) return;
      const next = [...charsRef.current];
      let cursor = index;
      for (const c of incoming) {
        if (cursor >= length) break;
        next[cursor] = c;
        cursor += 1;
      }
      commit(next);
      focusAt(cursor);
    },
    [commit, focusAt, keep, length],
  );

  const clear = useCallback(() => {
    commit(Array.from({ length }, () => ""));
    focusAt(0);
  }, [commit, focusAt, length]);

  const getCellProps = useCallback(
    (index: number): OtpCellProps => ({
      ref: (el) => {
        refs.current[index] = el;
      },
      value: chars[index] ?? "",
      disabled,
      type: "text",
      inputMode: mode === "numeric" ? "numeric" : "text",
      autoComplete: index === 0 ? "one-time-code" : "off",
      autoCorrect: "off",
      autoCapitalize: "off",
      spellCheck: false,
      onChange: (e) => {
        const previous = charsRef.current[index] ?? "";
        const raw = e.currentTarget.value;
        const trimmed =
          raw.length > 1 && previous && raw.startsWith(previous)
            ? raw.slice(previous.length)
            : raw;
        const incoming = keep(trimmed);

        if (incoming.length === 0) {
          if (raw.length === 0 && previous) {
            const next = [...charsRef.current];
            next[index] = "";
            commit(next);
          }
          e.currentTarget.value = charsRef.current[index] ?? "";
          return;
        }

        if (incoming.length === 1) {
          const next = [...charsRef.current];
          next[index] = incoming;
          e.currentTarget.value = incoming;
          commit(next);
          if (index < length - 1) focusAt(index + 1);
          return;
        }

        fillFrom(index, incoming);
      },
      onKeyDown: (e) => {
        if (e.key === "Backspace") {
          e.preventDefault();
          const current = charsRef.current;
          const next = [...current];
          if (current[index]) {
            next[index] = "";
            commit(next);
            return;
          }
          if (index > 0) {
            next[index - 1] = "";
            commit(next);
            focusAt(index - 1);
          }
          return;
        }
        if (e.key === "Delete") {
          e.preventDefault();
          const next = [...charsRef.current];
          next[index] = "";
          commit(next);
          return;
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          focusAt(index - 1);
          return;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          focusAt(index + 1);
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          focusAt(0);
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          focusAt(length - 1);
        }
      },
      onPaste: (e) => {
        e.preventDefault();
        const text = keep(e.clipboardData.getData("text"));
        fillFrom(text.length >= length ? 0 : index, text);
      },
      onFocus: (e) => {
        e.currentTarget.select();
        const firstEmpty = charsRef.current.findIndex((c) => c === "");
        if (firstEmpty !== -1 && firstEmpty < index) {
          focusAt(firstEmpty);
          return;
        }
        setFocusedIndex(index);
      },
      onBlur: (e) => {
        const to = e.relatedTarget as HTMLInputElement | null;
        if (to && refs.current.includes(to)) return;
        setFocusedIndex(-1);
      },
    }),
    [chars, commit, disabled, fillFrom, focusAt, keep, length, mode],
  );

  const value = chars.join("");

  return {
    chars,
    value,
    length,
    complete: chars.length > 0 && chars.every((c) => c !== ""),
    focusedIndex,
    getCellProps,
    focusAt,
    clear,
  };
}

export type OtpStatus = "idle" | "error" | "success";

export type OtpInputHandle = {
  clear: () => void;
  focus: () => void;
};

export type OtpInputProps = {
  length?: number;
  mode?: OtpMode;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  status?: OtpStatus;
  errorMessage?: string;
  successMessage?: string;
  hint?: string;
  label?: string;
  groupEvery?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  focusOnError?: boolean;
  className?: string;
  ref?: React.Ref<OtpInputHandle>;
};

export function OtpInput({
  length = 6,
  mode = "numeric",
  defaultValue = "",
  onChange,
  onComplete,
  status = "idle",
  errorMessage = "",
  successMessage = "",
  hint = "",
  label = "Verification code",
  groupEvery = 3,
  disabled = false,
  autoFocus = false,
  focusOnError = true,
  className = "",
  ref,
}: OtpInputProps) {
  const reduced = useReducedMotion();
  const statusId = useId();

  const { chars, focusedIndex, getCellProps, focusAt, clear } = useOtpInput({
    length,
    mode,
    defaultValue,
    disabled,
    onChange,
    onComplete,
  });

  const wasError = useRef(false);
  const error = status === "error";
  const success = status === "success";

  useImperativeHandle(
    ref,
    () => ({
      clear: () => {
        clear();
        focusAt(0);
      },
      focus: () => focusAt(0),
    }),
    [clear, focusAt],
  );

  useEffect(() => {
    if (error && !wasError.current && focusOnError && !disabled) focusAt(0);
    wasError.current = error;
  }, [error, focusOnError, disabled, focusAt]);

  useEffect(() => {
    if (autoFocus && !disabled) focusAt(0);
  }, [autoFocus, disabled, focusAt]);

  const enter = reduced ? { duration: 0 } : { duration: 0.22, ease: EASE };
  const swap = reduced ? { duration: 0 } : CROSSFADE;
  const hasStatus =
    hint.length > 0 || errorMessage.length > 0 || successMessage.length > 0;

  const message = error ? errorMessage : success ? successMessage : hint;
  const messageTone = error
    ? "text-red-600 dark:text-red-400"
    : success
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-stone-500 dark:text-stone-400";

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <motion.div
        role="group"
        aria-label={label}
        className="relative flex items-center justify-center gap-2"
        initial={false}
        variants={{ idle: { x: 0 }, wrong: { x: [0, -5, 4, -3, 0] } }}
        animate={error && !reduced ? "wrong" : "idle"}
        transition={{ duration: 0.32, ease: EASE }}
      >
        {Array.from({ length }, (_, i) => {
          const char = chars[i] ?? "";
          const active = focusedIndex === i;
          const gap = groupEvery > 0 && i > 0 && i % groupEvery === 0;

          return (
            <div key={i} className={`relative h-12 sm:h-13 w-10 sm:w-11 ${gap ? "ml-2.5 sm:ml-3" : ""}`}>
              <input
                {...getCellProps(i)}
                aria-label={`${label}, character ${i + 1} of ${length}`}
                aria-invalid={error || undefined}
                aria-describedby={hasStatus ? statusId : undefined}
                className={`h-12 sm:h-13 w-10 sm:w-11 rounded-xl border-2 text-center text-lg sm:text-xl font-black text-transparent caret-transparent outline-none transition-all duration-150 selection:bg-transparent focus-visible:outline-none disabled:opacity-50 ${
                  error
                    ? "border-red-500 bg-red-50/50 dark:border-red-400 dark:bg-red-950/20"
                    : success
                      ? "border-emerald-500 bg-emerald-50/50 dark:border-emerald-400 dark:bg-emerald-950/20"
                      : active
                        ? "border-[#FFC000] bg-white ring-4 ring-[#FFC000]/15 dark:border-[#FFC000] dark:bg-slate-900"
                        : char
                          ? "border-amber-400 bg-white dark:border-amber-500/50 dark:bg-slate-900"
                          : "border-slate-200 bg-slate-50/80 shadow-inner dark:border-slate-800 dark:bg-slate-900/60"
                }`}
              />

              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {char ? (
                    <motion.span
                      key={char}
                      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                      transition={enter}
                      className="text-lg sm:text-xl font-black text-slate-950 dark:text-white leading-none"
                    >
                      {char}
                    </motion.span>
                  ) : null}
                </AnimatePresence>

                {active && !char && !disabled ? (
                  <motion.span
                    className="col-start-1 row-start-1 block h-5 w-0.5 rounded-full bg-amber-500 dark:bg-amber-400"
                    initial={{ opacity: 1 }}
                    animate={
                      reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }
                    }
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: 1.06,
                            times: [0, 0.5, 0.5, 1],
                            repeat: Infinity,
                            ease: "linear",
                          }
                    }
                  />
                ) : null}
              </span>
            </div>
          );
        })}
      </motion.div>

      {hasStatus && (
        <>
          <div
            aria-hidden
            className="mt-2.5 grid h-4 text-xs font-semibold text-center leading-tight"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={status}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -3 }}
                transition={swap}
                className={`col-start-1 row-start-1 ${messageTone}`}
              >
                {message}
              </motion.span>
            </AnimatePresence>
          </div>
          <span id={statusId} role="status" className="sr-only">
            {message}
          </span>
        </>
      )}
    </div>
  );
}

export default OtpInput;
