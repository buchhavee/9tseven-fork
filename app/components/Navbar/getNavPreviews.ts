import { shopifyClient } from "@/app/lib/shopify";
import { GET_NAV_PREVIEWS } from "@/app/lib/queries/navPreviews";
import type { NavPreviews, PreviewItem } from "./types";

const PREVIEW_COUNT = 3;

type PreviewNode = {
  handle: string;
  title: string;
  productType: string;
  featuredImage: { url: string; altText: string | null } | null;
};

type PreviewEdges = { edges: { node: PreviewNode }[] };

type PreviewResponse = {
  newArrivals: PreviewEdges;
  performance: PreviewEdges;
  lifestyle: PreviewEdges;
  accessories: PreviewEdges;
  allProducts: PreviewEdges;
};

function toPreviewItem(node: PreviewNode): PreviewItem {
  return {
    handle: node.handle,
    title: node.title,
    productType: node.productType,
    image: node.featuredImage
      ? { url: node.featuredImage.url, altText: node.featuredImage.altText }
      : null,
  };
}

const EMPTY: NavPreviews = {
  newArrivals: [],
  performance: [],
  lifestyle: [],
  accessories: [],
  allProducts: [],
};

export async function getNavPreviews(): Promise<NavPreviews> {
  try {
    const { data, errors } = await shopifyClient.request(GET_NAV_PREVIEWS, {
      variables: { previewCount: PREVIEW_COUNT },
    });
    if (errors || !data) return EMPTY;
    const typed = data as PreviewResponse;
    return {
      newArrivals: typed.newArrivals.edges.map((e) => toPreviewItem(e.node)),
      performance: typed.performance.edges.map((e) => toPreviewItem(e.node)),
      lifestyle: typed.lifestyle.edges.map((e) => toPreviewItem(e.node)),
      accessories: typed.accessories.edges.map((e) => toPreviewItem(e.node)),
      allProducts: typed.allProducts.edges.map((e) => toPreviewItem(e.node)),
    };
  } catch {
    return EMPTY;
  }
}
