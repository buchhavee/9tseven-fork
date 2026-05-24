import HeroSection from "./components/HeroSection";
import FeaturedProductsSection from "./components/FeaturedProductsSection";
import HomeImageSection from "./components/HomeImageSection";
import CategorySection from "./components/CategorySection";
import BlogSection from "./components/BlogSection";
import InstagramMarquee from "./components/InstagramMarquee";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProductsSection />
      <HomeImageSection />
      <CategorySection />
      <BlogSection />
      <InstagramMarquee theme="light" />
    </main>
  );
}
