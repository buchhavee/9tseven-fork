import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Tagline from "@/app/components/Tagline";
import InstagramMarquee from "@/app/components/InstagramMarquee";
import UGCCard from "@/app/products/components/UGCCard";
import UGCLookShopper from "@/app/products/components/UGCLookShopper";
import { getUGCLookSlugs, getUGCLookView, type UGCLookProductView } from "@/app/lib/ugcLooks";

const INSTAGRAM_URL = "https://www.instagram.com/9tseven_/";

interface ShopTheLookPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getUGCLookSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ShopTheLookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getUGCLookView(slug);
  if (!result) return {};
  const { look } = result;
  const canonical = `/products/looks/${slug}`;
  return {
    title: `Shop the Look — ${look.person.name}`,
    description: `${look.person.name}'s outfit, worn on the run and ready to shop. ${look.quote}`,
    alternates: { canonical },
    openGraph: { url: canonical },
  };
}

function firstName(name: string): string {
  return name.split(/[\s.]+/).filter(Boolean)[0] ?? name;
}

function joinTitles(products: UGCLookProductView[]): string {
  const titles = products.map((p) => p.title);
  if (titles.length <= 1) return titles.join("");
  return `${titles.slice(0, -1).join(", ")} and ${titles[titles.length - 1]}`;
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function ShopTheLookPage({ params }: ShopTheLookPageProps) {
  const { slug } = await params;
  const result = await getUGCLookView(slug);
  if (!result) notFound();

  const { look, otherLooks } = result;
  const name = firstName(look.person.name);

  return (
    <main data-nav-theme="light" className="min-h-screen bg-white pt-16">
      <section className="flex flex-col lg:flex-row">
        {/* Image side */}
        <div className="relative aspect-4/5 w-full bg-light-grey sm:aspect-3/2 lg:aspect-auto lg:min-h-[88vh] lg:w-[52%]">
          <Image src={look.imageSrc} alt={`${look.person.name} — ${look.person.tag}`} fill className="object-cover" sizes="(min-width: 1024px) 52vw, 100vw" quality={85} priority />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-bg/90 from-0% via-bg/40 via-20% to-transparent to-50%" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 md:p-12">
            <Tagline bracketed tone="fg-subtle">
              Community Member
            </Tagline>
            <p className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-fg md:text-5xl">{look.person.name}</p>
            <a href={`https://www.instagram.com/${look.person.handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-mono text-[12px] tracking-label lowercase text-fg-subtle hover:text-fg transition-colors duration-base">
              <InstagramGlyph className="h-4 w-4" />@{look.person.handle}
            </a>
            <p className="font-mono text-[11px] tracking-label uppercase text-fg-muted">{look.person.tag}</p>
          </div>
        </div>

        {/* Products side */}
        <div className="flex w-full flex-col justify-center gap-8 px-6 py-12 md:px-12 md:py-16 lg:w-[48%] lg:px-14">
          <div className="flex flex-col gap-4">
            <Tagline bracketed tone="ink-subtle">
              Shop the Look
            </Tagline>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-ink md:text-5xl">{name}&rsquo;s outfit.</h1>
            <p className="max-w-md text-sm text-ink-subtle">
              Worn on the run, ready to shop. {name} is wearing the {joinTitles(look.products)}.
            </p>
          </div>

          <UGCLookShopper products={look.products} />
        </div>
      </section>

      {/* Other looks from the community */}
      {otherLooks.length > 0 && (
        <section className="px-6 py-16 md:px-10 md:py-20 lg:px-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <Tagline bracketed tone="ink-subtle">
              More than running
            </Tagline>
            <h2 className="max-w-2xl text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink md:text-5xl">Other looks from the Community</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherLooks.map((other) => (
              <UGCCard key={other.id} look={other} />
            ))}
          </div>
        </section>
      )}

      {/* IG CTA */}
      <section className="flex flex-col items-center gap-6 px-6 py-16 text-center md:px-10 md:py-12 lg:px-20">
        <Tagline bracketed tone="ink-subtle">
          More than running
        </Tagline>
        <h2 className="max-w-3xl text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink md:text-5xl lg:text-6xl">Share your look. Become part of the story.</h2>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-ink/20 px-6 py-3.5 font-mono text-[10px] tracking-eyebrow uppercase text-ink transition-colors duration-base hover:bg-ink hover:text-fg">
          <InstagramGlyph className="h-4 w-4" />
          Tag us on Instagram →
        </a>
      </section>

      <InstagramMarquee theme="light" />
    </main>
  );
}
