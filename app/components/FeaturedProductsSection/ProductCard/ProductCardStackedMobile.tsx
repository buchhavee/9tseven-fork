"use client";

import type { Product } from "../types";
import { SizeSelector, getAddToCartAriaLabel, stopPointerEvents, useProductCardPurchase } from "./ProductCardInfoShared";

const formatPrice = (value: number) => value.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ProductCardStackedMobile({ product }: { product: Product }) {
  const { selectedSize, soldOut, allSoldOut, canAddToCart, pending, needsSizeSelection, toggleSize, handleAddToCart } = useProductCardPurchase(product);
  const sizeColumns = Math.max(1, Math.min(product.sizes.length, 5));
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <div className="md:hidden">
      <div className="flex flex-col px-0.5 pt-3 pb-1" {...stopPointerEvents}>
        <p className="text-[clamp(8px,2vw,9px)] tracking-eyebrow uppercase text-ink-subtle">{product.category}</p>
        <p className="text-[clamp(11px,2.6vw,12px)] font-semibold tracking-widest uppercase text-ink leading-tight mt-1 line-clamp-2 min-h-[2lh]">{product.name}</p>
        <div className="flex items-baseline gap-2 mt-1.5 text-[clamp(11px,2.8vw,13px)] font-medium text-ink-muted">
          <span>DKK {formatPrice(product.price)}</span>
          {onSale && <span className="text-[clamp(10px,2.4vw,12px)] font-normal line-through text-ink-faint">DKK {formatPrice(product.compareAtPrice!)}</span>}
        </div>
        {product.sizes.length > 0 && <SizeSelector sizes={product.sizes} soldOut={soldOut} selectedSize={selectedSize} onToggle={toggleSize} containerClassName="grid gap-0.5 my-2" style={{ gridTemplateColumns: `repeat(${sizeColumns}, minmax(0, 1fr))` }} getButtonClassName={({ out, selected }) => `text-[9px] tracking-label uppercase font-mono font-bold py-1.5 leading-none relative transition-colors duration-fast ${out ? "text-ink-ghost bg-tint" : selected ? "bg-ink text-fg" : "text-ink-muted bg-tint hover:bg-tint-hover"}`} />}
        <button type="button" onClick={handleAddToCart} disabled={!canAddToCart} aria-label={getAddToCartAriaLabel(needsSizeSelection)} className={`w-full flex items-center justify-center gap-2 h-9  ${allSoldOut ? "bg-tint text-ink-ghost" : "bg-ink disabled:bg-bg/30 disabled:text-fg-muted"} text-fg hover:bg-bg/80 transition-colors duration-base `}>
          {!allSoldOut && <span className="text-[15px] leading-none font-light">+</span>}
          <span className="text-[9px] tracking-eyebrow uppercase font-medium leading-none">{pending ? "Adding…" : needsSizeSelection ? (!allSoldOut ? "Select size" : "Sold out") : "Add to cart"}</span>
        </button>
      </div>
    </div>
  );
}
