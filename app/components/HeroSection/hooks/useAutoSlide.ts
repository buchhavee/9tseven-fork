"use client";

import { useEffect, useRef, useCallback } from "react";

export const AUTO_SLIDE_INTERVAL_MS = 10000;

interface UseAutoSlideOptions {
  next: () => void;
  intervalMs?: number;
}

export function useAutoSlide({ next, intervalMs = AUTO_SLIDE_INTERVAL_MS }: UseAutoSlideOptions) {
  const nextRef = useRef(next);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    intervalRef.current = setInterval(() => {
      nextRef.current();
    }, intervalMs);
  }, [clear, intervalMs]);

  const reset = useCallback(() => {
    start();
  }, [start]);

  useEffect(() => {
    start();
    return clear;
  }, [start, clear]);

  return { reset };
}
