import Image from "next/image";
import Link from "next/link";
import type { UGCLook } from "@/app/lib/ugc-placeholder-data";

interface UGCCardProps {
  look: UGCLook;
}

export default function UGCCard({ look }: UGCCardProps) {
  return (
    <Link href={`/products/looks/${look.id}`} aria-label={`Shop ${look.person.name}'s look — ${look.person.tag}`} className="group flex h-full w-full flex-col">
      <div className="relative w-full overflow-hidden rounded-sm bg-light-grey" style={{ aspectRatio: "2 / 3" }}>
        <Image src={look.imageSrc} alt={`${look.person.name} — ${look.person.tag}`} fill className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]" sizes="(min-width: 1024px) 33vw, 50vw" quality={85} />

        <div aria-hidden className="hidden md:block absolute inset-0 bg-linear-to-t from-bg/90 from-0% via-bg/40 via-20% to-transparent to-50%" />

        <div className="hidden md:flex absolute inset-x-0 bottom-0 flex-col gap-2 p-4">
          <span className="font-mono text-[10px] font-medium tracking-eyebrow uppercase text-fg-muted">Shop the look</span>
          <span className="text-base font-black uppercase leading-none tracking-tight text-fg">{look.person.name}</span>
          <span className="font-mono text-[10px] tracking-label lowercase text-fg-subtle">@{look.person.handle}</span>
          <div className="flex items-end justify-between gap-3">
            <span className="min-w-0 truncate font-mono text-[9px] tracking-label uppercase text-fg-subtle">{look.person.tag}</span>
            <span className="shrink-0 font-mono text-[9px] tracking-eyebrow uppercase text-fg transition-opacity duration-base group-hover:opacity-70">View full look →</span>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-1 flex-col px-0.5 pt-3 pb-1">
        <p className="text-[clamp(8px,2vw,9px)] tracking-eyebrow uppercase text-ink-subtle">Shop the look</p>
        <p className="text-[clamp(11px,2.6vw,12px)] font-semibold tracking-widest uppercase text-ink leading-tight mt-1 line-clamp-2">{look.person.name}</p>
        <p className="text-[clamp(11px,2.8vw,13px)] font-medium text-ink-muted lowercase mt-1.5">@{look.person.handle}</p>
        <p className="text-[clamp(8px,2vw,9px)] tracking-label uppercase text-ink-faint truncate mt-1.5">{look.person.tag}</p>
        <span className="mt-auto flex h-9 items-center justify-center gap-2 border border-ink/15 text-ink group-hover:bg-tint transition-colors duration-base text-[9px] tracking-eyebrow uppercase font-medium">
          View full look →
        </span>
      </div>
    </Link>
  );
}
