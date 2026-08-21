"use client";
import React from "react";
import { motion, useInView } from "framer-motion";

export const TimelineAnimation = ({
  children,
  animationNum = 1,
  timelineRef,
  className,
  as: Component = "div",
}: any) => {
  const isInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const MotionComponent = motion(Component as any);

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: animationNum * 0.1 }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};
