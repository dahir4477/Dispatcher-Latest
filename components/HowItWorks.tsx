"use client";

import { Button } from "@/components/ui/button";
import { Link2, Search, Truck } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: 1,
    icon: Link2,
    title: "Connect your MC + preferences",
    description: "Link your authority and tell us your lanes, equipment, and goals.",
  },
  {
    step: 2,
    icon: Search,
    title: "AI finds and negotiates loads",
    description: "Our AI scans boards, negotiates rates, and books loads that fit.",
  },
  {
    step: 3,
    icon: Truck,
    title: "You drive. AI handles the rest.",
    description: "Focus on the road. We handle paperwork, broker comms, and optimization.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl md:text-5xl">
          How It Works
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map(({ step, icon: Icon, title, description }) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
                <Icon className="h-8 w-8" />
              </div>
              <p className="mt-4 text-sm font-semibold text-primary">Step {step}</p>
              <h3 className="mt-2 text-xl font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="#early-access">Get Early Access</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
