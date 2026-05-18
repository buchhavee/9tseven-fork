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
