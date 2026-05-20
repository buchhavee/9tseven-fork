import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shopifyClient } from "@/app/lib/shopify";
import { GET_PRODUCT_BY_HANDLE } from "@/app/lib/queries/products";
import { toProduct, type StorefrontProduct } from "@/app/components/FeaturedProductsSection/types";
import ProductDetailView from "../../components/ProductDetailView";

const DESCRIPTION_MAX = 155;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 60 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[.,;:!?-]+$/, "")}…`;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { category, handle } = await params;

  const { data } = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, {
    variables: { handle },
  });
  const node = (data as { product: StorefrontProduct | null } | undefined)?.product;
  if (!node) return {};

  const product = toProduct(node);
  if (product.category.toLowerCase() !== category.toLowerCase()) return {};

  const rawDescription = product.descriptionHtml ? stripHtml(product.descriptionHtml) : "";
  const description = rawDescription
    ? truncate(rawDescription, DESCRIPTION_MAX)
    : `Shop ${product.name} — 9TSEVEN running apparel and gear.`;

  const canonical = `/products/${category}/${handle}`;
  const ogImage = node.featuredImage?.url;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: product.name,
      description,
      ...(ogImage
        ? { images: [{ url: ogImage, alt: node.featuredImage?.altText ?? product.name }] }
        : {}),
    },
    twitter: {
      title: product.name,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

interface ProductDetailPageProps {
  params: Promise<{ category: string; handle: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { category, handle } = await params;

  const { data, errors } = await shopifyClient.request(GET_PRODUCT_BY_HANDLE, {
    variables: { handle },
  });

  if (errors) {
    throw new Error(`Shopify GET_PRODUCT_BY_HANDLE failed: ${JSON.stringify(errors)}`);
  }

  const node = (data as { product: StorefrontProduct | null } | undefined)?.product;
  if (!node) notFound();

  const product = toProduct(node);

  if (product.category.toLowerCase() !== category.toLowerCase()) {
    notFound();
  }

  return (
    <main data-nav-theme="light" className="bg-white min-h-screen pt-16">
      <div className="px-4 mx-auto">
        <ProductDetailView product={product} />
      </div>
    </main>
  );
}
