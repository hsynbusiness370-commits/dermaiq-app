import { PricingGrid } from "@/components/pricing/pricing-grid";

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">Pricing</p>
        <h1 className="text-4xl font-black tracking-tight">Plans that grow with your skin journey</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">
          Start free, then upgrade when you want unlimited scans, deeper analysis, and a personal skincare copilot.
        </p>
      </div>

      <PricingGrid />
    </div>
  );
}
