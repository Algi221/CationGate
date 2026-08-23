"use client";
import React from "react";
import { motion, useInView, HTMLMotionProps } from "framer-motion";

interface TimelineAnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  animationNum?: number;
  timelineRef: React.RefObject<HTMLElement | null>;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span" | "section";
}

const MotionElements = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  section: motion.section,
};

export const TimelineAnimation = ({
  children,
  animationNum = 1,
  timelineRef,
  className,
  as = "div",
  ...props
}: TimelineAnimationProps) => {
  const isInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const MotionComponent = MotionElements[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: animationNum * 0.1 }}
      className={className}
      {...(props as object)}
    >
      {children}
    </MotionComponent>
  );
};
