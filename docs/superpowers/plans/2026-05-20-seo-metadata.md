# Per-page SEO Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every page on 9tseven.com unique, keyword-targeted SEO metadata (title, description, Open Graph, Twitter card) inherited from a shared root layout, plus dynamic metadata for category and product routes.

**Architecture:** The root `app/layout.tsx` defines `metadataBase`, a `"%s — 9TSEVEN"` title template, and default OG/Twitter cards. Each page either exports a static `metadata` object (mantra, products, community) or a `generateMetadata` function (category, product). The home and policies pages need no per-page export beyond what already exists (policies needs a small fix to avoid double-branding).

**Tech Stack:** Next.js App Router metadata API (`Metadata` / `generateMetadata`), Shopify Storefront API for product data.

**Spec:** [docs/superpowers/specs/2026-05-20-seo-metadata-design.md](../specs/2026-05-20-seo-metadata-design.md)

**Note on tests:** This project has no test infrastructure. Verification is via `pnpm build` (type-check) and viewing page source in `pnpm dev`. Each task ends with a manual verification step where applicable, plus a commit.

---

## File overview

| File | Action | Responsibility |
|---|---|---|
| `app/layout.tsx` | Modify | Root metadata: `metadataBase`, title template, default description, OG/Twitter defaults, robots. |
| `app/mantra/page.tsx` | Modify | Static `metadata` export. |
| `app/products/page.tsx` | Modify | Static `metadata` export. |
| `app/community/page.tsx` | Modify | Static `metadata` export. |
| `app/products/[category]/page.tsx` | Modify | `generateMetadata` with dynamic category title/description + canonical. |
| `app/products/[category]/[handle]/page.tsx` | Modify | `generateMetadata` using Shopify product data + product image as OG. |
| `app/(policies)/[slug]/page.tsx` | Modify | Return bare title so root template doesn't double-brand. |
| `app/page.tsx` | No change | Inherits root `default` title and root description. |

---

## Task 1: Root layout metadata

**Files:**
- Modify: `app/layout.tsx:38-41`

- [ ] **Step 1: Replace the `metadata` export**

In `app/layout.tsx`, replace the existing `metadata` block (currently lines 38–41) with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://9tseven.com"),
  title: {
    default: "9TSEVEN — More than running",
    template: "%s — 9TSEVEN",
  },
  description:
    "9TSEVEN is a running brand and community. Technical running apparel and accessories for runners who live the lifestyle.",
  applicationName: "9TSEVEN",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "9TSEVEN",
    locale: "en_US",
    url: "https://9tseven.com",
    title: "9TSEVEN — More than running",
    description:
      "Running apparel and community for runners who live the lifestyle.",
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "9TSEVEN" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "9TSEVEN — More than running",
    description:
      "Running apparel and community for runners who live the lifestyle.",
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};
```

`Metadata` is already imported on line 1; no new imports needed.

- [ ] **Step 2: Type-check**

Run: `pnpm build`
Expected: build completes without type errors. (If you want a faster check, `pnpm exec tsc --noEmit` is equivalent for typing.)

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(seo): expand root metadata with title template, OG, Twitter"
```

---

## Task 2: Mantra page metadata

**Files:**
- Modify: `app/mantra/page.tsx`

- [ ] **Step 1: Add the `metadata` export**

At the top of `app/mantra/page.tsx`, add the import and export. The full top of the file should read:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mantra",
  description:
    "The mantra behind 9TSEVEN — the principles, people, and runs that shape the brand. More than running.",
  alternates: { canonical: "/mantra" },
  openGraph: { url: "/mantra" },
};
```

Leave the existing `export default function Mantra()` and its imports alone.

- [ ] **Step 2: Verify in dev**

Run `pnpm dev`, open `http://localhost:3000/mantra`, View Source. Expected `<head>` includes:
- `<title>Mantra — 9TSEVEN</title>`
- `<meta name="description" content="The mantra behind 9TSEVEN ...">`
- `<link rel="canonical" href="https://9tseven.com/mantra"/>`
- `<meta property="og:url" content="https://9tseven.com/mantra"/>`

