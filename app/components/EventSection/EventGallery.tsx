import Image from "next/image";
import Link from "next/link";
import type { EventPost } from "../BlogSection/constants";
import Tagline from "../Tagline";

interface Props {
  events: EventPost[];
  title: string;
  subtitle: string;
  tagline: string;
}

export default function EventGallery({ events, title, subtitle, tagline }: Props) {
  return (
    <section data-nav-theme="light" className="px-6 md:px-20 py-22 relative bg-white">
      <div className="pb-5 flex flex-col gap-4 md:gap-0 md:flex-row items-start justify-between">
        <div className="block md:w-1/2">
          <Tagline>{tagline}</Tagline>
        </div>

        <div className="flex flex-col gap-1 mb-4 md:w-1/2">
          <h2 className="text-2xl font-bold text-ink">{title}</h2>
          <p className="text-xl text-ink">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-2 pb-12 md:h-[500px] overflow-x-auto">
        {events.map((event) => (
          <EventTile key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function EventTile({ event }: { event: EventPost }) {
  const tileClass = "relative group flex-grow transition-all md:w-56 rounded-lg overflow-hidden h-72 md:h-full duration-500 md:hover:w-100";

  const inner = (
    <>
      <Image src={event.image} alt={event.alt} fill className="object-cover object-center transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={85} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
        <h3 className="font-semibold text-lg tracking-tight text-white line-clamp-2">{event.title}</h3>
        {event.date && <span className="font-mono text-[10px] tracking-tight text-white/80">{event.date}</span>}
      </div>
    </>
  );

  if (event.slug) {
    return (
      <Link href={`/community/events/${event.slug}`} className={tileClass}>
        {inner}
      </Link>
    );
  }

  return <div className={tileClass}>{inner}</div>;
}
