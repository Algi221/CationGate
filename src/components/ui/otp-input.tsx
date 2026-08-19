"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CheckIcon = ({ size = 16, strokeWidth = 3, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const OTPSuccess = () => {
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 } as any}
        className="w-16 h-16 bg-green-500 ring-4 ring-green-100 dark:ring-green-900 text-white flex items-center justify-center rounded-full"
      >
        <CheckIcon size={32} strokeWidth={3} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-green-600 dark:text-green-400 font-semibold text-lg"
      >
        Verifikasi Berhasil!
      </motion.p>
    </div>
  );
};

const OTPError = ({ message = "Invalid OTP. Please try again." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="text-center text-red-500 dark:text-red-400 font-medium mt-2 absolute -bottom-8 w-full"
    >
      {message}
    </motion.div>
  );
};

const OTPInputBox = ({
  index,
  length,
  verifyOTP,
  state,
  stiffness = 700,
  damping = 20,
  y = 10,
  opacity = 0,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  const animationControls = useAnimationControls();
  const springTransition = {
    type: "spring",
    stiffness,
    damping,
    delay: index * 0.05,
  };
  const noDelaySpringTransition = {
    type: "spring",
    stiffness,
    damping,
  };
  const slowSuccessTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    delay: index * 0.06,
  };

  useEffect(() => {
    animationControls.start({
      opacity: 1,
      y: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition: springTransition as any,
    });
    return () => animationControls.stop();
  }, []);

  useEffect(() => {
    if (state === "success") {
      const transitionX = index * 68; // Adjusted gap
      animationControls.start({
        x: -transitionX,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transition: slowSuccessTransition as any,
      });
    }
  }, [state, index, animationControls]);

  const onFocus = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animationControls.start({ y: -5, transition: noDelaySpringTransition as any });
  };

  const onBlur = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animationControls.start({ y: 0, transition: noDelaySpringTransition as any });
  };

  const onKeyDown = (e: unknown) => {
    const { value } = (e as any).target;
    if ((e as any).key === "Backspace" && !value && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus();
    } else if ((e as any).key === "ArrowLeft" && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus();
    } else if ((e as any).key === "ArrowRight" && index < length - 1) {
      document.getElementById(`input-${index + 1}`)?.focus();
    }
  };

  const onInput = (e: unknown) => {
    const { value } = (e as any).target;
    if (value.match(/^[0-9]$/)) {
      (e as any).target.value = value;
      if (index < length - 1) {
        document.getElementById(`input-${index + 1}`)?.focus();
      }
    } else {
      (e as any).target.value = "";
    }
    verifyOTP();
  };

  const onPaste = (e: unknown) => {
    (e as any).preventDefault();
    const pastedData = (e as any).clipboardData.getData("text").trim().slice(0, length);
    const digits = pastedData.split("").filter((char: string) => /^[0-9]$/.test(char));

    digits.forEach((digit: string, i: number) => {
      const targetIndex = index + i;
      if (targetIndex < length) {
        const input = document.getElementById(`input-${targetIndex}`) as HTMLInputElement;
        if (input) {
          input.value = digit;
        }
      }
    });

    const nextFocusIndex = Math.min(index + digits.length, length - 1);
    document.getElementById(`input-${nextFocusIndex}`)?.focus();

    setTimeout(verifyOTP, 0);
  };

  return (
    <motion.div
      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-lg ring-2 ring-transparent focus-within:shadow-inner overflow-hidden transition-all duration-300 ${
        state === "error"
          ? "ring-red-400 dark:ring-red-500"
          : state === "success"
            ? "ring-green-500"
            : "focus-within:ring-gray-400 dark:focus-within:ring-gray-500 ring-gray-200 dark:ring-gray-700"
      }`}
      initial={{ opacity, y }}
      animate={animationControls}
    >
      <input
        id={`input-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full h-full text-center text-2xl sm:text-3xl font-semibold outline-none caret-gray-900 dark:caret-gray-200 bg-slate-50 dark:bg-black dark:text-white"
        disabled={state === "success" || state === "loading"}
      />
    </motion.div>
  );
};

export type OTPVerificationProps = {
  email: string;
  length?: number;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<boolean>;
  className?: string;
  stiffness?: number;
  damping?: number;
  y?: number;
  opacity?: number;
};

export function OTPVerification({
  email,
  length = 6,
  onVerify,
  onResend,
  className = "",
  stiffness = 700,
  damping = 20,
  y = 10,
  opacity = 0,
}: OTPVerificationProps) {
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [errorMessage, _setErrorMessage] = useState("Invalid OTP.");
  const animationControls = useAnimationControls();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timer: any;
    if (isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const getCode = () => {
    let code = "";
    for (let i = 0; i < length; i++) {
      const input = document.getElementById(`input-${i}`) as HTMLInputElement;
      if (input) code += input.value;
    }
    return code;
  };

  const verifyOTP = async () => {
    const code = getCode();
    if (code.length < length) {
      setState("idle");
      return null;
    }

    setState("loading");
    
    // Call the provided onVerify
    const isValid = await onVerify(code);

    if (isValid) {
      setState("success");
      return true;
    } else {
      errorAnimation();
      return false;
    }
  };

  const errorAnimation = async () => {
    setState("error");
    await animationControls.start({
      x: [0, 5, -5, 5, -5, 0],
      transition: { duration: 0.3 },
    });
    setTimeout(() => {
      if (getCode().length < length) setState("idle");
    }, 500);
  };

  const handleResend = async () => {
    setIsResendDisabled(true);
    setCountdown(60);
    await onResend();
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 w-full max-w-[450px] shadow-2xl dark:shadow-gray-900/50 relative overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "url('https://cdn.21st.dev/assets/localized/16c55696aea9e60fe904ded95cfa9615f3dd5850411f794c155beb28679fd3a4.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl"></div>

      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2 tracking-tight">
          {state === "success"
            ? "Verifikasi Berhasil!"
            : "Masukkan Kode Keamanan"}
        </h1>

        <AnimatePresence mode="wait">
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
              style={{ height: "232px" }}
            >
              <OTPSuccess />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-center text-slate-600 dark:text-slate-300 mt-2 mb-8 text-sm sm:text-base px-4">
                Kami telah mengirim kode {length}-digit ke email
                <br />{" "}
                <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                  {email}
                </span>
              </p>

              <div className="flex flex-col items-center justify-center gap-2 mb-10 relative h-20">
                <motion.div
                  animate={animationControls}
                  className="flex items-center justify-center gap-2 sm:gap-3"
                >
                  {Array.from({ length }).map((_, index) => (
                    <OTPInputBox
                      key={`input-${index}`}
                      index={index}
                      length={length}
                      verifyOTP={verifyOTP}
                      state={state}
                      stiffness={stiffness}
                      damping={damping}
                      y={y}
                      opacity={opacity}
                    />
                  ))}
                </motion.div>
                <AnimatePresence>
                  {state === "error" && <OTPError message={errorMessage} />}
                </AnimatePresence>
              </div>

              <div className="text-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">
                  Tidak menerima kode?{" "}
                </span>
                {isResendDisabled ? (
                  <span className="font-semibold text-slate-400 dark:text-slate-500 text-sm">
                    Kirim ulang ({countdown}s)
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="font-semibold text-slate-900 dark:text-white hover:underline focus:outline-none text-sm transition-all"
                  >
                    Kirim Ulang
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OTPVerification;
