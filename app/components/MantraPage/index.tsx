"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import type { MotionValue } from "motion/react";
import { ChevronDown } from "lucide-react";
import AnimatedCount from "../AnimatedCount";

// Piecewise linear remap of `v` through (input,output) stops.
function remap(v: number, stops: Array<[number, number]>): number {
  if (v <= stops[0][0]) return stops[0][1];
  if (v >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 1; i < stops.length; i++) {
    const [x1, y1] = stops[i - 1];
    const [x2, y2] = stops[i];
    if (v <= x2) return y1 + ((v - x1) / (x2 - x1)) * (y2 - y1);
  }
  return stops[stops.length - 1][1];
}

const TOTAL = 11;
const RADIUS = 42; // % of the square container
// First 80% of scroll fills the dots; center dot then expands and the screen fades to black.
const FILL_END = 0.8;
const WHITE_OUT_END = 0.9; // center dot fully covers the screen
const TEXT_IN = 0.83; // text begins fading in partway into the expansion (matches original cadence)
const TEXT_PEAK = 0.9; // text fully visible the moment whiteout completes
const TEXT_OUT_START = 0.94;
const TAIL_START = 0.94; // black overlay starts fading in alongside text fade-out
const TEXT_OUT_END = 0.98;

// Dot 0 = center; dots 1–10 evenly placed clockwise from 12 o'clock
const DOTS: [number, number][] = [
  [50, 50], // 0 — center
  ...Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / 10;
    return [50 + RADIUS * Math.cos(angle), 50 + RADIUS * Math.sin(angle)] as [number, number];
  }),
];

// Clockwise from top-right (dot 2 ≈ 1 o'clock), outer ring first, center last
const CLOCKWISE_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 0];

const TEXTS = ["", "Gratitude. Thank you for this one life.", "Create a space for diversity. We are all the same.", "It's you vs you. At your own pace, in your own time.", "Welcome all feelings. To appreciate the highs, we have to appreciate the lows.", "Nothing changes if nothing changes. Start now and improve later.", "Challenge your limits. Growth happens when you step outside your comfort zone.", "Fuel your passion, not just your body. What drives you is as important as what nourishes you.", "You're always developing, always evolving. Enjoy the process.", "Holistic health. Invest in your physical, mental and emotional well-being.", "Community. Create a space for inspiration & human connection.", "You"];

const FILL_SEQUENCE: number[] = new Array(TOTAL).fill(0);
CLOCKWISE_ORDER.forEach((dotIdx, order) => {
  FILL_SEQUENCE[dotIdx] = order;
});

function Dot({ x, y, fillOrder, scrollYProgress, maxScale }: { x: number; y: number; fillOrder: number; scrollYProgress: MotionValue<number>; maxScale: number }) {
  const isCenter = fillOrder === TOTAL - 1;

  // Compress fill ranges into the first FILL_END of scroll progress
  const start = (fillOrder / TOTAL) * FILL_END;
  const end = ((fillOrder + 1) / TOTAL) * FILL_END;

  const fill = useTransform(scrollYProgress, [start, end], [0, 1]);
  const bg = useTransform(fill, (v) => `rgba(255,255,255,${v})`);
  const border = useTransform(fill, (v) => `rgba(255,255,255,${0.5 + v * 0.5})`);

  // Center dot scales up to fill the section after all dots are filled.
  // Non-center dots use a flat [0,1]→[1,1] range so hooks are always called.
  const scale = useTransform(scrollYProgress, isCenter ? [FILL_END, WHITE_OUT_END] : [0, 1], isCenter ? [1, maxScale] : [1, 1]);

  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}>
      <motion.div
        className="w-7 h-7 rounded-full"
        style={{
          backgroundColor: bg,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: border,
          scale,
          ...(isCenter ? { zIndex: 10 } : {}),
        }}
      />
    </div>
  );
}

