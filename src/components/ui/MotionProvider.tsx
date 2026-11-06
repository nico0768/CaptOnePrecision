"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Toutes les animations Motion respectent la préférence système « réduire les animations ». */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
