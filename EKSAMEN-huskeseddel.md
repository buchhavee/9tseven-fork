# Huskeseddel — Server & Client Components (9TSEVEN)

**Stack:** Next.js 16 (App Router) · React 19 · Shopify Storefront API (headless) · Tailwind 4

---

## Kerneregel (sig dette først)
- App Router: **alt er Server Component som default.**
- En komponent bliver Client Component **kun** med `"use client"` øverst i filen.
- Vi vælger ikke server — vi vælger bevidst at *opte ud* til client, og kun med en grund.
- Fordeling hos os: **~48 client-filer ud af 127** → bevidst opdelt.

## Server vs. Client
| | Server Component | Client Component |
|---|---|---|
| Kører | Kun på serveren | Browser (pre-renders på server) |
| Sender JS til browser | **Nej** (0 kb) | Ja |
| Kan hente data direkte | Ja (`async/await`) | Nej (via action/fetch) |
| state / `useState` / events | Nej | Ja |
| browser-API (`window` osv.) | Nej | Ja |
| Markeres med | (default) | `"use client"` |

## Vores hovedmønster: "Server henter → Client gør interaktiv"
- `FeaturedProductsSection/index.tsx` (server, async) henter produkter fra Shopify → giver som props til `FeaturedProductsCarousel` (`"use client"`, slider).
- `HeroSection/index.tsx` (server) henter slides → `HeroSectionClient` (animation).
- `Navbar/index.tsx` (server) henter previews → `NavbarClient` (menu-state, scroll-tema).

> **Pointe:** Så lidt client som muligt. Data hentes på serveren, tæt på kilden, uden at lække Shopify-token. Kun det interaktive lag er client → lille JS-bundle.

## Hvorfor server-side her? (e-commerce "hvorfor")
- **SEO:** indekserbar HTML med det samme + `generateMetadata` (se produktside).
- **Load-tid:** mindre JS, hurtigere first paint.
- **Sikkerhed:** Shopify-token i `app/lib/shopify.ts` forlader aldrig serveren.

## Server Actions (`"use server"`)
- Filer: `app/actions/cart.ts`, `app/actions/newsletter.ts`.
- Funktion der kører på serveren, men **kaldes direkte fra client** som et almindeligt funktionskald — Next.js laver netværkskaldet bag kulisserne. Intet separat REST-API.
- Kurv-flow: client-knap → `addToCart()` (server) → taler med Shopify → gemmer `cart_id` i **httpOnly cookie** (kan ikke læses af browser-JS → XSS-beskyttelse) → returnerer ny kurv.
- `CartContext.tsx` (`"use client"`): Context + `useState` + `useTransition` til at kalde actions uden at blokere UI.

## Hvorfor er DEN client-side? (vær klar med eksempler)
- `CartContext.tsx` → Context + state + cookie-kurv.
- `SmoothScroll.tsx` → Lenis bruger `window`/DOM.
- `LoadScreen/index.tsx` → `sessionStorage` + animation.
- `ProductCard/index.tsx` → hover-billedslider (`useState`/`useRef`) + `useRouter`.
- `ParticleField` → canvas-animation, kræver browser.
- Fælles nævner: **state, browser-API eller animation.**

## Hydration (stærkt kort)
- Hydration = browseren tager server-HTML og knytter React's JS + event-handlers til den → bliver interaktiv.
- `layout.tsx` har `PRE_HYDRATION_SCRIPT`: tjekker `sessionStorage` (load-skærm set?) *før* hydration → undgår "flash".

## Hurtige svar
- **Server child af client?** Ja, kun sendt ind som `children`/prop — ikke importeret direkte.
- **Hvorfor ikke alt client (SPA)?** Større bundle, dårlig SEO, langsom load, token lækker.
- **Hvor henter I data?** I Server Components med `async/await` direkte mod Shopify.
