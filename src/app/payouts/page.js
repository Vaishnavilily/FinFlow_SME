"use client";
import ComingSoon from "@/components/ui/ComingSoon";
import { Send } from "lucide-react";

export default function Payouts() {
  return (
    <ComingSoon 
      title="Vendor Payouts"
      description="Pay your vendors and contractors directly from the platform. We are integrating ACH capabilities for fast transfers."
      icon={Send}
    />
  );
}
