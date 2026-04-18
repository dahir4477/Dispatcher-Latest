"use client";

import { AlertCircle, Clock, DollarSign, Heart, TrendingDown, Truck } from "lucide-react";

const points = [
  { icon: DollarSign, text: "Brokers lowballing you" },
  { icon: Clock, text: "Spending hours searching load boards" },
  { icon: TrendingDown, text: "Dispatcher taking 5–10%" },
  { icon: Truck, text: "Empty miles killing profits" },
  { icon: Heart, text: "No time for family" },
  { icon: AlertCircle, text: "Inconsistent weekly revenue" },
];

export function PainPoints() {
  return (
    <section id="pain-points" className="relative py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl md:text-5xl max-w-3xl mx-auto">
          Still Working 14 Hours But Profits Feel Small?
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {points.map(({ icon: Icon, text }, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-foreground shadow-sm"
            >
              <Icon className="h-6 w-6 shrink-0 text-primary" />
              <span className="text-base font-medium">{text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-center text-xl md:text-2xl font-semibold text-primary max-w-2xl mx-auto">
          You bought the truck for freedom. Not stress.
        </p>
      </div>
    </section>
  );
}
