"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";

interface GalleryImage {
  url: string;
  alt: string | null;
}

interface Props {
  images: GalleryImage[];
  title: string;
}

export default function Gallery({ images, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);
  const prev = useCallback(() => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (openIndex === null) return;

    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [openIndex, lenis, close, next, prev]);

  if (images.length === 0) {
    return <p className="px-6 md:px-8 py-12 text-ink">No photos yet.</p>;
  }

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div data-nav-theme="dark" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-6 md:px-8 mt-6">
        {images.map((img, i) => (
          <button key={`${img.url}-${i}`} type="button" onClick={() => setOpenIndex(i)} aria-label={`Open photo ${i + 1} of ${images.length}`} className="relative aspect-[4/3] cursor-pointer overflow-hidden">
            <Image src={img.url} alt={img.alt ?? title} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={85} />
          </button>
        ))}
      </div>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.alt ?? title} onClick={close} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8">
          <button type="button" onClick={(e) => { e.stopPropagation(); close(); }} aria-label="Close" className="absolute top-4 right-4 z-10 text-white text-3xl leading-none font-mono cursor-pointer hover:opacity-70">
            ×
          </button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white text-5xl leading-none font-mono cursor-pointer hover:opacity-70">
                ‹
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white text-5xl leading-none font-mono cursor-pointer hover:opacity-70">
                ›
              </button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()} className="relative w-full h-full max-w-7xl">
            <Image src={current.url} alt={current.alt ?? title} fill className="object-contain" sizes="100vw" quality={90} priority />
          </div>
        </div>
      )}
    </>
  );
}
