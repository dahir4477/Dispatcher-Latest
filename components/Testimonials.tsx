"use client";

import { BarChart3, Clock, DollarSign, Zap } from "lucide-react";

const metrics = [
  { icon: DollarSign, value: "+18%", label: "Higher Load Rates" },
  { icon: Clock, value: "-40%", label: "Time on Load Boards" },
  { icon: BarChart3, value: "+25%", label: "Profit Optimization" },
  { icon: Zap, value: "24/7", label: "Automated Booking" },
];

export function Testimonials() {
  return (
    <section id="results" className="relative py-20 md:py-28 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl md:text-5xl">
          Results That Matter
        </h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ icon: Icon, value, label }, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 text-center shadow-lg"
            >
              <Icon className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 text-3xl font-bold text-primary">{value}</p>
              <p className="mt-1 text-muted-foreground font-medium">{label}</p>
            </div>
          ))}
        </div>
        {/* Testimonial placeholder */}
        <div className="mt-16 max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-xl font-medium text-foreground italic">
            &ldquo;Made $4,000 more my first month.&rdquo;
          </p>
          <p className="mt-2 text-sm text-muted-foreground">— Early access driver</p>
        </div>
      </div>
    </section>
  );
}
