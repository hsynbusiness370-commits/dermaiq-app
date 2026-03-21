"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { analyzeSkin, type SkinAnalysisResult } from "@/services/skin-analysis";
import { buildRecommendations } from "@/services/recommendations";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SkinField = "hydration" | "texture" | "redness" | "sensitivity";

type FormState = Record<SkinField, number>;

const defaultValues: FormState = {
  hydration: 60,
  texture: 65,
  redness: 30,
  sensitivity: 35,
};

type Recommendation = ReturnType<typeof buildRecommendations>[number];

export function ScanSimulator() {
  const [form, setForm] = useState<FormState>(defaultValues);
  const [result, setResult] = useState<SkinAnalysisResult>(() => analyzeSkin(defaultValues));
  const [recommendations, setRecommendations] = useState(() => buildRecommendations(result));
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const setValue = (field: SkinField, value: number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const runScan = () => {
    setError(null);
    setPaywall(false);
    startTransition(async () => {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as {
        error?: string;
        paywall?: boolean;
        analysis?: SkinAnalysisResult;
        recommendations?: Recommendation[];
        scansRemaining?: number | null;
      };

      if (!response.ok) {
        setError(payload.error ?? "Failed to run scan.");
        setPaywall(Boolean(payload.paywall));
        return;
      }

      if (payload.analysis && payload.recommendations) {
        setResult(payload.analysis);
        setRecommendations(payload.recommendations);
        setScansRemaining(payload.scansRemaining ?? null);
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-bold">Scan simulator</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          This starter scanner simulates AI output. Replace with camera/image model integration.
        </p>

        <div className="mt-5 space-y-4">
          {(Object.keys(form) as SkinField[]).map((field) => (
            <label key={field} className="block">
              <span className="mb-1 block text-sm font-medium capitalize">{field}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={form[field]}
                onChange={(event) => setValue(field, Number(event.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-xs text-zinc-500">{form[field]} / 100</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="flex-1" onClick={runScan} disabled={isPending}>
            {isPending ? "Analyzing..." : "Run AI scan"}
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={() => setForm(defaultValues)}>
            Reset values
          </Button>
        </div>
        {typeof scansRemaining === "number" ? (
          <p className="mt-3 text-xs text-zinc-500">Free scans remaining this month: {scansRemaining}</p>
        ) : null}
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        {paywall ? (
          <Link href="/pricing" className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")}>
            Upgrade to continue scanning
          </Link>
        ) : null}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-bold">Analysis output</h2>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{result.summary}</p>
        <p className="mt-4 text-3xl font-black">{result.score}</p>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Composite skin score</p>

        <div className="mt-5">
          <h3 className="text-sm font-semibold">Primary concerns</h3>
          {result.concerns.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">No immediate concerns detected.</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
              {result.concerns.map((concern) => (
                <li key={concern}>{concern}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold">Recommended products</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
            {recommendations.map((item) => (
              <li key={item.name} className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
