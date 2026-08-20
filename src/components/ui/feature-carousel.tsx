"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react"

import Image, { type StaticImageData } from "next/image"

import {
  AnimatePresence,
  motion,
} from "motion/react"

import Balancer from "react-wrap-balancer"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pause,
  Play,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* =========================================================
   TYPES
========================================================= */

interface CardProps {
  title: string
  description: string
  bgClass?: string
}

interface ImageSet {
  step1light1: StaticImageData | string
  step1light2: StaticImageData | string

  step2light1: StaticImageData | string
  step2light2: StaticImageData | string

  step3light1: StaticImageData | string
  step3light2: StaticImageData | string

  step4light1: StaticImageData | string
  step4light2: StaticImageData | string

  step5light1: StaticImageData | string
  step5light2: StaticImageData | string

  step6light1: StaticImageData | string
  step6light2: StaticImageData | string

  alt: string
}

interface FeatureCarouselProps extends CardProps {
  desktopImgClass?: string
  mobileImgClass?: string
  image: ImageSet
}

interface Step {
  id: string
  name: string
  title: string
  description: string
}

/* =========================================================
   CONSTANTS
========================================================= */

const TOTAL_STEPS = 6
const AUTOPLAY_DURATION = 5000

/* =========================================================
   STEPS
========================================================= */

const steps = [
  {
    id: "1",
    name: "Calon Siswa",
    title: "Kelola Data Calon Siswa",
    description:
      "Pantau pendaftar, status verifikasi, dokumen masuk, dan progres registrasi dari satu dashboard yang rapi.",
  },
  {
    id: "2",
    name: "Siswa Aktif",
    title: "Data Siswa Aktif Terpusat",
    description:
      "Kelola identitas siswa aktif, riwayat kelas, status akademik, dan update data penting secara cepat.",
  },
  {
    id: "3",
    name: "Pembagian Kelas",
    title: "Pembagian Kelas Otomatis",
    description:
      "Atur pembagian kelas berdasarkan kuota, jurusan, dan kebutuhan sekolah tanpa proses manual yang panjang.",
  },
  {
    id: "4",
    name: "UI & Info",
    title: "Kelola Informasi dan UI",
    description:
      "Atur pengumuman, konten landing page, dan tampilan interface sekolah agar tetap konsisten dan mudah dipakai.",
  },
  {
    id: "5",
    name: "Keuangan",
    title: "Manajemen Keuangan",
    description:
      "Pantau SPP bulanan, uang gedung, dan laporan tunggakan secara otomatis.",
  },
  {
    id: "6",
    name: "Laporan",
    title: "Laporan Terintegrasi",
    description:
      "Cetak laporan harian dan bulanan dengan satu klik tanpa harus merekap manual dari Excel.",
  },
] as const

/* =========================================================
   IMAGE HELPER
========================================================= */

const getStepImages = (
  image: ImageSet,
  step: number
) => {
  const images = [
    [image.step1light1, image.step1light2],
    [image.step2light1, image.step2light2],
    [image.step3light1, image.step3light2],
    [image.step4light1, image.step4light2],
    [image.step5light1, image.step5light2],
    [image.step6light1, image.step6light2],
  ]

  return images[step] ?? images[0]
}

/* =========================================================
   AUTOPLAY HOOK
========================================================= */

function useFeatureCarousel(totalSteps: number) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (progressRef.current) {
      clearInterval(progressRef.current)
      progressRef.current = null
    }
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSteps)
    setProgress(0)
  }, [totalSteps])

  const previous = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + totalSteps) % totalSteps
    )
    setProgress(0)
  }, [totalSteps])

  const goTo = useCallback((index: number) => {
    setCurrent(index)
    setProgress(0)
  }, [])

  useEffect(() => {
    clearTimers()

    if (isPaused) return

    const progressStep =
      100 / (AUTOPLAY_DURATION / 50)

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + progressStep

        return nextProgress >= 100 ? 0 : nextProgress
      })
    }, 50)

    intervalRef.current = setInterval(() => {
      setCurrent(
        (prev) => (prev + 1) % totalSteps
      )

      setProgress(0)
    }, AUTOPLAY_DURATION)

    return clearTimers
  }, [
    isPaused,
    totalSteps,
    clearTimers,
  ])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  return {
    current,
    progress,
    isPaused,
    setIsPaused,
    next,
    previous,
    goTo,
  }
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        bg-white
      
      "
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

/* =========================================================
   BADGE NAVIGATION
========================================================= */

