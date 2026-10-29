"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

export interface TimelineContentProps {
  children?: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLDivElement | null>;
  customVariants?: Variants;
  className?: string;
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "p" | "span" | "article" | "section";
  style?: React.CSSProperties;
}

export function TimelineContent({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  as = "div",
  style,
}: TimelineContentProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const targetRef = timelineRef || localRef;
  const isInView = useInView(targetRef, { once: true, margin: "-10%" });

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  const variants = customVariants || defaultVariants;

  const motionComponents = {
    div: motion.div,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    p: motion.p,
    span: motion.span,
    article: motion.article,
    section: motion.section,
  };

  const MotionComponent = motionComponents[as] || motion.div;

  return (
    <MotionComponent
      ref={localRef as any}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}

export default TimelineContent;

