# Præsentation — "Shop the Look" (UGC) · 9TSEVEN

**Stack:** Next.js 16 (App Router) · React 19 · Shopify Storefront API (headless) · Tailwind 4

> Forslag til slide-rækkefølge står nederst. Fil-referencer i parentes er klikbare i editoren.

---

## 1. Hvad er funktionen? (åbn med dette)

"Shop the Look" lader kunder se rigtige community-medlemmer (UGC = *User Generated
Content*) i 9tseven-tøj og købe **hele outfittet** — enten produkt for produkt eller
med ét klik.

Den lever tre steder:
- **UGC-kort drysset ind i produkt-griddet** (`ProductsGrid.tsx`) — inspiration mellem produkterne.
- **En dedikeret look-side** (`looks/[slug]/page.tsx`) — billede + shoppbare produkter + andre looks + Instagram-CTA.
- **Et index-redirect** (`looks/page.tsx`) der sender til første look.

**Hvorfor det er god e-commerce:** social proof + FOMO. Rigtige mennesker med
Instagram-handles og citater skaber troværdighed; "køb hele looket" øger
gennemsnitsordren (basket size).

---

## 2. Arkitektur — det stærkeste tekniske punkt

**UGC-data og produktdata er bevidst adskilt.**

```
ugc-placeholder-data.ts          ugcLooks.ts                 Shopify Storefront API
─────────────────────────        ──────────────────          ─────────────────────
person, handle, tag, citat   ─►   slår op via handle     ─►   titel, pris, billede,
billede (UGC-felter)              i live produktdata           størrelser, varianter,
produkter = KUN { handle }        (Server Component)           sold-out-status (LIVE)
```

- Placeholder-filen indeholder kun det redaktionelle: person, handle, tag, citat, billede.
- Produkter refereres **udelukkende via `handle`** (fx `"9tseven-race-shorts"`).
- Al produktdata hentes **live fra Shopify** i `getUGCLookView()` (`ugcLooks.ts`).

```ts
const products = look.products
  .map((p) => byHandle.get(p.handle))
  .filter((live): live is Product => live !== undefined)  // døde handles droppes elegant
  .map(toProductView);
```

**Sig dette højt:**
- Prisen i et look kan aldrig blive forældet — den er altid den samme som på produktsiden.
- Udsolgte/slettede produkter falder bare ud (`.filter`) i stedet for at vise en død reference.
- Filen er en bevidst **placeholder for et Shopify metaobject**. Kommentaren siger at
  "kun `ugcLooks.ts` skal opdateres" når metaobjects er klar → migrerbar mellemløsning,
  komponenterne forbliver uændrede.

Eksempel på mønstret **"Server henter → Client gør interaktiv"**: siden er en async
Server Component (henter data tæt på kilden, lækker ikke Shopify-token), og kun
`UGCLookShopper` (`"use client"`) er interaktiv.

---

## 3. Nøglekode — og hvad den gør for brugeren

### A) "Add hele look til kurv" — den centrale feature (`UGCLookShopper.tsx`)

```tsx
const allSizesChosen = hasProducts &&
  products.every((p) => p.sizes.length === 0 || Boolean(sizes[p.handle]));

const handleAddLook = () => {
  if (!allSizesChosen) return;
  const merchandiseIds = products.map(variantFor).filter(...).map((v) => v.id);
  addLines(merchandiseIds);   // ÉN mutation, ikke N
  openCart();
};
```

**For brugeren:** vælg størrelse på alle dele → tryk én knap → hele outfittet ligger i
kurven, og kurven åbner. Knapteksten skifter:
*"Select all sizes to add look"* → *"+ Add look to cart"* → *"Adding…"*.

**Teknisk pointe:** `addLinesToCart` (`actions/cart.ts`) tilføjer alt i **én atomisk
Shopify-mutation** — ikke ét kald per produkt. Kommentaren siger det selv:
*"atomic, so no duplicate carts and one round trip."* Hurtigere + ingen race conditions.

### B) Mini-produktkort med inline størrelsesvalg (`UGCMiniProductCard.tsx`)

```tsx
const handleAdd = (e) => {
  e.preventDefault();    // kortet ER et <Link> — stop navigationen
  e.stopPropagation();
  if (needsSize) return;
  if (selectedVariant) addLine(selectedVariant.id, 1);
  else addLineByHandle(product.handle, 1);
  openCart();
};
```

**For brugeren:** kan købe enkeltdele uden at forlade looket. Hele kortet linker til
produktsiden (PDP), men knapper indeni afbryder klikket via `preventDefault` /
`stopPropagation` — klassisk "interaktiv ø inde i et link", løst rent.

**Detalje at vise:** udsolgte størrelser bliver `line-through` + `cursor-not-allowed` +
`disabled` → brugeren får at vide *hvad* der ikke kan vælges.

---

## 4. Layout & styling — med teoretiske begreber

### Gestaltlovene (konkrete eksempler i koden)

| Lov | Hvor i koden |
|---|---|
| **Nærhed (proximity)** | Mini-kortet grupperer billede + kategori + titel + pris + størrelser + knap tæt med `gap-1` → læses som ét produkt. |
| **Lighed (similarity)** | Alle UGC-kort / alle mini-kort er visuelt identiske → forstås som "samme slags ting"; uniform `grid`. |
| **Fælles område (common region)** | Hvert mini-kort har `rounded-lg border bg-white` — synlig ramme der indkapsler produktet. Look-sektionen er selv én stor ramme der binder person + produkter sammen. |
| **Figur/grund (figure-ground)** | Gradient-overlay `from-bg/90 ... to-transparent` (`UGCCard.tsx`) løfter den hvide tekst fri af billedet → altid læsbar uanset foto. |
| **Forbundethed** | Eyebrow + navn + handle + tag i lodret kolonne → læses som ét sammenhørende navneskilt. |

