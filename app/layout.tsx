import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileCTA } from "@/components/MobileCTA";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Suprihub Logistics & Dispatch Solutions | AI Truck Dispatch for Owner Operators",
  description:
    "Suprihub Logistics & Dispatch Solutions — Automate your trucking business with AI dispatch. Higher paying loads, automated booking, smarter routing.",
  openGraph: {
    title: "Suprihub Logistics & Dispatch Solutions | AI Truck Dispatch for Owner Operators",
    description:
      "Suprihub Logistics & Dispatch Solutions — Automate your trucking business with AI dispatch. Higher paying loads, automated booking, smarter routing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suprihub Logistics & Dispatch Solutions | AI Truck Dispatch for Owner Operators",
    description:
      "Suprihub Logistics & Dispatch Solutions — Automate your trucking business with AI dispatch. Higher paying loads, automated booking, smarter routing.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://suprihub.example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
        <MobileCTA />
        {/* Spacer so sticky mobile CTA doesn't cover content */}
        <div className="h-20 md:hidden" aria-hidden />
      </body>
    </html>
  );
}
