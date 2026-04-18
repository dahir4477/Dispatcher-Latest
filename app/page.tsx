import { Hero } from "@/components/Hero";
import { PainPoints } from "@/components/PainPoints";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { TrustBadges } from "@/components/TrustBadges";
import { LeadForm } from "@/components/LeadForm";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PainPoints />
      <Features />
      <HowItWorks />
      <Testimonials />
      <TrustBadges />
      <LeadForm />
      <FAQ />
    </main>
  );
}
