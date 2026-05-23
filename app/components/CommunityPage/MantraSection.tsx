"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import Link from "next/link";
import CirclesAnimation from "../CirclesAnimation";
import Tagline from "../Tagline";

export default function MantraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.6, once: true });

  return (
    <section ref={sectionRef} data-nav-theme="dark" className="bg-bg">
      <div className="grid grid-cols-1 gap-10 px-6 py-20 sm:gap-12 sm:px-10 sm:py-24 md:px-20 md:py-32 lg:grid-cols-3 lg:gap-16">
        <div className="flex flex-col items-start gap-6 lg:col-span-2">
          <Tagline tone="fg-subtle">( OUR STORY )</Tagline>
          <h2 className="text-5xl font-bold leading-none tracking-tight text-fg md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.5rem]">
            Community.
            <br />
            Create a space for inspiration &amp; human connection.
          </h2>
          <Link href="/mantra" className="font-mono text-sm tracking-tight text-fg underline underline-offset-4 transition-opacity hover:opacity-50">
            READ OUR MANTRA
          </Link>
        </div>

        <div className="lg:flex lg:justify-end">
          <CirclesAnimation active={inView} theme="dark" />
        </div>
      </div>
    </section>
  );
}
