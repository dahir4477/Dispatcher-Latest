"use client";

import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import Link from "next/link";

export function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 md:hidden safe-area-pb">
      <Button asChild size="xl" className="w-full text-lg">
        <Link href="#early-access">
          <Truck className="mr-2 h-5 w-5" />
          Join Early Access
        </Link>
      </Button>
    </div>
  );
}
