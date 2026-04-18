"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  FileCheck,
  MessageSquare,
  Route,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Smart Load Matching",
    description: "AI scans load boards 24/7 and filters high-paying loads that fit your lanes.",
  },
  {
    icon: BarChart3,
    title: "Rate Optimization Engine",
    description: "Negotiates better rates and books automatically so you focus on driving.",
  },
  {
    icon: FileCheck,
    title: "Auto Paperwork Processing",
    description: "Less admin, more miles. Documents and compliance handled for you.",
  },
  {
    icon: BarChart3,
    title: "Profit Tracking Dashboard",
    description: "See exactly where your money goes and where to improve.",
  },
  {
    icon: MessageSquare,
    title: "Broker Communication AI",
    description: "Handles back-and-forth with brokers so you don't have to.",
  },
  {
    icon: Route,
    title: "Smarter Routing",
    description: "Reduces dead miles and optimizes routes for maximum profit.",
  },
];

export function Features() {
  return (
    <section id="solution" className="relative py-20 md:py-28 bg-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl md:text-5xl">
          Meet Suprihub — Your AI Dispatcher
        </h2>
        <p className="mt-6 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
          AI scans load boards 24/7, filters high-paying loads, negotiates rates, books automatically, optimizes routes, and reduces dead miles.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <Card key={i} className="border-border bg-card hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
