"use client";
import ComingSoon from "@/components/ui/ComingSoon";
import { PieChart } from "lucide-react";

export default function Reports() {
  return (
    <ComingSoon 
      title="Financial Reports"
      description="Crystal clear insights into your business health. Profit & Loss, Balance Sheets, and Cash Flow visualizations are being built."
      icon={PieChart}
    />
  );
}
