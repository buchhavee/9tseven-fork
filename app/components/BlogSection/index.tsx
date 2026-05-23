import { getBlogPosts } from "@/app/lib/blogPosts";
import { getEvents } from "@/app/lib/eventPosts";
import type { BlogPost, EventPost } from "./constants";
import BlogStack from "./BlogStack";

interface BlogSectionProps {
  source?: "blog" | "events";
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export default async function BlogSection({ source = "blog", title, subtitle, tagline }: BlogSectionProps = {}) {
  const posts: (BlogPost | EventPost)[] = source === "events" ? await getEvents() : await getBlogPosts();
  return <BlogStack source={source} posts={posts} title={title} subtitle={subtitle} tagline={tagline} />;
}
