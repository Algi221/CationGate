"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Globe, Mail, MessageCircle, Smartphone, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

interface iNavItem {
  heading: string;
  href: string;
  subItems?: { title: string; href: string }[];
}

interface iNavLinkProps extends iNavItem {
  setIsActive: (isActive: boolean) => void;
  index: number;
}

interface iCurvedNavbarProps {
  setIsActive: (isActive: boolean) => void;
  navItems: iNavItem[];
}

const MENU_SLIDE_ANIMATION = {
  initial: { x: "calc(100% + 100px)" },
  enter: { x: "0", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } },
  exit: {
    x: "calc(100% + 100px)",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
  },
};

const CustomFooter: React.FC = () => null;

const NavLink: React.FC<iNavLinkProps> = ({ heading, href, subItems, setIsActive, index }) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const rect = ref.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (subItems && subItems.length > 0) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      setIsActive(false);
    }
  };

  return (
    <div className="flex flex-col border-b border-black/20 dark:border-white/20 py-4 md:py-6 transition-colors duration-500">
      <motion.div
        initial="initial"
        whileHover="whileHover"
        className="group relative flex items-center justify-between uppercase w-full cursor-pointer"
      >
        <Link ref={ref} onMouseMove={handleMouseMove} href={href} onClick={handleClick} className="w-full">
          <div className="relative flex items-center justify-between w-full">
              <div className="flex flex-row gap-2">
                <motion.span
                  variants={{ initial: { x: 0 }, whileHover: { x: -16 } }}
                  transition={{ type: "spring", staggerChildren: 0.075, delayChildren: 0.25 }}
                  className="relative z-10 block text-3xl md:text-4xl font-extralight text-black dark:text-white transition-colors duration-500"
                >
                  {heading.split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={{ initial: { x: 0 }, whileHover: { x: 16 } }}
                      transition={{ type: "spring" }}
                      className="inline-block"
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </motion.span>
              </div>
            {subItems && subItems.length > 0 && (
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-black dark:text-white">
                <ChevronDown className="w-6 h-6 opacity-50" />
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
            <div className="flex flex-col gap-3 mt-4 ml-[4.5rem] md:ml-[5.5rem]">
              {subItems.map((sub, i) => (
                <Link
                  key={i}
                  href={sub.href}
                  onClick={() => setIsActive(false)}
                  className="text-lg font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
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
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowHeight === 0) return null;

  const initialPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q-100 ${windowHeight / 2} 100 0`;
  const targetPath = `M100 0 L200 0 L200 ${windowHeight} L100 ${windowHeight} Q100 ${windowHeight / 2} 100 0`;

  const curve = {
    initial: { d: initialPath },
    enter: { d: targetPath, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } },
    exit: { d: initialPath, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } },
  };

  return (
    <svg className="absolute top-0 -left-[99px] w-[100px] stroke-none h-full fill-white dark:fill-[#0F0F11]">
      <motion.path variants={curve} initial="initial" animate="enter" exit="exit" />
    </svg>
  );
};

export const CurvedNavbar: React.FC<iCurvedNavbarProps & { footer?: React.ReactNode }> = ({ setIsActive, navItems, footer }) => {
  return (
    <motion.div
      variants={MENU_SLIDE_ANIMATION}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-[100dvh] w-screen max-w-screen-sm fixed right-0 top-0 z-[100] bg-white dark:bg-[#0F0F11]"
    >
      <div className="h-full pt-20 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-3 px-10 md:px-24">
          <div className="flex items-center justify-between border-b border-black/30 dark:border-white/30 pb-4 mb-2">
            <div className="text-black dark:text-white uppercase text-xs font-bold tracking-widest">
              Navigation
            </div>
            <button 
              onClick={() => setIsActive(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-black dark:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <section className="bg-transparent mt-0">
            <div className="mx-auto max-w-7xl">
              {navItems.map((item, index) => {
                return <NavLink key={item.href} {...item} setIsActive={setIsActive} index={index + 1} />;
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

export const HamburgerButton = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={`relative z-[110] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ${
        isActive ? "bg-transparent" : "bg-white/80 dark:bg-[#0F0F11]/80 backdrop-blur-md"
      }`}
    >
      <div className="relative w-6 h-5 flex flex-col justify-between items-center">
        <span
          className={`block h-[2px] w-full bg-slate-900 dark:bg-white transition-transform duration-300 origin-center ${
            isActive ? "rotate-45 translate-y-[9px]" : ""
          }`}
        ></span>
        <span
          className={`block h-[2px] w-full bg-slate-900 dark:bg-white transition-opacity duration-300 ${
            isActive ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block h-[2px] w-full bg-slate-900 dark:bg-white transition-transform duration-300 origin-center ${
            isActive ? "-rotate-45 -translate-y-[9px]" : ""
          }`}
        ></span>
      </div>
    </div>
  );
};