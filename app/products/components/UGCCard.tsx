import Image from "next/image";
import Link from "next/link";
import type { UGCLook } from "@/app/lib/ugc-placeholder-data";

interface UGCCardProps {
  look: UGCLook;
}

export default function UGCCard({ look }: UGCCardProps) {
  return (
    <Link href={`/products/looks/${look.id}`} aria-label={`Shop ${look.person.name}'s look — ${look.person.tag}`} className="group relative block w-full overflow-hidden rounded-sm bg-light-grey" style={{ aspectRatio: "2 / 3" }}>
      <Image src={look.imageSrc} alt={`${look.person.name} — ${look.person.tag}`} fill className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]" sizes="(min-width: 1024px) 33vw, 50vw" quality={85} />

      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-bg/90 from-0% via-bg/40 via-20% to-transparent to-50%" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3.5 md:p-4">
        <span className="font-mono text-[10px] font-medium tracking-eyebrow uppercase text-fg-muted">Shop the look</span>
        <span className="text-base font-black uppercase leading-none tracking-tight text-fg">{look.person.name}</span>
        <span className="font-mono text-[10px] tracking-label lowercase text-fg-subtle">@{look.person.handle}</span>
        <div className="flex items-end justify-between gap-3">
          <span className="min-w-0 truncate font-mono text-[9px] tracking-label uppercase text-fg-subtle">{look.person.tag}</span>
          <span className="shrink-0 font-mono text-[9px] tracking-eyebrow uppercase text-fg transition-opacity duration-base group-hover:opacity-70">View full look →</span>
        </div>
      </div>
    </Link>
  );
}
