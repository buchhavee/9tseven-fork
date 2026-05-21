"use client";

import { motion, AnimatePresence } from "motion/react";

const TRANSITION = {
  type: "tween" as const,
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

function AnimatedDigit({ digit }: { digit: string }) {
  return (
    <span className="relative inline-block align-baseline">
      <span aria-hidden className="invisible">
        0
      </span>
      <span className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.span key={digit} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={TRANSITION} className="absolute inset-0">
            {digit}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

interface AnimatedCountProps {
  value: number;
  padTo?: number;
}

export default function AnimatedCount({ value, padTo = 2 }: AnimatedCountProps) {
  const padded = String(value).padStart(padTo, "0");
  return (
    <>
      {padded.split("").map((digit, i) => (
        <AnimatedDigit key={i} digit={digit} />
      ))}
    </>
  );
}
