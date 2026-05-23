import { getBlogPosts } from "@/app/lib/blogPosts";
import BlogStack from "./BlogStack";

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export default async function BlogSection({ title, subtitle, tagline }: BlogSectionProps = {}) {
  const posts = await getBlogPosts();
  return <BlogStack posts={posts} title={title} subtitle={subtitle} tagline={tagline} />;
}
