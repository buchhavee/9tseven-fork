import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MantraPage from "../components/MantraPage";
import ShapesMarquee from "../components/MantraPage/ShapesMarquee";
import ParticleField from "../components/CommunityPage/ParticleField";

export const metadata: Metadata = {
  title: "Mantra",
  description:
    "The mantra behind 9TSEVEN — the principles, people, and runs that shape the brand. More than running.",
  alternates: { canonical: "/mantra" },
  openGraph: { url: "/mantra" },
};

export default function Mantra() {
  return (
    <main>
      <MantraPage />
      <ShapesMarquee />
      <ParticleField />
      <section data-nav-theme="dark" className="bg-bg flex justify-center px-6 py-16 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 bg-fg text-bg px-7 py-3 text-[0.65rem] tracking-label uppercase font-semibold hover:bg-fg/80 transition-colors duration-fast">
          <ArrowLeft size={12} strokeWidth={1.75} />
          Back to home
        </Link>
      </section>
    </main>
  );
}
