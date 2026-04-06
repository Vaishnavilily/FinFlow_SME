"use client";
import ComingSoon from "@/components/ui/ComingSoon";
import { CheckCircle } from "lucide-react";

export default function Reconciliation() {
  return (
    <ComingSoon 
      title="Smart Reconciliation"
      description="Automatically match your bank transactions with your invoices and bills. Smart categorization is coming soon."
      icon={CheckCircle}
    />
  );
}
