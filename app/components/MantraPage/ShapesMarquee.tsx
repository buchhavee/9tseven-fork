import Image from "next/image";
import Tagline from "../Tagline";

const IMAGE_FILES = ["CONSTRUCTION01 2.webp", "CONSTRUCTION02 2.webp", "CONSTRUCTION03 2.webp", "CONSTRUCTION04 2.webp", "CONSTRUCTION05 2.webp", "CONSTRUCTION07 2.webp", "CONSTRUCTION08 2.webp", "CONSTRUCTION9 2.webp", "CONSTRUCTION10 2.webp", "POSRER02 2.webp", "POSRER03 2.webp", "POSRER04 2.webp", "POSRER05 2.webp", "POSRER06 2.webp"];

const IMAGES = IMAGE_FILES.map((file, i) => ({
  id: file,
  url: `/images/dot_construction/${encodeURI(file)}`,
  alt: `Dot construction study ${i + 1}`,
  width: 960,
  height: 1200,
}));

export default function ShapesMarquee() {
  return (
    <section data-nav-theme="dark" className="bg-bg">
      <div className="grid grid-cols-1 gap-10 px-6 py-20 md:grid-cols-2 md:grid-rows-1 md:gap-16 md:px-20 md:py-32">
        <div className="md:order-2 md:col-span-1">
          <h2 className="text-3xl font-extrabold uppercase leading-[1.05] -tracking-wide text-fg sm:text-4xl md:text-5xl lg:text-6xl">Shapes of community</h2>
        </div>

        <div className="-order-1">
          <Tagline bracketed tone="fg-muted" className="text-nowrap">
            The Dots
          </Tagline>
        </div>
      </div>

      <div
        className="marquee-container relative block overflow-hidden pb-20 md:pb-32"
        style={{
          maskImage: "linear-gradient(to right, transparent 0, black 160px, black calc(100% - 160px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, black 160px, black calc(100% - 160px), transparent 100%)",
        }}
      >
        <div className="marquee-track flex w-max gap-1 md:gap-2.5">
          {[...IMAGES, ...IMAGES].map((img, i) => (
            <div key={`${img.id}-${i}`} className="relative aspect-4/5 h-72 shrink-0 overflow-hidden rounded-sm md:h-96" aria-hidden={i >= IMAGES.length ? true : undefined}>
              <Image src={img.url} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 768px) 230px, 308px" quality={85} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
