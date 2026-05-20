import type { Metadata } from "next";
import ImageSection from "../components/CommunityPage/ImageSection";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Run with us. Events, group runs, and stories from the 9TSEVEN community.",
  alternates: { canonical: "/community" },
  openGraph: { url: "/community" },
};
import InstagramMarquee from "../components/InstagramMarquee";
import ParticleField from "../components/CommunityPage/ParticleField";
import StorySection from "../components/CommunityPage/StorySection";

export default function Community() {
  return (
    <main>
      <ImageSection />
      <StorySection />
      <ParticleField />
      <InstagramMarquee />
    </main>
  );
}
