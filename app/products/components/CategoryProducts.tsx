import { notFound } from "next/navigation";
import ProductsListing from "./ProductsListing";
import { shopifyClient } from "@/app/lib/shopify";
import { GET_PRODUCTS } from "@/app/lib/queries/products";
import { toProduct, type StorefrontProduct } from "@/app/components/FeaturedProductsSection/types";

const KNOWN_CATEGORIES = ["apparel", "accessories", "equipment", "new-arrivals"];

function categorySlugToProductType(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildShopifyQuery(slug: string, tag: string | undefined): string | undefined {
  const baseFilter = slug === "new-arrivals" ? `tag:'new-arrival'` : `product_type:'${categorySlugToProductType(slug)}'`;
  if (!tag) return baseFilter;
  return `${baseFilter} AND tag:'${tag}'`;
}

interface CategoryProductsProps {
  slug: string;
  tag: string | undefined;
}

export default async function CategoryProducts({ slug, tag }: CategoryProductsProps) {
  const query = buildShopifyQuery(slug, tag);

  const { data, errors } = await shopifyClient.request(GET_PRODUCTS, {
    variables: { first: 100, query },
  });

  if (errors) {
    throw new Error(`Shopify GET_PRODUCTS failed: ${JSON.stringify(errors)}`);
  }

  const edges = (data as { products: { edges: { node: StorefrontProduct }[] } } | undefined)?.products.edges ?? [];
  const products = edges.map((e) => toProduct(e.node));

  if (!KNOWN_CATEGORIES.includes(slug) && products.length === 0) {
    notFound();
  }

  return <ProductsListing products={products} />;
}
