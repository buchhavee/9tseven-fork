"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import type { UGCLookProductView } from "@/app/lib/ugcLooks";

interface UGCMiniProductCardProps {
  product: UGCLookProductView;
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

export default function UGCMiniProductCard({ product, selectedSize, onSelectSize }: UGCMiniProductCardProps) {
  const { addLine, addLineByHandle, openCart, pending } = useCart();
  const hasSizes = product.sizes.length > 0;
  const soldOut = new Set(product.soldOutSizes);

  const selectedVariant = hasSizes ? (product.variants.find((v) => v.size === selectedSize) ?? null) : (product.variants.find((v) => v.availableForSale) ?? product.variants[0] ?? null);

  const needsSize = hasSizes && !selectedSize;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsSize) return;
    if (selectedVariant) addLine(selectedVariant.id, 1);
    else addLineByHandle(product.handle, 1);
    openCart();
  };

  const selectSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectSize(size);
  };

  return (
    <Link href={product.href} className="group flex flex-col">
      <div className="relative w-full overflow-hidden rounded-sm bg-light-grey" style={{ aspectRatio: "1 / 1" }}>
        <Image src={product.imageSrc} alt={product.title} fill className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.04]" sizes="(min-width: 1024px) 16vw, 40vw" quality={85} />
      </div>

      <div className="flex flex-col gap-1 pt-2.5">
        <span className="font-mono text-[9px] tracking-eyebrow uppercase text-ink-faint">{product.category}</span>
        <span className="text-[11px] font-semibold uppercase leading-tight tracking-tight text-ink">{product.title}</span>
        <span className="text-[11px] text-ink-subtle">{product.price}</span>

        {hasSizes && (
          <div className="flex flex-wrap gap-1 pt-1.5">
            {product.sizes.map((size) => {
              const out = soldOut.has(size);
              const selected = selectedSize === size;
              return (
                <button key={size} type="button" disabled={out} onClick={(e) => selectSize(e, size)} className={`px-1.5 py-0.5 font-mono text-[8px] tracking-eyebrow uppercase border transition-colors duration-fast ${out ? "border-ink/10 text-ink-faint line-through cursor-not-allowed" : selected ? "border-ink bg-ink text-fg" : "border-ink/20 text-ink-subtle hover:border-ink hover:text-ink"}`}>
                  {size}
                </button>
              );
            })}
          </div>
        )}

        <button type="button" onClick={handleAdd} disabled={pending || needsSize} className="mt-2 inline-flex items-center gap-1 self-start border border-ink/20 px-2.5 py-1.5 font-mono text-[9px] tracking-eyebrow uppercase text-ink transition-colors duration-base hover:border-ink hover:bg-ink hover:text-fg disabled:cursor-not-allowed disabled:opacity-50">
          {pending ? "Adding…" : needsSize ? "Select size" : "+ Add to cart"}
        </button>
      </div>
    </Link>
  );
}
