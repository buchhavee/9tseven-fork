"use client";

import { motion, AnimatePresence } from "motion/react";
import type { Product } from "../types";
import { SizeSelector, getAddToCartAriaLabel, stopMouseMove, stopPointerEvents, useProductCardPurchase } from "./ProductCardInfoShared";

const formatPrice = (value: number) => value.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type ProductCardInfoProps = { product: Product; alwaysVisible: true; hovered?: never; mobileLayout?: never; compactOverlay?: boolean } | { product: Product; alwaysVisible?: false; hovered: boolean; mobileLayout?: "overlay" | "stacked"; compactOverlay?: boolean };

const getOverlayPanelClassName = (compact: boolean) => `absolute ${compact ? "bottom-2 left-2 right-2" : "bottom-3.5 left-3.5 right-3.5"} px-3 py-3 bg-white/95 border-t border-ink/10 z-20`;

function InfoContent({ product }: { product: Product }) {
  const { selectedSize, soldOut, allSoldOut, canAddToCart, pending, needsSizeSelection, toggleSize, handleAddToCart } = useProductCardPurchase(product);
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <div className="flex flex-col gap-2" {...stopPointerEvents}>
      <div className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 items-start">
        <p className="text-[clamp(8px,0.6vw,10px)] tracking-eyebrow uppercase text-ink-subtle leading-none">{product.category}</p>
        {onSale ? <p className="text-right text-[clamp(8px,0.6vw,10px)] tracking-eyebrow uppercase line-through text-ink-faint leading-none">DKK {formatPrice(product.compareAtPrice!)}</p> : <span aria-hidden />}
        <p className="min-w-0 text-[clamp(10px,0.8vw,12px)] font-semibold tracking-widest uppercase text-ink line-clamp-2 leading-tight md:line-clamp-none md:truncate md:leading-none">{product.name}</p>
        <p className="text-right text-[clamp(10px,0.8vw,12px)] font-semibold tracking-widest uppercase text-ink leading-tight md:leading-none">DKK {formatPrice(product.price)}</p>
      </div>
      <div className="flex items-stretch justify-between gap-2">
        <SizeSelector sizes={product.sizes} soldOut={soldOut} selectedSize={selectedSize} onToggle={toggleSize} containerClassName="flex flex-nowrap justify-start gap-1 md:flex-wrap" getButtonClassName={({ out, selected }) => `text-[clamp(10px,0.8vw,12px)] tracking-label uppercase font-mono font-bold px-2 py-1.5 md:px-2.5 md:py-2 leading-none relative transition-colors duration-fast cursor-pointer ${out ? "text-ink-ghost bg-tint" : selected ? "bg-ink text-fg" : "text-ink-muted bg-tint hover:bg-tint-hover cursor-pointer"}`} />
        <button type="button" onClick={handleAddToCart} disabled={!canAddToCart} aria-label={getAddToCartAriaLabel(needsSizeSelection)} className={`shrink-0 flex items-center justify-center gap-1 px-3 py-1.5 md:py-2 ${allSoldOut ? "bg-tint text-ink-ghost" : "bg-ink text-fg hover:bg-bg/80 disabled:bg-bg/30"} transition-colors duration-base cursor-pointer disabled:cursor-default`}>
          {!allSoldOut && <span className="text-[clamp(12px,0.9vw,14px)] leading-none font-light -translate-y-px">+</span>}
          <span className="text-[clamp(10px,0.8vw,12px)] tracking-label uppercase font-medium leading-none">{pending ? "Adding…" : needsSizeSelection ? (allSoldOut ? "Sold out" : "Select size") : "Add to cart"}</span>
        </button>
      </div>
    </div>
  );
}

function StaticPanel({ product, compactOverlay }: { product: Product; compactOverlay: boolean }) {
  return (
    <div className={getOverlayPanelClassName(compactOverlay)} {...stopMouseMove}>
      <InfoContent product={product} />
    </div>
  );
}

function HoverPanel({ product, hovered, mobileLayout, compactOverlay }: { product: Product; hovered: boolean; mobileLayout: "overlay" | "stacked"; compactOverlay: boolean }) {
  const panelClass = getOverlayPanelClassName(compactOverlay);
  return (
    <>
      {mobileLayout === "overlay" && (
        <div className={`${panelClass} md:hidden`} {...stopMouseMove}>
          <InfoContent product={product} />
        </div>
      )}
      <AnimatePresence>
        {hovered && (
          <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18, ease: "easeOut" }} className={`${panelClass} hidden md:block`} {...stopMouseMove}>
            <InfoContent product={product} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ProductCardInfo(props: ProductCardInfoProps) {
  const compactOverlay = props.compactOverlay ?? false;
  if (props.alwaysVisible) {
    return <StaticPanel product={props.product} compactOverlay={compactOverlay} />;
  }
  return <HoverPanel product={props.product} hovered={props.hovered} mobileLayout={props.mobileLayout ?? "overlay"} compactOverlay={compactOverlay} />;
}