export default function MantraPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [filledCount, setFilledCount] = useState(0);
  const [labelFadingOut, setLabelFadingOut] = useState(false);
  const [maxScale, setMaxScale] = useState(80);
  const [navTheme, setNavTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const calculate = () => {
      // dot is w-7 = 28px, radius = 14px; scale must cover viewport diagonal from center
      const diag = Math.sqrt((window.innerWidth / 2) ** 2 + (window.innerHeight / 2) ** 2);
      setMaxScale(Math.ceil(diag / 14) + 2);
    };
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const [textOpacity, setTextOpacity] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setFilledCount(Math.min(TOTAL, Math.round((v / FILL_END) * TOTAL)));
    setLabelFadingOut(v > FILL_END);
    // Light nav while the white reveal is on screen; flip back to dark for the fade-out tail.
    setNavTheme(v >= WHITE_OUT_END && v < TAIL_START ? "light" : "dark");
    setTextOpacity(remap(v, [[TEXT_IN, 0], [TEXT_PEAK, 1], [TEXT_OUT_START, 1], [TEXT_OUT_END, 0]]));
    setFadeOpacity(remap(v, [[TAIL_START, 0], [1, 1]]));
  });
  // Plain CSS opacity (not a motion value) to avoid layer promotion that
  // disables subpixel font AA and makes the text look grey.
  const labelVisible = filledCount >= 1 && !labelFadingOut;

  // Corner accent dots: alternate filled/outline as each point is reached; both filled at the end.
  const dotAFilled = filledCount === TOTAL || filledCount % 2 === 1;
  const dotBFilled = filledCount === TOTAL || (filledCount > 0 && filledCount % 2 === 0);

  return (
    <div ref={wrapperRef} style={{ height: "1400vh" }}>
      <section data-nav-theme={navTheme} className="sticky top-0 w-full h-screen bg-bg overflow-hidden select-none">
        <div className="absolute top-20 right-5 flex flex-col gap-1.5 pointer-events-none">
          <div className={`w-1.75 h-1.75 rounded-full border border-edge-strong transition-colors duration-base ${dotAFilled ? "bg-white border-fg" : "bg-transparent"}`} />
          <div className={`w-1.75 h-1.75 rounded-full border border-edge-strong transition-colors duration-base ${dotBFilled ? "bg-white border-fg" : "bg-transparent"}`} />
        </div>

        {/* Rotated side label */}
        <p
          className="absolute left-4 pointer-events-none font-mono text-md tracking-display uppercase text-fg-ghost whitespace-nowrap"
          style={{
            top: "50%",
            transform: "rotate(-90deg) translateX(-50%)",
            transformOrigin: "left center",
          }}
        >
          9TSEVEN_MANTRA
        </p>

        {/* Centered square container keeps the circle perfectly round */}
        <div className="absolute inset-0 px-2 flex flex-col items-center justify-center gap-10">
          <div className="h-32 md:h-20 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <p className="font-mono text-base md:text-xl tabular-nums tracking-eyebrow text-fg leading-none transition-opacity duration-slow ease-out" style={{ opacity: labelVisible ? 1 : 0 }}>
              <AnimatedCount value={Math.max(filledCount, 1)} />.
            </p>
            <p className="text-base md:text-xl text-pretty tracking-eyebrow uppercase text-fg text-center transition-opacity duration-slow ease-out" style={{ opacity: labelVisible ? 1 : 0 }}>
              {TEXTS[filledCount] || TEXTS[1]}
            </p>
          </div>

          <div className="relative" style={{ width: "min(55vw, 55vh)", aspectRatio: "1" }}>
            {DOTS.map(([x, y], i) => (
              <Dot key={i} x={x} y={y} fillOrder={FILL_SEQUENCE[i]} scrollYProgress={scrollYProgress} maxScale={maxScale} />
            ))}
          </div>
        </div>

        {/* Text revealed over the white fill */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 gap-6" style={{ opacity: textOpacity }}>
          <p className="text-ink text-lg md:text-2xl leading-relaxed text-center max-w-2xl whitespace-pre-line">{"This is what we strive to live by.\nA mindset of growth, balance, and accountability. Grounded in gratitude, driven by progress, and open to every part of the journey.\n\nTake what resonates. Move at your own pace. Keep evolving."}</p>
          <Image src="/images/Logo/9t7.svg" alt="9TSEVEN" width={10} height={10} className="w-5 h-5 invert p-0.5" style={{ width: "40px", height: "40px" }} />
        </div>

        {/* Fade-to-black tail — slides the white reveal back into the dark before the next section appears */}
        <div aria-hidden className="absolute inset-0 z-30 bg-bg pointer-events-none" style={{ opacity: fadeOpacity }} />

        {/* Bottom instruction — pulses gently, disappears once the first dot is reached */}
        <motion.div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-1.5 pointer-events-none" animate={{ opacity: filledCount >= 1 ? 0 : [0.5, 1, 0.5] }} transition={filledCount >= 1 ? { duration: 0.4, ease: "easeOut" } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <p className="text-[11px] tracking-display uppercase text-fg">Scroll</p>
          <p className="text-[11px] tracking-display uppercase text-fg">The Dots</p>
          <ChevronDown size={13} className="text-fg mt-1" strokeWidth={1.25} />
        </motion.div>
      </section>
    </div>
  );
}