(Stop dev server when done.)

- [ ] **Step 3: Commit**

```bash
git add app/mantra/page.tsx
git commit -m "feat(seo): add metadata to /mantra"
```

---

## Task 3: Products listing page metadata

**Files:**
- Modify: `app/products/page.tsx`

- [ ] **Step 1: Add the `metadata` export**

At the top of `app/products/page.tsx`, add the import and export:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop 9TSEVEN running apparel, accessories and lifestyle pieces. Technical gear designed for runners, built for everyday wear.",
  alternates: { canonical: "/products" },
  openGraph: { url: "/products" },
};
```

Leave the existing default export and imports alone.

- [ ] **Step 2: Verify in dev**

Run `pnpm dev`, open `http://localhost:3000/products`, View Source. Expected `<title>Shop — 9TSEVEN</title>` and canonical `/products`.

- [ ] **Step 3: Commit**

```bash
git add app/products/page.tsx
git commit -m "feat(seo): add metadata to /products"
```

---

## Task 4: Community page metadata

**Files:**
- Modify: `app/community/page.tsx`

- [ ] **Step 1: Add the `metadata` export**

At the top of `app/community/page.tsx`, add:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Run with us. Events, group runs, and stories from the 9TSEVEN community.",
  alternates: { canonical: "/community" },
  openGraph: { url: "/community" },
};
```

- [ ] **Step 2: Verify in dev**

Run `pnpm dev`, open `http://localhost:3000/community`. Expected `<title>Community — 9TSEVEN</title>`.

- [ ] **Step 3: Commit**

```bash
git add app/community/page.tsx
git commit -m "feat(seo): add metadata to /community"
```

---

## Task 5: Category page `generateMetadata`

**Files:**
- Modify: `app/products/[category]/page.tsx`

- [ ] **Step 1: Add `generateMetadata` and a title-case helper**

In `app/products/[category]/page.tsx`, add `Metadata` to the `next` import and add a small title-case helper plus the `generateMetadata` function. The relevant additions:

At the top of the file (after existing imports), add:

```ts
import type { Metadata } from "next";
```

Below the existing `marqueeLabel` function, add:

```ts
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
```

Note: the canonical does not include the `tag` search param — tag-filtered views should not compete with the canonical category in search.

- [ ] **Step 2: Type-check**

Run: `pnpm build`
Expected: build completes; no type errors.

- [ ] **Step 3: Verify in dev**

Run `pnpm dev`, open a real category URL such as `http://localhost:3000/products/tops` (use any category that actually exists in the catalog — try `tops`, `shorts`, `accessories`, or whatever you see in the nav). View source. Expected:
- `<title>Tops — 9TSEVEN</title>` (with the category title-cased)
- `<link rel="canonical" href="https://9tseven.com/products/tops"/>`

- [ ] **Step 4: Commit**

```bash
git add app/products/[category]/page.tsx
git commit -m "feat(seo): add generateMetadata to category pages"
```

---

## Task 6: Product detail page `generateMetadata`

**Files:**
- Modify: `app/products/[category]/[handle]/page.tsx`

- [ ] **Step 1: Add `generateMetadata` plus description-truncation helpers**

In `app/products/[category]/[handle]/page.tsx`, add `Metadata` to imports and add two small helpers plus `generateMetadata`.

Imports — add:

```ts
import type { Metadata } from "next";
```

Below the existing imports (above the `interface ProductDetailPageProps` line), add:

```ts
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
    : `Shop ${product.title} — 9TSEVEN running apparel and gear.`;

  const canonical = `/products/${category}/${handle}`;
  const ogImage = node.featuredImage?.url;

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: product.title,
      description,
      ...(ogImage
        ? { images: [{ url: ogImage, alt: node.featuredImage?.altText ?? product.title }] }
        : {}),
    },
    twitter: {
      title: product.title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
```

