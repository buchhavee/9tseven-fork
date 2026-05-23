export type NavTheme = "dark" | "light";
export type PillStyle = { left: number; width: number; height: number };

export type ShopCategory = { label: string; href: string };

export type PreviewItem = {
  handle: string;
  title: string;
  productType: string;
  image: { url: string; altText: string | null } | null;
};

export type NavPreviews = {
  newArrivals: PreviewItem[];
  performance: PreviewItem[];
  lifestyle: PreviewItem[];
  accessories: PreviewItem[];
  allProducts: PreviewItem[];
};
