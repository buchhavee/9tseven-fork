# Per-page SEO Metadata — Design

Date: 2026-05-20
Branch: `chore/site-polish-and-perf`

## Goal

Give every page on 9tseven.com unique, keyword-targeted SEO metadata — title, description, Open Graph, and Twitter card tags — so search engines and social previews can render each URL accurately.

## Scope

In scope:

- Per-page `metadata` / `generateMetadata` exports on every page.
- Title / description / Open Graph / Twitter card tags.
- `metadataBase` and a title template on the root layout.

Out of scope (deferred to follow-ups):

- `robots.ts` and `sitemap.ts` route generators.
- JSON-LD structured data (Organization, Product, BreadcrumbList).
- Canonical URLs beyond the default that `metadataBase` provides.

## Brand positioning

9TSEVEN is positioned as a **running brand + lifestyle community**. SEO copy leans on:

- Running apparel / running gear (primary).
- Community, lifestyle, "more than running" (secondary).

## Architecture

Two layers:

1. **Root** — `app/layout.tsx` sets `metadataBase`, a title template, default description, OG/Twitter defaults, robots. Every page inherits these.
2. **Per page** — each page overrides only the fields unique to it (typically just `title` and `description`; product pages also set `openGraph.images`).

Title template: `"%s — 9TSEVEN"`. A page that exports `title: "Mantra"` renders as `Mantra — 9TSEVEN`. The home page uses the `default` title and renders as `9TSEVEN — More than running`.

## Root layout (`app/layout.tsx`)

Replace the current `metadata` object with:

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

## Per-page metadata

### Static pages

| Path | `title` | `description` |
|---|---|---|
| `/` (`app/page.tsx`) | _(omit — inherits the root `default`)_ | _(omit — inherits root)_ |
| `/mantra` | `"Mantra"` | `"The mantra behind 9TSEVEN — the principles, people, and runs that shape the brand. More than running."` |
| `/products` | `"Shop"` | `"Shop 9TSEVEN running apparel, accessories and lifestyle pieces. Technical gear designed for runners, built for everyday wear."` |
| `/community` | `"Community"` | `"Run with us. Events, group runs, and stories from the 9TSEVEN community."` |

For each, also set `alternates.canonical` to the page's path (e.g. `"/mantra"`).

Home (`app/page.tsx`) does not need its own export — the root `default` title and description already match what we want for `/`.

### Dynamic: `app/products/[category]/page.tsx`

Add `generateMetadata`:

- Reads `params.category` and formats the slug into a title-case label (`"long-sleeve"` → `"Long Sleeve"`). The existing `marqueeLabel` helper uppercases for the visual marquee — metadata needs title-case instead, so the implementation defines a separate small helper (or inlines `.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")`).
- Returns:
  - `title`: the formatted label, e.g. `"Long Sleeve"`.
  - `description`: `` `Shop 9TSEVEN ${label.toLowerCase()} — running ${label.toLowerCase()} built for performance and the lifestyle around it.` ``
  - `alternates.canonical`: `` `/products/${category}` ``
  - `openGraph.url`: same canonical path.

If a `tag` search param is present, omit it from the canonical URL (we don't want tag-filtered pages competing with the canonical category in search).

### Dynamic: `app/products/[category]/[handle]/page.tsx`

Add `generateMetadata`:

- Calls the same Shopify query the page already uses (`GET_PRODUCT_BY_HANDLE`) — Next dedupes identical fetches within a request, so this isn't a second round-trip.
- If the product is missing or its category doesn't match the URL, return an empty metadata object (the page will 404).
- Otherwise return:
  - `title`: `product.title`.
  - `description`: `product.description` truncated to ~155 characters on a word boundary, with any HTML tags stripped first. If Shopify returns no description, fall back to: `` `Shop ${product.title} — 9TSEVEN running apparel and gear.` ``
  - `alternates.canonical`: `` `/products/${category}/${handle}` ``
  - `openGraph.url`: same canonical path.
  - `openGraph.images` / `twitter.images`: the product's featured image (Shopify `featuredImage.url` if present); otherwise inherits the root default.

### Existing: `app/(policies)/[slug]/page.tsx`

Currently returns `` `${policies[slug].title} – 9TSEVEN` ``. With the new template `%s — 9TSEVEN`, this would double-brand to `Privacy Policy – 9TSEVEN — 9TSEVEN`. Fix: return just `policies[slug].title` and let the template add the suffix. (En-dash → em-dash as a side effect; that matches the rest of the site.)

## Open Graph image strategy

- **Default** (root + static pages): a single shared image at `/public/og.jpg`, 1200×630.
- **Product pages**: the product's `featuredImage.url` from Shopify.
- **Category pages**: inherit the default `/og.jpg` (no per-category asset in this round).

The user provides `og.jpg`. This spec does not generate it.

## What gets edited

- `app/layout.tsx` — replace `metadata` with the expanded version above.
- `app/mantra/page.tsx` — add `export const metadata`.
- `app/products/page.tsx` — add `export const metadata`.
- `app/community/page.tsx` — add `export const metadata`.
- `app/products/[category]/page.tsx` — add `generateMetadata`.
- `app/products/[category]/[handle]/page.tsx` — add `generateMetadata`.
- `app/(policies)/[slug]/page.tsx` — fix double-brand by returning bare title.

`app/page.tsx` does not need an edit.

## Verification

1. `pnpm build` — confirm no type errors and that `generateMetadata` typing matches Next's expectations.
2. Run `pnpm dev` and view source on:
   - `/` — confirms root metadata is applied.
   - `/mantra`, `/products`, `/community` — confirms title template, description, and OG tags.
   - `/products/{a known category}` — confirms dynamic title + canonical.
   - `/products/{category}/{a known product handle}` — confirms product title, truncated description, product OG image.
   - `/{a policy slug}` — confirms title isn't double-branded.
3. Spot-check one URL with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (or equivalent) after deploy.

## Assumptions

- `https://9tseven.com` is the canonical production host.
- The site is English-only (`<html lang="en">` is already set in the layout).
- Shopify product descriptions are plain text or close enough that a `slice` truncation is acceptable; if they contain HTML, the truncation helper strips tags first.
