import { cache } from "react";
import { shopifyClient } from "@/app/lib/shopify";
import { GET_EVENT_POSTS } from "@/app/lib/queries/eventPosts";
import type { EventPost } from "@/app/components/BlogSection/constants";

type ImageReference = {
  __typename: "MediaImage";
  image: { url: string; altText: string | null } | null;
};
type FieldNode = {
  key: string;
  value: string | null;
  reference: ImageReference | null;
  references: { edges: { node: ImageReference }[] } | null;
};
type BlogPostsResponse = {
  metaobjects: { edges: { node: { id: string; fields: FieldNode[] } }[] };
};

function fieldMap(fields: FieldNode[]): Partial<Record<string, FieldNode>> {
  return Object.fromEntries(fields.map((f) => [f.key, f]));
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  // Shopify date fields return YYYY-MM-DD; date_time returns ISO 8601.
  const ymd = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!ymd) return null;
  return `${ymd[3]}.${ymd[2]}.${ymd[1]}`;
}

function parseGallery(field: FieldNode | undefined): EventPost["gallery"] {
  const edges = field?.references?.edges ?? [];
  return edges.map(({ node }) => (node.__typename === "MediaImage" && node.image?.url ? { url: node.image.url, alt: node.image.altText } : null)).filter((img): img is EventPost["gallery"][number] => img !== null);
}

function buildPost(id: string, fields: FieldNode[]): EventPost | null {
  const f = fieldMap(fields);

  const heading = f.event_title?.value;
  const body = f.event_description?.value;

  const imageRef = f.event_image?.reference;
  const image = imageRef?.__typename === "MediaImage" ? imageRef.image : null;

  if (!heading || !body || !image?.url) return null;

  return {
    id,
    title: heading,
    body,
    image: image.url,
    alt: image.altText ?? heading,
    date: formatDate(f.event_date?.value),
    slug: f.slug?.value ?? null,
    gallery: parseGallery(f.gallery),
  };
}

export const getEvents = cache(async (): Promise<EventPost[]> => {
  const { data, errors } = await shopifyClient.request(GET_EVENT_POSTS);
  if (errors || !data) {
    throw new Error(`Shopify GET_EVENT_POSTS failed: ${JSON.stringify(errors)}`);
  }

  return (data as BlogPostsResponse).metaobjects.edges.map(({ node }) => buildPost(node.id, node.fields)).filter((p): p is EventPost => p !== null);
});

export async function getEventBySlug(slug: string): Promise<EventPost | null> {
  const events = await getEvents();
  return events.find((e) => e.slug === slug) ?? null;
}
