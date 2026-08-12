"use client";

import {
  GraduationCap,
  BookOpen,
  School,
  Laptop,
  ClipboardList,
  FileText,
  CalendarDays,
  Users,
  UserRound,
  Pencil,
  Library,
  BadgeCheck,
  Monitor,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const icons = [
  { Icon: GraduationCap, x: "8%", y: "18%", delay: 0 },
  { Icon: BookOpen, x: "18%", y: "65%", delay: 2 },
  { Icon: School, x: "84%", y: "18%", delay: 4 },
  { Icon: Laptop, x: "91%", y: "62%", delay: 1 },
  { Icon: ClipboardList, x: "7%", y: "78%", delay: 5 },
  { Icon: FileText, x: "24%", y: "25%", delay: 3 },
  { Icon: CalendarDays, x: "78%", y: "72%", delay: 6 },
  { Icon: Users, x: "88%", y: "38%", delay: 2.5 },
  { Icon: UserRound, x: "14%", y: "42%", delay: 7 },
  { Icon: Pencil, x: "76%", y: "28%", delay: 4.5 },
  { Icon: Library, x: "31%", y: "78%", delay: 1.5 },
  { Icon: BadgeCheck, x: "68%", y: "80%", delay: 5.5 },
  { Icon: Monitor, x: "93%", y: "82%", delay: 3.5 },
  { Icon: MessageCircle, x: "5%", y: "38%", delay: 6.5 },
];

export default function PpdbIconBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {icons.map(({ Icon, x, y, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: x,
            top: y,
          }}
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: [0, 0.12, 0.18, 0],
            scale: [0.8, 1, 1.05, 1],
            y: [8, 0, -4, 8],
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        >
          <Icon
            size={32}
            strokeWidth={1.2}
            className="text-[#2A1B1D]"
          />
        </motion.div>
      ))}
    </div>
  );
}