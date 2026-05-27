# 9TSEVEN WEBSHOP DESIGN

The official website for **9TSEVEN**, a Danish running brand and community.
The site combines an editorial brand experience with a headless Shopify storefront Next.js app that handles content, commerce, and community.

This project is a part of our final exam on the Multimediedesign education on Erhvervsakademiet København, EK.

*More than running.*

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Routes & Pages](#routes--pages)
5. [Data Layer (Shopify)](#data-layer-shopify)
6. [Design System](#design-system)
7. [Getting Started](#getting-started)
8. [Environment Variables](#environment-variables)
9. [Scripts](#scripts)
10. [Conventions](#conventions)

---

## Overview

9TSEVEN is built as a **single Next.js 16 App Router application** that serves three distinct experiences from one codebase:

- **Brand** — Editorial landing page, mantra, hero animations, image-driven storytelling.
- **Commerce** — Product catalogue, category pages, and a slide-over cart powered by the Shopify Storefront API.
- **Community** — Events listing, community page, and newsletter sign-up.

The design language is intentionally **monochrome and editorial** — black canvas, off-white surfaces, a single decorative script accent, and heavy use of typography over imagery. Full details in [design.md](design.md).

---

## Tech Stack

| Layer | Technology | Notes |
| --- | --- | --- |
| Framework | [Next.js 16.2.3](https://nextjs.org) | App Router, Server Components, Server Actions |
| UI Runtime | [React 19.2](https://react.dev) | Concurrent rendering, `use` hook |
| Language | [TypeScript 5](https://www.typescriptlang.org) | Strict mode |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) | `@theme` block in [app/globals.css](app/globals.css) is the single source of truth for tokens |
| Animation | [Motion (Framer Motion)](https://motion.dev) | `motion/react` for component-level animation |
| Smooth Scroll | [Lenis](https://github.com/darkroomengineering/lenis) | Wraps the app in [SmoothScroll.tsx](app/components/SmoothScroll.tsx) |
| Icons | [lucide-react](https://lucide.dev) | |
| Commerce | [@shopify/storefront-api-client](https://shopify.dev/docs/api/storefront) | Headless Shopify, GraphQL Storefront API `2026-04` |
| Fonts | `next/font/local` + Adobe Typekit + Google Fonts | Open Sauce One (self-hosted), Parfumerie Script (Typekit), JetBrains Mono (Google) |
| Linting | [ESLint 9](https://eslint.org) + `eslint-config-next` | Flat config in [eslint.config.mjs](eslint.config.mjs) |


---

## Project Structure

```
9tseven-website/
├── app/                          # Next.js App Router root
│   ├── (policies)/               # Route group — policy pages (terms, privacy, returns, shipping, faq)
│   ├── actions/                  # Server Actions (cart, newsletter)
│   ├── community/                # /community + /community/events routes
│   ├── components/               # Shared UI building blocks
│   ├── context/                  # React Context providers (CartContext)
│   ├── lib/                      # Data access, Shopify client, GraphQL queries
│   │   └── queries/              # Co-located GraphQL queries per domain
│   ├── mantra/                   # /mantra route — scroll-driven brand statement
│   ├── products/                 # /products + /products/[category] dynamic routes
│   ├── globals.css               # Tailwind v4 @theme tokens + custom keyframes
│   ├── layout.tsx                # Root layout, fonts, providers, metadata
│   └── page.tsx                  # Home page
├── policies/                     # Static JSON content for policy pages
├── public/                       # Fonts, images, favicon
├── docs/                         # Project documentation
├── design.md                     # Visual design system reference
├── AGENTS.md / CLAUDE.md         # Instructions for AI agents working in this repo
├── next.config.ts                # Image optimisation config + remote patterns
├── tsconfig.json
└── package.json
```

---

## Routes & Pages

| Route | File | Description |
| --- | --- | --- |
| `/` | [app/page.tsx](app/page.tsx) | Home — Hero, featured products, category, blog, Instagram marquee |
| `/products` | [app/products/page.tsx](app/products/page.tsx) | Product index |
| `/products/[category]` | [app/products/[category]](app/products/[category]) | Category-filtered product listing |
| `/community` | [app/community/page.tsx](app/community/page.tsx) | Community landing |
| `/community/events` | [app/community/events](app/community/events) | Events listing |
| `/mantra` | [app/mantra/page.tsx](app/mantra/page.tsx) | Scroll-driven brand mantra experience |
| `/terms`, `/privacy`, `/returns`, `/shipping`, `/faq` | [app/(policies)](app/\(policies\)) | Static policy pages, content sourced from JSON in [policies/](policies/) |

The root layout ([app/layout.tsx](app/layout.tsx)) injects the shared shell:
`LoadScreen → SmoothScroll → CartProvider → NewsletterPopup → Navbar → {children} → Footer`.

---

## Data Layer (Shopify)

The site is a **headless storefront** — all product, cart, and content data is fetched from Shopify via the Storefront API.

- **Client** — [app/lib/shopify.ts](app/lib/shopify.ts) creates a single `createStorefrontApiClient` instance using the Storefront API version `2026-04`.
- **Queries** — GraphQL queries live in [app/lib/queries/](app/lib/queries/), organised by domain (`products.ts`, `cart.ts`, `community.ts`, `hero.ts`, `blogPosts.ts`, `eventPosts.ts`, `policies.ts`, `banner.ts`, `navPreviews.ts`, `newletter.ts`).
- **Server Actions** — Mutating operations (add to cart, remove from cart, newsletter signup) run as Server Actions in [app/actions/](app/actions/), keeping the storefront token server-side.
- **Cart State** — [CartContext](app/context/CartContext.tsx) holds client-side cart state and syncs with Shopify via the server actions.
- **Image Optimisation** — `next.config.ts` whitelists `cdn.shopify.com` and prioritises AVIF/WebP at 85% quality with a 31-day cache.

---

## Design System

The full design reference is in [design.md](design.md). High-level summary:

- **Dark-first**: Near-black `#0b0b0b` canvas with off-white type. Light sections invert via `text-ink*` + `bg-white`/`bg-grey`.
- **Tokens, not hex** — All colors, tracking, durations, and shadows are defined as CSS custom properties in the Tailwind v4 `@theme` block in [app/globals.css](app/globals.css). They auto-generate utilities (`bg-bg`, `text-fg-muted`, `tracking-eyebrow`, `duration-base`, etc.).
- **Typography** — Open Sauce One for everything, with **Parfumerie Script** reserved for short decorative moments. JetBrains Mono for small labels.
- **Motion** — Component animation via `motion/react`. Custom CSS keyframes (marquees) live in `globals.css` and respect `prefers-reduced-motion`.
- **Accessibility** — Never strip focus rings, always provide `aria-label` for icon-only buttons, never rely on `fg-faint`/`fg-ghost` for meaningful content.

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (see `@types/node` pin)
- A Shopify store with Storefront API access

### Install

```bash
npm install
```

### Configure environment

Create a `.env` file in the project root (see [Environment Variables](#environment-variables) below).

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

The Shopify client throws at import time if these are missing — see [app/lib/shopify.ts](app/lib/shopify.ts).

| Variable | Purpose |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Your Shopify store domain, e.g. `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_TOKEN` | Public Storefront API access token |
| `SHOPIFY_CLIENT_ID` | Shopify app client ID (reserved for OAuth flows) |
| `SHOPIFY_CLIENT_SECRET` | Shopify app client secret — **server-only, never expose** |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Start the production server (after `build`) |
| `npm run lint` | Run ESLint over the project |

---

## Conventions

- **Edit tokens in `globals.css` first** — Never hard-code hex values in components. If a color/duration/tracking doesn't exist, add the token, then use it.
- **Compose existing components** — Before adding a new component, check [app/components/](app/components/) for something reusable.
- **Server-first** — Default to Server Components. Reach for `"use client"` only when you need state, effects, or browser APIs.
- **Server Actions for mutations** — Keep Shopify tokens on the server. The client never talks to Shopify directly.
- **Respect reduced motion** — Wrap every new keyframe animation in a `@media (prefers-reduced-motion: reduce)` guard.
- **Keep `design.md` in sync** — When you add or change a design token, update the design guide in the same commit.

---

## License

Proprietary — © 9TSEVEN. All rights reserved.
