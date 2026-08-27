"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description: string;
  bgClass?: string;
}

interface ImageSet {
  step1light1: StaticImageData | string;
  step1light2: StaticImageData | string;
  step2light1: StaticImageData | string;
  step2light2: StaticImageData | string;
  step3light1: StaticImageData | string;
  step3light2: StaticImageData | string;
  step4light1: StaticImageData | string;
  step4light2: StaticImageData | string;
  step5light1: StaticImageData | string;
  step5light2: StaticImageData | string;
  // step6light1: StaticImageData | string;
  // step6light2: StaticImageData | string;
  alt: string;
}

interface FeatureCarouselProps extends CardProps {
  desktopImgClass?: string;
  mobileImgClass?: string;
  image: ImageSet;
  initialStep?: number;
}

interface Step {
  id: string;
  name: string;
  title: string;
  description: string;
}

const TOTAL_STEPS = 5;
const AUTOPLAY_DURATION = 5000;

const steps: Step[] = [
  {
    id: "1",
    name: "Calon Siswa",
    title: "Kelola Data Calon Siswa",
    description: "Pantau pendaftar, status verifikasi, dokumen masuk, dan progres registrasi dari satu dashboard yang rapi.",
  },
  {
    id: "2",
    name: "Siswa Aktif",
    title: "Data Siswa Aktif Terpusat",
    description: "Kelola identitas siswa aktif, riwayat kelas, status akademik, dan update data penting secara cepat.",
  },
  {
    id: "3",
    name: "Pembagian Kelas",
    title: "Pembagian Kelas Otomatis",
    description: "Atur pembagian kelas berdasarkan kuota, jurusan, dan kebutuhan sekolah tanpa proses manual yang panjang.",
  },
  {
    id: "4",
    name: "Kelola Informasi",
    title: "Kelola Informasi dan UI",
    description: "Atur pengumuman, konten landing page, dan tampilan interface sekolah agar tetap konsisten dan mudah dipakai.",
  },
  {
    id: "5",
    name: "PPDB",
    title: "PPDB Sekolah",
    description: "Tampilkan fasilitas, prestasi, dan ekstrakurikuler sekolah secara komprehensif untuk membangun kepercayaan calon wali murid pada masa penerimaan siswa baru.",
  },
] as const;

const getStepImages = (image: ImageSet, step: number) => {
  const images = [
    [image.step1light1, image.step1light2],
    [image.step2light1, image.step2light2],
    [image.step3light1, image.step3light2],
    [image.step4light1, image.step4light2],
    [image.step5light1, image.step5light2],
    // [image.step6light1, image.step6light2],
  ];
  return images[step] ?? images[0];
};

function useFeatureCarousel(totalSteps: number) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSteps);
    setProgress(0);
  }, [totalSteps]);

  const previous = useCallback(() => {
    setCurrent((prev) => (prev - 1 + totalSteps) % totalSteps);
    setProgress(0);
  }, [totalSteps]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
  }, []);

  useEffect(() => {
    clearTimers();
    if (isPaused) return;

    const progressStep = 100 / (AUTOPLAY_DURATION / 50);

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + progressStep;
        return nextProgress >= 100 ? 0 : nextProgress;
      });
    }, 50);

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSteps);
      setProgress(0);
    }, AUTOPLAY_DURATION);

    return clearTimers;
  }, [isPaused, totalSteps, clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return { current, progress, isPaused, setIsPaused, next, previous, goTo };
}

