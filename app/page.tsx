import HeroSection from "./components/HeroSection";
import FeaturedProductsSection from "./components/FeaturedProductsSection";
import HomeImageSection from "./components/HomeImageSection";
import BlogSection from "./components/BlogSection";
import InstagramMarquee from "./components/InstagramMarquee";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProductsSection />
      <HomeImageSection />
      <BlogSection />
      <InstagramMarquee theme="light" />
    </main>
  );
}
