import FAQ from "@/website/FAQ";
import Features from "@/website/Features";
import Hero from "@/website/Hero";
import Pricing from "@/website/Pricing";
import Testimonials from "@/website/Testimonials";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Pricing />
      <Features />
      <Testimonials />
      <FAQ />
    </div>
  );
}
