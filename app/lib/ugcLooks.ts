// app/lib/ugcLooks.ts
//
// Datakilde til "Shop the Look"-funktionen. Look-data (person, quote og
// UGC-billede) hentes fra placeholder-filen, mens produkter hentes med
// live data fra Storefront API via product handle.
//
// Når UGC metaobjects er oprettet i Shopify, er det kun `getUGCLooks`
// der skal opdateres — komponenter og typer forbliver uændrede.

import { shopifyClient } from "./shopify";
import { GET_PRODUCTS } from "./queries/products";
import { toProduct, type Product, type StorefrontProduct } from "@/app/components/FeaturedProductsSection/types";
import { ugcLooks, type UGCLook } from "./ugc-placeholder-data";

export interface UGCLookProductView {
  handle: string;
  title: string;
  category: string;
  price: string;
  imageSrc: string;
  /** PDP link for the product. */
  href: string;
  sizes: string[];
  soldOutSizes: string[];
  variants: { id: string; size: string | null; availableForSale: boolean }[];
}

export interface UGCLookView {
  id: string;
  slug: string;
  person: UGCLook["person"];
  quote: string;
  imageSrc: string;
  products: UGCLookProductView[];
}

function formatPrice(amount: number): string {
  return `DKK ${amount.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function productHref(category: string, handle: string): string {
  return `/products/${category.toLowerCase()}/${handle}`;
}

export async function getUGCLooks(): Promise<UGCLook[]> {
  return ugcLooks;
}

export function getUGCLookSlugs(): string[] {
  return ugcLooks.map((look) => look.id);
}

function toProductView(live: Product): UGCLookProductView {
  return {
    handle: live.handle,
    title: live.name,
    category: live.category,
    price: formatPrice(live.price),
    imageSrc: live.images[0] ?? "",
    href: productHref(live.category, live.handle),
    sizes: live.sizes,
    soldOutSizes: live.soldOutSizes,
    variants: live.variants,
  };
}

export async function getUGCLookView(slug: string): Promise<{ look: UGCLookView; otherLooks: UGCLook[] } | null> {
  const look = ugcLooks.find((l) => l.id === slug);
  if (!look) return null;

  const { data, errors } = await shopifyClient.request(GET_PRODUCTS, {
    variables: { first: 100 },
  });
  if (errors) {
    throw new Error(`Shopify GET_PRODUCTS failed: ${JSON.stringify(errors)}`);
  }
  const edges = (data as { products: { edges: { node: StorefrontProduct }[] } } | undefined)?.products.edges ?? [];
  const byHandle = new Map(edges.map((edge) => [edge.node.handle, toProduct(edge.node)] as const));

  const products = look.products
    .map((p) => byHandle.get(p.handle))
    .filter((live): live is Product => live !== undefined)
    .map(toProductView);

  const lookView: UGCLookView = {
    id: look.id,
    slug: look.id,
    person: look.person,
    quote: look.quote,
    imageSrc: look.imageSrc,
    products,
  };

  const otherLooks = ugcLooks.filter((l) => l.id !== slug);

  return { look: lookView, otherLooks };
}