function FeatureCard({
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative w-full overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-200/50 dark:shadow-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StepNavigation({
  current,
  onChange,
}: {
  current: number;
  onChange: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Feature navigation"
      className="flex w-full gap-2 overflow-x-auto scrollbar-none sm:flex-wrap sm:justify-center"
    >
      {steps.map((step, index) => {
        const active = current === index;
        const completed = current > index;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              `group relative flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-300`,
              active
                ? `border-[#2e3749] bg-[#2e3749] text-white shadow-sm`
                : `border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900`
            )}
          >
            <span
              className={cn(
                `flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-all`,
                active
                  ? "bg-white/15 text-white"
                  : completed
                    ? "bg-[#FFD33B] text-[#2e3749]"
                    : "bg-neutral-200 text-neutral-500"
              )}
            >
              {index + 1}
            </span>

            <span>{step.name}</span>

            {active && (
              <motion.span
                layoutId="activeDot"
                className="ml-0.5 h-1.5 w-1.5 rounded-full bg-[#FFD33B]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function ImageShowcase({
  image,
  step,
  desktopImgClass,
  mobileImgClass,
}: {
  image: ImageSet;
  step: number;
  desktopImgClass?: string;
  mobileImgClass?: string;
}) {
  const [desktopSrc, mobileSrc] = getStepImages(image, step);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* DESKTOP IMAGE - DIPERBESAR */}
          <motion.div
            initial={{ opacity: 0, x: 70, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              `absolute right-[-2%] top-[10%] z-10 w-[100%] md:right-[-2%] md:top-[8%] md:w-[90%]`,
              desktopImgClass
            )}
          >
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">
              <div className="flex h-7 items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-3">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <div className="ml-2 h-2.5 w-24 rounded-full bg-neutral-200" />
              </div>
              <Image
                src={desktopSrc}
                alt={`${image.alt} Desktop`}
                width={2000}
                height={800}
                className="block h-auto w-full object-cover object-left-top"
              />
            </div>
          </motion.div>

          {/* MOBILE IMAGE - DIPERBESAR */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 25, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, y: 20, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              `absolute bottom-[-2%] right-[2%] z-20 w-[28%] min-w-[120px] max-w-[200px]`,
              mobileImgClass
            )}
          >
            <div className="overflow-hidden rounded-[22px] bg-[#2e3749] shadow-[0_25px_55px_rgba(0,0,0,0.25)] border-4 border-[#2e3749]">
              <Image
                src={mobileSrc}
                alt={`${image.alt} Mobile`}
                width={400}
                height={800}
                className="block h-auto w-full rounded-[18px]"
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function FeatureCarousel({
  image,
  desktopImgClass,
  mobileImgClass,
  initialStep,
}: FeatureCarouselProps) {
  const { current, setIsPaused, goTo } = useFeatureCarousel(TOTAL_STEPS);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialStep !== undefined && initialStep !== null) {
      goTo(initialStep);
    }
  }, [initialStep, goTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleGoToStep = (e: Event) => {
      const customEvent = e as CustomEvent;
      const stepIndex = customEvent.detail;
      if (typeof stepIndex === "number") {
        goTo(stepIndex);
      }
    };

    container.addEventListener("goToStep", handleGoToStep);
    return () => container.removeEventListener("goToStep", handleGoToStep);
  }, [goTo]);

  return (
    <div ref={containerRef}>
    <FeatureCard
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* TOP NAVIGATION */}
      <div className="relative z-50 px-5 pt-6 sm:px-7 md:px-9 md:pt-7">
        <StepNavigation current={current} onChange={goTo} />
      </div>

      {/* CONTENT */}
      <div className="relative flex min-h-[500px] flex-col overflow-hidden px-6 pb-14 pt-8 md:min-h-[600px] md:flex-row md:px-10 md:pt-5">
        {/* TEXT */}
        <div className="relative z-40 flex w-full flex-col justify-start pt-4 md:justify-center md:pt-0 md:w-[35%] md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Label Yellow & Dark Blue */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFD33B] bg-[#FFD33B]/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2e3749]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2e3749]" />
                Fitur Unggulan
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="max-w-100 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#2e3749] md:text-[42px]"
              >
                {steps[current].title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="mt-5 max-w-97.5 text-sm leading-6 text-neutral-500 md:text-[15px] md:leading-7"
              >
                {steps[current].description}
              </motion.p>

              {/* Number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-7 flex items-center gap-3"
              >
                <span className="text-3xl font-semibold tracking-tighter text-neutral-200">
                  {String(current + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-8 bg-neutral-200" />
                <span className="text-xs font-medium text-neutral-400">
                  {steps[current].name}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* IMAGES CONTAINER (Ditinggikan untuk mobile) */}
        <div className="relative min-h-[350px] sm:min-h-[450px] flex-1 mt-8 md:mt-0 md:min-h-0">
          <ImageShowcase
            image={image}
            step={current}
            desktopImgClass={desktopImgClass}
            mobileImgClass={mobileImgClass}
          />
        </div>
      </div>
    </FeatureCard>
    </div>
  );
}

export default FeatureCarousel;