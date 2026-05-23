"use client";

import { useState, useCallback, useRef } from "react";
import { useLenis } from "lenis/react";
import type { BlogPost, EventPost } from "./constants";
import BlogPostCard from "./BlogPostCard";
import Tagline from "../Tagline";

const NAVBAR_H = 60;

interface Props {
  posts: (BlogPost | EventPost)[];
  source?: "blog" | "events";
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export default function BlogStack({ posts, source = "blog", title = "Journal", subtitle = "Recent work, moments, and ongoing process.", tagline = "( BLOG POSTS )" }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const lenis = useLenis();

  const [peekHeights, setPeekHeights] = useState<number[]>(() => new Array(posts.length).fill(72));

  const updatePeek = useCallback((index: number, height: number) => {
    setPeekHeights((prev) => {
      if (prev[index] === height) return prev;
      const next = [...prev];
      next[index] = height;
      return next;
    });
  }, []);

  const tops = posts.map((_, i) => NAVBAR_H + peekHeights.slice(0, i).reduce((a, b) => a + b, 0));

  const handleCardClick = (index: number) => {
    if (!sectionRef.current || !headerRef.current) return;

    const scroll = lenis?.scroll ?? window.scrollY;
    const sectionDocTop = sectionRef.current.getBoundingClientRect().top + scroll;
    const headerH = headerRef.current.offsetHeight;

    let sumPrevCardHeights = 0;
    for (let i = 0; i < index; i++) {
      sumPrevCardHeights += cardRefs.current[i]?.offsetHeight ?? 0;
    }

    const naturalCardTop = sectionDocTop + headerH + sumPrevCardHeights;
    const targetScroll = naturalCardTop - tops[index];

    lenis?.scrollTo(targetScroll, { duration: 1.2 });
  };

  return (
    <section ref={sectionRef} data-nav-theme="light" className="relative bg-white py-12 sm:py-14 md:py-16">
      <div ref={headerRef} className="px-6 md:px-8 py-5 flex flex-col gap-4 md:gap-0 md:flex-row items-start justify-between">
        <div className="block md:w-1/2">
          <Tagline>{tagline}</Tagline>
        </div>

        <div className="flex flex-col gap-1 mb-4 md:w-1/2">
          <h2 className="text-2xl font-bold text-ink">{title}</h2>
          <p className="text-xl text-ink">{subtitle}</p>
        </div>
      </div>

      {posts.map((post, index) => (
        <BlogPostCard
          key={post.id}
          post={post}
          source={source}
          index={index}
          top={tops[index]}
          onPeekHeight={(h) => updatePeek(index, h)}
          articleRef={(el) => {
            cardRefs.current[index] = el;
          }}
          onClick={source === "blog" ? () => handleCardClick(index) : undefined}
        />
      ))}
    </section>
  );
}
