"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Slide from "./Slide";
import { SlideIndicatorMobile, SlideIndicatorDesktop } from "./SlideIndicator";
import HeroOverlayText from "./HeroOverlayText";
import HeroLogo3D from "./HeroLogo3D";
import { useSlider } from "./hooks/useSlider";
import { useAutoSlide } from "./hooks/useAutoSlide";
import type { HeroSlide } from "./types";

interface HeroSectionClientProps {
  slides: HeroSlide[];
}

export default function HeroSectionClient({ slides }: HeroSectionClientProps) {
  const { current, slideWidth, containerRef, x, handleDragEnd, prev, next, nextLooping, goTo } = useSlider(slides.length);
  const [progressKey, setProgressKey] = useState(0);
  const bumpProgress = useCallback(() => setProgressKey((k) => k + 1), []);

  const mountedRef = useRef<Set<number>>(new Set([0]));
  const [, force] = useState(0);
  useEffect(() => {
    const before = mountedRef.current.size;
    [current - 1, current, current + 1].forEach((i) => {
      if (i >= 0 && i < slides.length) mountedRef.current.add(i);
    });
    if (mountedRef.current.size !== before) force((n) => n + 1);
  }, [current, slides.length]);

  const { reset } = useAutoSlide({ next: nextLooping });

  const handlePrev = useCallback(() => {
    reset();
    bumpProgress();
    prev();
  }, [reset, bumpProgress, prev]);

  const handleNext = useCallback(() => {
    reset();
    bumpProgress();
    next();
  }, [reset, bumpProgress, next]);

  const handleGoTo = useCallback(
    (index: number) => {
      reset();
      bumpProgress();
      goTo(index);
    },
    [reset, bumpProgress, goTo],
  );

  return (
    <section data-nav-theme="dark" className="relative w-full h-[85svh] md:h-[90vh] min-h-160 overflow-hidden select-none">
      {/* Filmstrip container */}
      <div ref={containerRef} className="w-full h-full">
        <motion.div
          className="flex h-full"
          style={{
            x,
            width: `${slides.length * 100}%`,
            cursor: "grab",
            willChange: "transform",
          }}
          drag="x"
          dragConstraints={{
            left: -(slides.length - 1) * slideWidth,
            right: 0,
          }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={(e, info) => {
            reset();
            bumpProgress();
            handleDragEnd(e, info);
          }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {slides.map((slide) => (
            <Slide key={slide.id} id={slide.id} bg={slide.bg} image={slide.image} video={slide.video} slideCount={slides.length} isActive={current === slide.id} isVisible={mountedRef.current.has(slide.id)} />
          ))}
        </motion.div>
      </div>

      <HeroLogo3D />

      <HeroOverlayText current={current} slides={slides} className="md:hidden absolute z-10 bottom-24 left-8 right-8" />
      <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none w-50">
        <Image src="/images/Logo/9t7.svg" alt="9TSEVEN" width={1200} height={1200} className="block p-6 w-full h-auto" style={{ width: "100%", height: "auto" }} priority />
      </div>

      <SlideIndicatorMobile current={current} slides={slides} onPrev={handlePrev} onNext={handleNext} onGoTo={handleGoTo} />

      <div className="hidden md:grid absolute bottom-12 left-8 right-8 z-10 grid-cols-2 items-end pointer-events-none">
        <HeroOverlayText current={current} slides={slides} className="pointer-events-auto" />
        <div className="w-25 md:hidden justify-self-center block">
          <Image src="/images/Logo/9t7.svg" alt="9TSEVEN" width={1200} height={1200} className="block w-full h-auto md:hidden" style={{ width: "100%", height: "auto" }} priority />
        </div>
        <SlideIndicatorDesktop current={current} slides={slides} onPrev={handlePrev} onNext={handleNext} onGoTo={handleGoTo} className="w-3/4 justify-self-end" progressKey={progressKey} />
      </div>
    </section>
  );
}
