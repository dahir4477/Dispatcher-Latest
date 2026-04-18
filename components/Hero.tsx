"use client";

import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-background pt-24 pb-16 md:pt-28 md:pb-24">
      {/* Company name / nav */}
      <div className="absolute top-6 left-0 right-0 z-20 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-foreground sm:text-xl">
          Suprihub Logistics & Dispatch Solutions
        </p>
      </div>
      {/* Animated background grid + glow */}
      <div className="absolute inset-0 bg-grid-pattern" aria-hidden />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl animate-glow-pulse" aria-hidden />
      <div className="absolute right-0 top-1/4 w-[400px] h-[300px] rounded-full bg-primary/5 blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} aria-hidden />

      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
            Stop Losing Loads.{" "}
            <span className="text-primary">Let Suprihub Dispatch Your Truck.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            No more chasing brokers. No more low-paying loads. Our AI finds, negotiates, and books profitable loads automatically.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="xl" className="w-full sm:w-auto text-lg">
              <Link href="#early-access">
                <Truck className="mr-2 h-5 w-5" />
                Join Early Access
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto text-lg">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Mock dashboard placeholder */}
        <div className="mt-16 mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-2 sm:p-4 shadow-2xl glow-accent">
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center border border-border">
              <div className="text-center text-muted-foreground">
                <p className="text-sm font-medium">Dashboard preview</p>
                <p className="text-xs mt-1">Smart load matching • Rate optimization • Profit tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
