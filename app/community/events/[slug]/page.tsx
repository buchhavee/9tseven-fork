import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getEvents } from "@/app/lib/eventPosts";
import { Suspense } from "react";
import Gallery from "./Gallery";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.filter((e): e is typeof e & { slug: string } => e.slug !== null).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.body,
    alternates: { canonical: `/community/events/${slug}` },
    openGraph: { url: `/community/events/${slug}` },
  };
}

export function Loader() {
  return (
    <div className="animate-pulse h-full w-full">
      <p className="place-self-center">Loading</p>
    </div>
  );
}

export default async function EventGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  console.log(event.date);

  return (
    <main data-nav-theme="light" className="bg-white pt-20 pb-12">
      <Suspense fallback={<Loader />}>
        <header className="px-6 md:px-8 py-5 flex flex-col gap-4 md:gap-0 md:grid md:grid-cols-2 items-start justify-between">
          <div className="flex flex-col gap-1 md:w-1/2 h-full">
            <Link href="/community" className="inline-flex justify-self-end self-start gap-2 bg-bg text-fg px-7 py-3 text-[0.65rem] tracking-label uppercase font-semibold hover:bg-bg/80 transition-colors duration-fast">
              <ArrowLeft size={12} strokeWidth={1.75} />
              Go Back
            </Link>
          </div>
          <div>
            {event.date && <p className="font-mono text-sm text-ink">{event.date}</p>}
            <h1 className="text-2xl font-bold text-ink pb-3">{event.title}</h1>
            <p className="text-xl text-ink whitespace-pre-wrap">{event.body}</p>
          </div>
        </header>

        <Gallery images={event.gallery} title={event.title} />
      </Suspense>
    </main>
  );
}
