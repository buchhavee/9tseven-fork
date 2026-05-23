import type { Metadata } from "next";
import ImageSection from "../components/CommunityPage/ImageSection";
import StorySection from "../components/CommunityPage/StorySection";
import MantraSection from "../components/CommunityPage/MantraSection";
import InstagramMarquee from "../components/InstagramMarquee";
import BlogSection from "../components/BlogSection";

export const metadata: Metadata = {
  title: "Community",
  description: "Run with us. Events, group runs, and stories from the 9TSEVEN community.",
  alternates: { canonical: "/community" },
  openGraph: { url: "/community" },
};

export default function Community() {
  return (
    <main>
      <ImageSection />
      <StorySection />
      <MantraSection />
      <BlogSection source="events" title="Events" subtitle="Information about recent and upcoming events" tagline="( Events )" />
      <InstagramMarquee />
    </main>
  );
}
