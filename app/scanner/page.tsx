import { ScanSimulator } from "@/components/scanner/scan-simulator";

export default function ScannerPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Skin scanner</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Analyze skin condition and generate routine recommendations in seconds.
        </p>
      </div>
      <ScanSimulator />
    </div>
  );
}
