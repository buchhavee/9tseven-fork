// app/components/BrandStatementSection/index.tsx
import Image from "next/image";
import Tagline from "../Tagline";

export default function BrandStatementSection() {
  return (
    <section className="flex flex-col items-center px-10 pt-6 md:pt-8 pb-12">
      {/* Brand line */}
      <Tagline tone="ink-subtle" className="block text-[10px] mb-6">
        9TSEVEN © 2026
      </Tagline>

      <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center w-full mb-5">
        <Image src="/images/Logo/Copenhagen.svg" alt="Copenhagen" width={175} height={54} className="h-6 md:h-9 w-auto opacity-70" />
        <Image src="/images/Logo/More Than Running.svg" alt="More Than Running" width={685} height={143} className="-order-1 md:order-0 h-20 md:h-30 w-auto opacity-70 px-0 md:px-8" />
        <Image src="/images/Logo/Denmark.svg" alt="Denmark" width={167} height={44} className="h-4 md:h-9 w-auto opacity-70 md:justify-self-end" />
      </div>
      <Image src="/images/Logo/9t7.svg" alt="9TSEVEN" width={80} height={80} className="w-20 h-auto invert" />
    </section>
  );
}
