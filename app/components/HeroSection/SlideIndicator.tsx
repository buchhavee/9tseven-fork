import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "./types";
import { AUTO_SLIDE_INTERVAL_MS } from "./hooks/useAutoSlide";
import AnimatedCount from "../AnimatedCount";

interface SlideIndicatorProps {
  current: number;
  slides: HeroSlide[];
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

interface SlideIndicatorDesktopProps extends SlideIndicatorProps {
  className?: string;
  progressKey?: number;
}

const TEXT_TRANSITION = {
  type: "tween" as const,
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

const SMOOTH_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function SlideIndicatorMobile({ current, slides, onPrev, onNext, onGoTo }: SlideIndicatorProps) {
  return (
    <div className="md:hidden absolute bottom-8 left-8 right-8 z-10 pointer-events-none grid grid-cols-3 items-center">
      <div className="flex items-center gap-6 pointer-events-auto justify-self-start">
        <button onClick={onPrev} aria-label="Previous slide" className="text-fg-muted hover:text-fg transition-colors duration-base">
          <ChevronLeft size={22} strokeWidth={1.5} />
        </button>
        <button onClick={onNext} aria-label="Next slide" className="text-fg-muted hover:text-fg transition-colors duration-base">
          <ChevronRight size={22} strokeWidth={1.5} />
        </button>
      </div>

      <span className="font-mono text-fg-muted text-sm tracking-eyebrow tabular-nums justify-self-center pointer-events-auto">
        <AnimatedCount value={current + 1} />
        &nbsp;/&nbsp;
        {String(slides.length).padStart(2, "0")}
      </span>

      <div className="flex items-center gap-2 pointer-events-auto justify-self-end">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (i !== current) onGoTo(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className="size-2 rounded-full"
            style={{
              backgroundColor: i === current ? "var(--color-fg)" : "var(--color-fg-subtle)",
              transition: `background-color 300ms ${SMOOTH_EASE}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function SlideIndicatorDesktop({ current, slides, onPrev, onNext, onGoTo, className = "", progressKey = 0 }: SlideIndicatorDesktopProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={className}>
      <div className="flex gap-1 w-full pointer-events-auto">
        {slides.map((slide, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              if (i !== current) onGoTo(i);
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="flex-1 group"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className="relative h-10 flex items-end">
              <div
                className="hidden md:flex absolute bottom-2 left-0 w-full justify-start"
                style={{
                  height: "clamp(0.7rem, 1.1vw, 0.9rem)",
                  opacity: hoveredIndex === i ? 1 : 0,
                  clipPath: "inset(0 -9999px)",
                  transition: `opacity 300ms ${SMOOTH_EASE}`,
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {hoveredIndex === i && (
                    <motion.p key={`indicator-heading-${i}`} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={TEXT_TRANSITION} className="font-bold text-fg leading-[1.1] uppercase tracking-tight whitespace-nowrap" style={{ fontSize: "clamp(0.6rem, 0.9vw, 0.8rem)" }}>
                      {slide.heading}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="relative z-10 w-full h-1 group-hover:h-1.5 overflow-hidden"
                style={{
                  backgroundColor: i === current ? "var(--color-fg-muted)" : "var(--color-fg-subtle)",
                  transition: `height 400ms ${SMOOTH_EASE}, background-color 400ms ${SMOOTH_EASE}`,
                }}
              >
                {i === current && (
                  <div
                    key={`progress-${current}-${progressKey}`}
                    className="absolute inset-0 origin-left"
                    style={{
                      backgroundColor: "var(--color-fg)",
                      animation: `slide-indicator-progress ${AUTO_SLIDE_INTERVAL_MS}ms linear infinite`,
                    }}
                  />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pointer-events-auto">
        <span className="font-mono text-fg-muted text-sm tracking-eyebrow tabular-nums">
          <AnimatedCount value={current + 1} />
          &nbsp;/&nbsp;
          {String(slides.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-6">
          <button onClick={onPrev} aria-label="Previous slide" className="text-fg-muted hover:text-fg transition-colors duration-base">
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button onClick={onNext} aria-label="Next slide" className="text-fg-muted hover:text-fg transition-colors duration-base">
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
