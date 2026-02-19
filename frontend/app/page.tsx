import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Agents } from "@/components/landing/Agents";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Agents />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}