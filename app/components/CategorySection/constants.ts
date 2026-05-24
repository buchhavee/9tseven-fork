export type CategoryPanel = {
  label: string;
  leftText: string;
  rightText: string;
  image: string;
  alt: string;
  href: string;
};

export const PANELS: CategoryPanel[] = [
  {
    label: "Lifestyle",
    leftText: "Lifestyle",
    rightText: "( Shop )",
    image: "/images/CategorySection/lifestyle.webp",
    alt: "Lifestyle category",
    href: "/products/lifestyle",
  },
  {
    label: "Performance",
    leftText: "Performance",
    rightText: "( Shop )",
    image: "/images/CategorySection/performance.webp",
    alt: "Performance category",
    href: "/products/performance",
  },
];
