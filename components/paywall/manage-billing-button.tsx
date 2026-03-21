"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function ManageBillingButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/customer-portal", { method: "POST" });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Unable to open billing portal.");
        return;
      }

      window.location.href = payload.url;
    });
  };

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" onClick={onClick} disabled={pending}>
        {pending ? "Opening portal..." : "Manage billing"}
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
