import type { Metadata } from "next";
import ImageSection from "../components/CommunityPage/ImageSection";
import StorySection from "../components/CommunityPage/StorySection";
import MantraSection from "../components/CommunityPage/MantraSection";
import InstagramMarquee from "../components/InstagramMarquee";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Run with us. Events, group runs, and stories from the 9TSEVEN community.",
  alternates: { canonical: "/community" },
  openGraph: { url: "/community" },
};

export default function Community() {
  return (
    <main>
      <ImageSection />
      <StorySection />
      <MantraSection />
      <InstagramMarquee />
    </main>
  );
}
