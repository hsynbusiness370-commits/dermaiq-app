"use client";

import { createContext, useContext } from "react";

import type { PlanId } from "@/lib/plans";

type BillingState = {
  plan: PlanId;
  scanCreditsLeft: number;
};

const BillingContext = createContext<BillingState | null>(null);

type BillingProviderProps = {
  value: BillingState;
  children: React.ReactNode;
};

export function BillingProvider({ value, children }: BillingProviderProps) {
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBilling must be used within BillingProvider.");
  }
  return context;
}