### Visuelt hierarki & typografi
- **Skala-hierarki:** stort sort uppercase navn (`text-5xl font-black`) → eyebrow i lille
  mono (`text-[10px] tracking-eyebrow`) → handle/tag mindst. Øjet ledes top-ned.
- **To skrifttype-roller:** `font-black` display til navne/overskrifter; `font-mono` til
  labels/metadata. Mono = "teknisk/data", display = "brand/personlighed".
- **Fluid type på mobil:** `text-[clamp(8px,2vw,9px)]` skalerer med viewport uden brud.

### Responsivt layout
UGC-kortet har **to forskellige layouts**:
- **Desktop:** tekst *oven på* billedet med gradient (`hidden md:block`).
- **Mobil:** tekst *under* billedet + eksplicit "View full look →"-knap (`md:hidden`).

Look-siden vender fra **stak (mobil)** til **side-om-side (`lg:flex-row`)** — billede `2/5`,
produkter `3/5`.

---

## 5. UX/UI — heuristikker at nævne

- **Synlighed af systemstatus (Nielsen #1):** knapper viser `Adding…` via `pending` fra
  `useTransition`. Brugeren er aldrig i tvivl.
- **Fejlforebyggelse (Nielsen #5):** "Add look" er `disabled` til alle størrelser er valgt
  — man *kan ikke* lave en ufuldstændig ordre. Bedre end fejlbesked bagefter.
- **Genkendelse > genkaldelse (Nielsen #6) / Jakobs lov:** velkendte e-commerce-mønstre
  (produktkort, størrelseschips, "add to cart") → ingen ny indlæring.
- **Fitts' lov:** størrelses-knapper er større på mobil (`px-2 py-1 text-[10px]`) end på
  desktop (`md:px-1.5 md:text-[8px]`) — tap-targets tilpasset finger vs. mus.
- **Signifiers/affordances:** `→`-pile, `group-hover:scale-[1.03]` zoom, `hover:bg-ink`
  invertering → alt fortæller "jeg er klikbar".
- **Von Restorff / isolationseffekten:** UGC-kort afbryder produkt-griddet hver 4. plads
  (`ProductsGrid.tsx`) → skiller sig ud som inspiration.
- **Æstetik-brugbarhed-effekten:** poleret look-side (gradient, animation, smooth scroll)
  får produktet til at *føles* bedre og mere troværdigt.
- **Social proof / FOMO:** rigtige mennesker + handles + citater. Instagram-CTA lukker
  loopet: *"Share your look. Become part of the story."*

---

## 6. Tilgængelighed (accessibility)

- `aria-label` på look-kortet: `"Shop Julia's look — CASUAL RUN OUTFIT"` (`UGCCard.tsx`)
  → skærmlæser får mening, ikke bare "link".
- Dekorative gradienter og SVG-ikon er `aria-hidden`.
- Eksterne Instagram-links har `rel="noopener noreferrer"` (tabnabbing-beskyttelse).
- Semantisk struktur: `main`, `section`, `h1` / `h2`.

---

## 7. SEO & performance (kort, men stærkt)

- `generateStaticParams` → alle look-sider **pre-renderes statisk** ved build.
- `generateMetadata` → unik title/description/canonical/OG per look.
- Next.js `<Image>` med `fill`, `sizes`, `quality={85}`, `priority` på hero → optimerede
  billeder, god LCP.
- `BackButton` bruger `router.back()` → brugeren vender tilbage præcis hvor de kom fra.

---

## Slide-rækkefølge

1. **Hvad & hvorfor** (social proof, sælg hele outfittet) — sektion 1
2. **Arkitektur-diagram**: placeholder → handle → live Shopify-data — sektion 2 *(stærkeste punkt)*
3. **Kode: "Add look to cart"** — atomisk mutation + status — sektion 3A
4. **Layout & Gestalt** — sektion 4
5. **UX/UI-heuristikker** — sektion 5
6. **Tilgængelighed + SEO** — sektion 6–7

---

## Filoversigt (hvis du får spørgsmål)

| Fil | Rolle |
|---|---|
| `app/lib/ugc-placeholder-data.ts` | Redaktionelle UGC-data + produkt-handles (placeholder for metaobject) |
| `app/lib/ugcLooks.ts` | Slår handles op i live Shopify-data; bygger view-modeller |
| `app/products/looks/[slug]/page.tsx` | Look-siden (Server Component, statisk genereret) |
| `app/products/looks/page.tsx` | Index → redirect til første look |
| `app/products/components/UGCLookShopper.tsx` | Client: størrelses-state + "add hele look" |
| `app/products/components/UGCMiniProductCard.tsx` | Client: enkelt-produktkort m. inline størrelse + add |
| `app/products/components/UGCCard.tsx` | Inspirations-kort i grid + "andre looks" |
| `app/products/components/BackButton.tsx` | `router.back()` |
| `app/products/components/ProductsGrid.tsx` | Drysser UGC-kort ind hver 4. plads |
| `app/actions/cart.ts` | Server actions: `addLine`, `addLineByHandle`, `addLinesToCart` (atomisk) |
