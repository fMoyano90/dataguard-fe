"use client";

import { motion } from "framer-motion";

type Level = "low" | "medium" | "high";

interface SemaphoreProps {
  level: Level;
  title: string;
  subtitle?: string;
}

const levelConfig: Record<
  Level,
  { icon: string; container: string; titleColor: string; subtitleColor: string; pulse: boolean }
> = {
  low: {
    icon: "🟢",
    container: "border-success-300 bg-success-50",
    titleColor: "text-success-700",
    subtitleColor: "text-success-800",
    pulse: false,
  },
  medium: {
    icon: "🟡",
    container: "border-warning-300 bg-warning-50",
    titleColor: "text-warning-800",
    subtitleColor: "text-warning-900",
    pulse: false,
  },
  high: {
    icon: "🔴",
    container: "border-danger-300 bg-danger-50",
    titleColor: "text-danger-700",
    subtitleColor: "text-danger-800",
    pulse: true,
  },
};

export function Semaphore({ level, title, subtitle }: SemaphoreProps) {
  const cfg = levelConfig[level];
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-live="polite"
      className={`grid place-items-center gap-3 rounded-[24px] border-2 px-6 py-8 text-center ${cfg.container} ${cfg.pulse ? "animate-pulse-soft" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      role="status"
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <span aria-hidden className="text-[80px] leading-none">{cfg.icon}</span>
      <h2 className={`text-h2 ${cfg.titleColor}`}>{title}</h2>
      {subtitle ? <p className={`text-h3 ${cfg.subtitleColor} max-w-prose`}>{subtitle}</p> : null}
    </motion.section>
  );
}
