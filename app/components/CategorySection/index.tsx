"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import Tagline from "../Tagline";
import { PANELS, type CategoryPanel } from "./constants";
import "./CategorySection.css";

function CategoryPanelView({ label, leftText, rightText, image, alt, href }: CategoryPanel) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const wrapper = wrapperRef.current;
    const cursorText = cursorTextRef.current;
    if (!wrapper || !cursorText) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hovering = false;
    let raf = 0;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      const h = wrapper!.getBoundingClientRect().height;
      const clamped = Math.max(24, Math.min(currentY, h - 24));
      cursorText!.style.top = `${clamped}px`;
      cursorText!.style.transform = "translateY(-50%)";
      wrapper!.style.setProperty("--cursor-x", `${currentX}px`);
      wrapper!.style.setProperty("--cursor-y", `${clamped}px`);
      if (hovering || Math.abs(currentY - targetY) > 0.5 || Math.abs(currentX - targetX) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function onMouseEnter(e: MouseEvent) {
      const rect = wrapper!.getBoundingClientRect();
      currentX = e.clientX - rect.left;
      currentY = e.clientY - rect.top;
      targetX = currentX;
      targetY = currentY;
      hovering = true;
      wrapper!.classList.add("is-hovered");
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = wrapper!.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    }

    function onMouseLeave() {
      hovering = false;
      wrapper!.classList.remove("is-hovered");
    }

    wrapper.addEventListener("mouseenter", onMouseEnter);
    wrapper.addEventListener("mousemove", onMouseMove);
    wrapper.addEventListener("mouseleave", onMouseLeave);

    return () => {
      wrapper.removeEventListener("mouseenter", onMouseEnter);
      wrapper.removeEventListener("mousemove", onMouseMove);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapperRef} data-nav-theme="dark" className="category-panel h-[60vh] md:h-full relative overflow-hidden">
      <div className="category-photo absolute inset-0">
        <Image src={image} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" quality={85} />
      </div>

      <div className="category-overlay absolute inset-0 z-2 pointer-events-none" />

      <div aria-hidden className="category-o-layer absolute inset-y-0 left-0 -right-2 z-2 pointer-events-none overflow-hidden select-none" />

      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-md tracking-display uppercase text-fg z-3 pointer-events-none whitespace-nowrap">{label}</span>

      <div ref={cursorTextRef} className="font-mono category-cursor-text absolute left-0 right-0 flex justify-between items-center px-4.5 pointer-events-none z-3" style={{ top: "24px" }}>
        <span className="text-[9px] tracking-display uppercase text-fg opacity-90">{leftText}</span>
        <span className="text-[9px] tracking-display uppercase text-fg opacity-90">{rightText}</span>
      </div>

      <Link href={href} className="absolute inset-0 z-4" aria-label={label} />
    </div>
  );
}

export default function CategorySection() {
  return (
    <section data-nav-theme="light" className="w-full bg-white pt-12 sm:pt-16 md:pt-20 select-none">
      <header className="flex items-end justify-between gap-4 md:gap-6 px-6 md:px-8 mb-10">
        <div className="flex flex-col gap-4 md:gap-6">
          <Tagline className="text-nowrap">( CATEGORIES )</Tagline>
          <h2 className="text-[28px] md:text-[32px] font-bold tracking-tight text-ink leading-none">SHOP BY CATEGORY</h2>
        </div>
        <Tagline href="/products" tone="ink" className="text-xs whitespace-nowrap">
          VIEW ALL&nbsp;&nbsp;→
        </Tagline>
      </header>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-2.5 md:h-[80vh]">
        {PANELS.map((panel) => (
          <CategoryPanelView key={panel.label} {...panel} />
        ))}
      </div>
    </section>
  );
}