Notes:
- The shared Shopify request is fine: Next dedupes identical fetches within the same render pass, so this is not a second round-trip.
- The default page export already handles the `notFound()` / category-mismatch cases; here we just return `{}` so the head stays empty (the request will 404 anyway).
- The page sources `descriptionHtml` via the existing `toProduct` mapper; the field is preserved on the returned object as `descriptionHtml` (confirmed in `app/components/FeaturedProductsSection/types.ts:110`).

- [ ] **Step 2: Type-check**

Run: `pnpm build`
Expected: build completes; no type errors.

- [ ] **Step 3: Verify in dev**

Run `pnpm dev`, open a real product URL (find one by clicking through from a category page). View source. Expected:
- `<title>{Product Title} — 9TSEVEN</title>`
- `<meta name="description"` with ≤ ~158 chars (155 + ellipsis).
- `<meta property="og:image"` pointing to the Shopify CDN image URL.
- Canonical points to `/products/{category}/{handle}`.

Then visit an invalid handle (e.g. `/products/tops/does-not-exist`). Expected: page 404s; head metadata is empty/inherits root defaults — no crash.

- [ ] **Step 4: Commit**

```bash
git add app/products/[category]/[handle]/page.tsx
git commit -m "feat(seo): add generateMetadata to product detail pages"
```

---

## Task 7: Fix policies page double-brand

**Files:**
- Modify: `app/(policies)/[slug]/page.tsx:19`

- [ ] **Step 1: Return the bare title**

In `app/(policies)/[slug]/page.tsx`, change line 19 from:

```ts
  return { title: `${policies[slug].title} – 9TSEVEN` };
```

to:

```ts
  return {
    title: policies[slug].title,
    alternates: { canonical: `/${slug}` },
    openGraph: { url: `/${slug}` },
  };
```

The root template `"%s — 9TSEVEN"` will now produce e.g. `Privacy Policy — 9TSEVEN` instead of the previous `Privacy Policy – 9TSEVEN — 9TSEVEN`.

- [ ] **Step 2: Verify in dev**

Run `pnpm dev`, open one policy URL (whichever slug exists, e.g. `http://localhost:3000/privacy-policy`). Expected title: `{Policy Title} — 9TSEVEN` (single em-dash, no double brand).

- [ ] **Step 3: Commit**

```bash
git add 'app/(policies)/[slug]/page.tsx'
git commit -m "fix(seo): stop double-branding policy page titles"
```

---

## Task 8: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full build**

Run: `pnpm build`
Expected: completes successfully with no type errors and no warnings about invalid metadata.

- [ ] **Step 2: Source-check every route**

Run `pnpm dev` and view source for each of these URLs. For each, confirm `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:title">`, `<meta property="og:url">`, `<meta property="og:image">`, and `<meta name="twitter:card">` are all present and correct.

- `http://localhost:3000/` — title: `9TSEVEN — More than running`. canonical: `/`. og:image: `/og.jpg`.
- `http://localhost:3000/mantra`
- `http://localhost:3000/products`
- `http://localhost:3000/community`
- `http://localhost:3000/products/{some category}` — title: `{Category} — 9TSEVEN`.
- `http://localhost:3000/products/{category}/{handle}` — title: `{Product} — 9TSEVEN`, og:image is a Shopify CDN URL.
- `http://localhost:3000/{some policy slug}` — single em-dash brand, no double.

If anything is missing or wrong, fix the corresponding task's file and re-verify.

- [ ] **Step 3: Note the missing asset**

`/public/og.jpg` is not part of this plan. The OG tags will reference it, but the file must be added separately. Confirm with the user that they will provide it before deploy.

- [ ] **Step 4: Final commit (only if verification surfaces fixes)**

If Step 2 surfaced any corrections, commit them now. Otherwise no commit needed — the per-task commits already capture the work.

---

## Done when

- All eight tasks are checked off.
- `pnpm build` is clean.
- Source view confirms each page renders the expected metadata.
- The user has been reminded to drop `og.jpg` into `/public`.
