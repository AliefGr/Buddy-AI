import Navbar from "./Navbar";
import Hero from "./Hero";
import TrustedBy from "./TrustedBy";
import Features from "./Features";
import AIShowcase from "./AIShowcase";
import Workflow from "./Workflow";
import Marketing from "./Marketing";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-buddy-bg overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <AIShowcase />
      <Workflow />
      <Marketing />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
