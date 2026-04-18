"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const faqs = [
  {
    q: "Is this legal?",
    a: "Yes. Suprihub uses the same load boards and broker relationships you already use. We just automate the matching, negotiation, and paperwork so you can focus on driving.",
  },
  {
    q: "Does it replace my dispatcher?",
    a: "It can. Many owner-operators use Suprihub instead of paying 5–10% to a dispatcher. You keep more of every load.",
  },
  {
    q: "How much does it cost?",
    a: "Early access pricing will be shared when you sign up. We're built to save you more than it costs.",
  },
  {
    q: "When does it launch?",
    a: "Suprihub is rolling out to early access users soon. Sign up above to get first access.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 md:py-28 bg-background">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-12 space-y-4">
          {faqs.map(({ q, a }, i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">{q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
