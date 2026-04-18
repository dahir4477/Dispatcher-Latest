"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck } from "lucide-react";
import { useCallback, useState } from "react";

const trucksOptions = ["1", "2–5", "5+"];
const revenueOptions = ["$3k–$5k", "$5k–$8k", "$8k+"];

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone: "",
    trucks: "",
    weekly_revenue: "",
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setMessage("");
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.first_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
            trucks: formData.trucks || undefined,
            weekly_revenue: formData.weekly_revenue || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Something went wrong.");
          return;
        }
        setStatus("success");
        setMessage(data.message || "You're on the list!");
        setFormData({ first_name: "", email: "", phone: "", trucks: "", weekly_revenue: "" });
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    },
    [formData]
  );

  if (status === "success") {
    return (
      <section id="early-access" className="relative py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border border-primary/30 bg-card p-10 shadow-lg">
            <p className="text-2xl font-bold text-primary">You're on the list!</p>
            <p className="mt-2 text-muted-foreground">{message}</p>
            <p className="mt-4 text-sm text-muted-foreground">We'll reach out soon with early access.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="early-access" className="relative py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-foreground sm:text-4xl">
          Get Early Access to Suprihub Logistics & Dispatch Solutions
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Limited Early Access Spots
        </p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              name="first_name"
              required
              placeholder="Your first name"
              value={formData.first_name}
              onChange={(e) => setFormData((p) => ({ ...p, first_name: e.target.value }))}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              className="mt-2"
            />
          </div>
          <div>
            <Label>How many trucks do you operate?</Label>
            <Select
              value={formData.trucks || "__placeholder__"}
              onValueChange={(v) => setFormData((p) => ({ ...p, trucks: v === "__placeholder__" ? "" : v }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__placeholder__">
                  Select
                </SelectItem>
                {trucksOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Weekly Revenue Range</Label>
            <Select
              value={formData.weekly_revenue || "__placeholder__"}
              onValueChange={(v) => setFormData((p) => ({ ...p, weekly_revenue: v === "__placeholder__" ? "" : v }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__placeholder__">
                  Select
                </SelectItem>
                {revenueOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {message && (
            <p className={status === "error" ? "text-destructive" : "text-primary"}>{message}</p>
          )}
          <Button type="submit" size="xl" className="w-full text-lg" disabled={status === "loading"}>
            {status === "loading" ? (
              "Submitting..."
            ) : (
              <>
                <Truck className="mr-2 h-5 w-5" />
                Get Early Access
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
