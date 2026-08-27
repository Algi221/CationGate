"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";

import SafeImage from "@/components/SafeImage";

interface iNavItem {
  heading: string;
  href: string;
  subItems?: { title: string; href: string }[];
}

interface iNavLinkProps extends iNavItem {
  setIsActive: (isActive: boolean) => void;
  index: number;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

interface iCurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  navItems: iNavItem[];
  footer?: React.ReactNode;
  schoolLogo?: string;
  schoolName?: string;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: {
    x: "0",
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
  exit: {
    x: "calc(100% + 100px)",
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
};

const CustomFooter: React.FC = () => null;

const NavLink: React.FC<iNavLinkProps> = ({
  heading,
  href,
  subItems,
  setIsActive,
  index: _index,
  onLinkClick,
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const rect = ref.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLinkClick) {
      onLinkClick(e, href);
    }
    if (subItems && subItems.length > 0) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      setIsActive(false);
    }
  };

  return (
    <div className="flex flex-col border-b border-slate-100 dark:border-slate-800/80 py-4 sm:py-5 md:py-6 transition-colors duration-500">
      <motion.div
        initial="initial"
        whileHover="whileHover"
        className="group relative flex items-center justify-between uppercase w-full cursor-pointer"
      >
        <Link
          ref={ref}
          onMouseMove={handleMouseMove}
          href={href}
          onClick={handleClick}
          className="w-full"
        >
          <div className="relative flex items-center justify-between w-full">
            <div className="flex flex-row gap-2 overflow-hidden">
              <motion.span
                variants={{ initial: { x: 0 }, whileHover: { x: -6 } }}
                transition={{
                  type: "spring",
                  staggerChildren: 0.05,
                  delayChildren: 0.15,
                }}
                className="relative z-10 block text-lg sm:text-xl md:text-3xl font-light tracking-wider text-slate-900 dark:text-white transition-colors duration-500 whitespace-nowrap"
              >
                {heading.split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    variants={{ initial: { x: 0 }, whileHover: { x: 6 } }}
                    transition={{ type: "spring" }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.span>
            </div>
            {subItems && subItems.length > 0 && (
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="text-slate-400 dark:text-slate-500 shrink-0 ml-2"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            )}
          </div>
        </Link>
      </motion.div>

      <AnimatePresence>
        {isOpen && subItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 mt-3 ml-4 sm:ml-6 md:ml-12 pl-2 border-l border-slate-200 dark:border-slate-800">
              {subItems.map((sub, i) => (
                <Link
                  key={i}
                  href={sub.href}
                  onClick={(e) => {
                    if (onLinkClick) {
                      onLinkClick(e, sub.href);
                    }
                    setIsActive(false);
                  }}
                  className="text-xs sm:text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  {sub.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Curve: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerHeight;
    }
    return 0;
  });

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowHeight === 0) return null;

  const initialPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q-100 ${windowHeight / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q100 ${windowHeight / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: {
      d: targetPath,
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      },
    },
    exit: {
      d: initialPath,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <svg className="absolute top-0 -left-24.75 w-25 stroke-none h-full fill-white dark:fill-[#0F0F11]">
      <motion.path
        variants={curve}
        initial="initial"
        animate="enter"
        exit="exit"
      />
    </svg>
  );
};

export const CurvedNavbar: React.FC<
  iCurvedNavbarProps & { footer?: React.ReactNode }
> = ({ setIsActive, navItems, footer, schoolLogo, schoolName, onLinkClick }) => {
  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-dvh w-full max-w-full fixed right-0 top-0 z-200 bg-white dark:bg-[#0F0F11] overflow-hidden flex flex-col"
    >
      {/* Header di dalam Sidebar (Logo & Close Button X) */}
      <div className="w-full px-7 sm:px-10 md:px-24 pt-6 sm:pt-7 pb-4 flex items-center justify-between z-20 shrink-0 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0">
          {schoolLogo ? (
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
              <SafeImage
                src={schoolLogo}
                alt={schoolName || "Logo"}
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
          ) : (
            <Image
              src="/assets/logo_cationgate/CationGate_Logo.png"
              alt="CationGate Logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain shrink-0"
            />
          )}
          <div className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white truncate">
            {schoolName || "CationGate"}
          </div>
        </div>

        {/* Close Button X */}
        <button
          type="button"
          onClick={() => setIsActive(false)}
          aria-label="Tutup menu"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="h-full pt-6 pb-8 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-2 px-7 sm:px-10 md:px-24">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-2">
            <div className="text-slate-400 dark:text-slate-500 uppercase text-[11px] font-bold tracking-widest">
              Navigation
            </div>
          </div>
          <section className="bg-transparent mt-0">
            <div className="mx-auto max-w-7xl">
              {navItems.map((item, index) => {
                return (
                  <NavLink
                    key={item.href}
                    {...item}
                    setIsActive={setIsActive}
                    index={index + 1}
                    onLinkClick={onLinkClick}
                  />
                );
              })}
            </div>
          </section>
        </div>
        {footer || <CustomFooter />}
      </div>
      <Curve />
    </motion.div>
  );
};

export const HamburgerButton = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? "Tutup menu" : "Buka menu"}
      className={`relative z-250 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm border active:scale-95 focus:outline-none ${
        isActive
          ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-black dark:text-white"
          : "bg-white/90 dark:bg-[#0F0F11]/90 backdrop-blur-md border-black/5 dark:border-white/10 text-[#1A202C] dark:text-white"
      }`}
    >
      <div className="relative w-5 h-3.5 flex flex-col justify-between items-center pointer-events-none">
        <span
          className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 origin-center ${
            isActive ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-current rounded-full transition-opacity duration-300 ${
            isActive ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-current rounded-full transition-transform duration-300 origin-center ${
            isActive ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </div>
    </button>
  );
};
