import type { Metadata } from "next";
import { Suspense } from "react";
import CategoryMarquee from "../components/CategoryMarquee";
import CategoryProducts from "../components/CategoryProducts";
import ProductsListingSkeleton from "../components/ProductsListingSkeleton";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ tag?: string }>;
}

function sanitizeTag(tag: string | undefined): string | undefined {
  if (!tag) return undefined;
  return /^[a-z0-9-]+$/.test(tag) ? tag : undefined;
}

function marqueeLabel(slug: string, tag: string | undefined): string {
  if (tag) return tag.toUpperCase().replace(/-/g, " ");
  return slug
    .split("-")
    .map((w) => w.toUpperCase())
    .join(" ");
}

function titleCaseLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const slug = category.toLowerCase();
  const label = titleCaseLabel(slug);
  const labelLower = label.toLowerCase();
  return {
    title: label,
    description: `Shop 9TSEVEN ${labelLower} — running ${labelLower} built for performance and the lifestyle around it.`,
    alternates: { canonical: `/products/${slug}` },
    openGraph: { url: `/products/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { tag: rawTag } = await searchParams;
  const tag = sanitizeTag(rawTag);
  const slug = category.toLowerCase();
  const label = marqueeLabel(slug, tag);

  return (
    <main data-nav-theme="light" className="bg-white min-h-screen pt-16">
      <CategoryMarquee text={label} />

      <div className="mx-auto">
        <Suspense key={`${slug}-${tag ?? ""}`} fallback={<ProductsListingSkeleton />}>
          <CategoryProducts slug={slug} tag={tag} />
        </Suspense>
      </div>
    </main>
  );
}
