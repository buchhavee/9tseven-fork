"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import UGCMiniProductCard from "./UGCMiniProductCard";
import type { UGCLookProductView } from "@/app/lib/ugcLooks";

interface UGCLookShopperProps {
  products: UGCLookProductView[];
}

export default function UGCLookShopper({ products }: UGCLookShopperProps) {
  const { addLines, openCart, pending } = useCart();
  const [sizes, setSizes] = useState<Record<string, string>>({});

  const selectSize = (handle: string, size: string) => setSizes((prev) => ({ ...prev, [handle]: size }));

  const variantFor = (product: UGCLookProductView) => {
    if (product.variants.length === 0) return null;
    if (product.sizes.length > 0) {
      const size = sizes[product.handle];
      if (!size) return null;
      return product.variants.find((v) => v.size === size) ?? null;
    }
    return product.variants.find((v) => v.availableForSale) ?? product.variants[0] ?? null;
  };

  const hasProducts = products.length > 0;
  const allSizesChosen = hasProducts && products.every((p) => p.sizes.length === 0 || Boolean(sizes[p.handle]));

  const handleAddLook = () => {
    if (!allSizesChosen) return;
    const merchandiseIds = products
      .map(variantFor)
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .map((v) => v.id);
    if (merchandiseIds.length === 0) return;
    addLines(merchandiseIds);
    openCart();
  };

  const label = pending ? "Adding…" : allSizesChosen ? "+ Add look to cart" : "Select all sizes to add look";

  return (
    <>
      <div className="grid grid-cols-2 gap-1 md:gap-4 sm:grid-cols-3">
        {products.map((product) => (
          <UGCMiniProductCard key={product.handle} product={product} selectedSize={sizes[product.handle] ?? null} onSelectSize={(size) => selectSize(product.handle, size)} />
        ))}
      </div>

      <button type="button" onClick={handleAddLook} disabled={pending || !allSizesChosen} className="inline-flex w-full items-center justify-center gap-2 bg-ink mx-1 px-6 py-4 font-mono text-[10px] tracking-eyebrow uppercase text-fg transition-colors duration-base hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40">
        {label}
      </button>
    </>
  );
}