function StepNavigation({
  current,
  onChange,
}: {
  current: number
  onChange: (index: number) => void
}) {
  return (
    <nav
      aria-label="Feature navigation"
      className="
        flex
        w-full
        gap-2
        overflow-x-auto
        scrollbar-none
        sm:flex-wrap
        sm:justify-center
      "
    >
      {steps.map((step, index) => {
        const active = current === index
        const completed = current > index

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              `
                group
                relative
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                px-3.5
                py-2
                text-xs
                font-medium
                transition-all
                duration-300
              `,
              active
                ? `
                  border-neutral-900
                  bg-neutral-900
                  text-white
                  shadow-sm
                `
                : `
                  border-neutral-200
                  bg-neutral-50
                  text-neutral-500
                  hover:border-neutral-300
                  hover:bg-neutral-100
                  hover:text-neutral-900
                `
            )}
          >
            {/* Number / check */}
            <span
              className={cn(
                `
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-[10px]
                  font-semibold
                  transition-all
                `,
                active
                  ? "bg-white/15 text-white"
                  : completed
                    ? "bg-[#c6ea7e] text-neutral-900"
                    : "bg-neutral-200 text-neutral-500"
              )}
            >
              {completed ? (
                <Check
                  size={11}
                  strokeWidth={3}
                />
              ) : (
                index + 1
              )}
            </span>

            {/* Name */}
            <span>
              {step.name}
            </span>

            {/* Active dot */}
            {active && (
              <motion.span
                layoutId="activeDot"
                className="
                  ml-0.5
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#c6ea7e]
                "
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}

/* =========================================================
   IMAGE SHOWCASE
========================================================= */

function ImageShowcase({
  image,
  step,
  desktopImgClass,
  mobileImgClass,
}: {
  image: ImageSet
  step: number
  desktopImgClass?: string
  mobileImgClass?: string
}) {
  const [
    desktopSrc,
    mobileSrc,
  ] = getStepImages(image, step)

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          {/* =================================================
              DESKTOP IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 70,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: -30,
              scale: 0.98,
            }}
            transition={{
              duration: 0.7,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={cn(
              `
                absolute
                right-[-4%]
                top-[16%]
                z-10
                w-[78%]
                md:right-[-5%]
                md:top-[12%]
                md:w-[76%]
              `,
              desktopImgClass
            )}
          >
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-neutral-200
                bg-white
                shadow-[0_25px_70px_rgba(0,0,0,0.12)]
              "
            >
              {/* Browser bar */}
              <div
                className="
                  flex
                  h-7
                  items-center
                  gap-1.5
                  border-b
                  border-neutral-100
                  bg-neutral-50
                  px-3
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />

                <div
                  className="
                    ml-2
                    h-2.5
                    w-24
                    rounded-full
                    bg-neutral-200
                  "
                />
              </div>

              <Image
                src={desktopSrc}
                alt={`${image.alt} Desktop`}
                width={2000}
                height={800}
                className="block h-auto w-full"
              />
            </div>
          </motion.div>

          {/* =================================================
              MOBILE IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
              y: 25,
              scale: 0.85,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: 20,
              y: 20,
              scale: 0.9,
            }}
            transition={{
              duration: 0.7,
              delay: 0.12,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={cn(
              `
                absolute
                bottom-[4%]
                right-[5%]
                z-20
                w-[19%]
                min-w-[110px]
                max-w-[155px]
              `,
              mobileImgClass
            )}
          >
            <div
              className="
                overflow-hidden
                rounded-[22px]
              
                bg-neutral-900
                shadow-[0_25px_55px_rgba(0,0,0,0.18)]
              "
            >
              <Image
                src={mobileSrc}
                alt={`${image.alt} Mobile`}
                width={400}
                height={800}
                className="block h-auto w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export function FeatureCarousel({
  image,
  desktopImgClass,
  mobileImgClass,
  ...props
}: FeatureCarouselProps) {
  const {
    current,
    progress,
    isPaused,
    setIsPaused,
    next,
    previous,
    goTo,
  } = useFeatureCarousel(TOTAL_STEPS)

  return (
    <FeatureCard
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <div
        className="
          relative
          z-50
          px-5
          pt-6
          sm:px-7
          md:px-9
          md:pt-7
        "
      >
        <StepNavigation
          current={current}
          onChange={goTo}
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          flex
          min-h-[580px]
          flex-col
          overflow-hidden
          px-6
          pb-14
          pt-8
          md:min-h-[570px]
          md:flex-row
          md:px-10
          md:pt-5
        "
      >
        {/* ===================================================
            TEXT
        =================================================== */}

        <div
          className="
            relative
            z-40
            flex
            w-full
            flex-col
            justify-center
            md:w-[34%]
            md:pb-10
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {/* Label */}
              <div
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#c6ea7e]/50
                  bg-[#c6ea7e]/10
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#719b32]
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#9dcc4f]" />

                Fitur Unggulan
              </div>

              {/* Title */}
              <motion.h2
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.08,
                }}
                className="
                  max-w-[400px]
                  text-3xl
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.045em]
                  text-neutral-900
                  md:text-[42px]
                "
              >
                {steps[current].title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.14,
                }}
                className="
                  mt-5
                  max-w-[390px]
                  text-sm
                  leading-6
                  text-neutral-500
                  md:text-[15px]
                  md:leading-7
                "
              >
                <Balancer>
                  {steps[current].description}
                </Balancer>
              </motion.p>

              {/* Number */}
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.2,
                }}
                className="
                  mt-7
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    text-3xl
                    font-semibold
                    tracking-[-0.05em]
                    text-neutral-200
                  "
                >
                  {String(current + 1).padStart(2, "0")}
                </span>

                <span className="h-px w-8 bg-neutral-200" />

                <span
                  className="
                    text-xs
                    font-medium
                    text-neutral-400
                  "
                >
                  {steps[current].name}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===================================================
            IMAGES
        =================================================== */}

        <div
          className="
            relative
            min-h-[330px]
            flex-1
            md:min-h-0
          "
        >
          <ImageShowcase
            image={image}
            step={current}
            desktopImgClass={desktopImgClass}
            mobileImgClass={mobileImgClass}
          />
        </div>
      </div>
    
    </FeatureCard>
  )
}

export default FeatureCarousel