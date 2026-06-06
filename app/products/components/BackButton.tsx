"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()} className={`px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-ink/20 text-[9px] tracking-eyebrow uppercase text-ink-subtle hover:text-ink transition-colors duration-base ${className ?? ""}`}>
      ← Back
    </button>
  );
}
