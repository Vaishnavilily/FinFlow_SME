"use client";
import ComingSoon from "@/components/ui/ComingSoon";
import { Landmark } from "lucide-react";

export default function ConnectBanking() {
  return (
    <ComingSoon 
      title="Connect Bank Accounts"
      description="Securely link your bank accounts using Plaid integration. Your feeds will sync automatically."
      icon={Landmark}
    />
  );
}
