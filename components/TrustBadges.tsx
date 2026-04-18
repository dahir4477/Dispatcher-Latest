"use client";

export function TrustBadges() {
  return (
    <section className="relative py-12 bg-muted/20">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Suprihub Logistics & Dispatch Solutions — Trusted by owner-operators and small fleets
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-8 items-center opacity-70">
          <span className="text-muted-foreground text-sm">AI-powered dispatch</span>
          <span className="text-muted-foreground text-sm">Secure & compliant</span>
          <span className="text-muted-foreground text-sm">Built for trucking</span>
        </div>
      </div>
    </section>
  );
}
