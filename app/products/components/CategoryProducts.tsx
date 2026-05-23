import { notFound } from "next/navigation";
import ProductsListing from "./ProductsListing";
import { shopifyClient } from "@/app/lib/shopify";
import { GET_PRODUCTS } from "@/app/lib/queries/products";
import { toProduct, type StorefrontProduct } from "@/app/components/FeaturedProductsSection/types";

const KNOWN_CATEGORIES = ["performance", "lifestyle", "accessories", "new-arrivals"];

function categorySlugToProductType(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function baseFilterForSlug(slug: string): string {
  if (slug === "new-arrivals") return `tag:'new-arrival'`;
  if (slug === "accessories") return `(product_type:'Accessories' OR product_type:'Equipment')`;
  return `product_type:'${categorySlugToProductType(slug)}'`;
}

function buildShopifyQuery(slug: string, tag: string | undefined): string | undefined {
  const baseFilter = baseFilterForSlug(slug);
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
