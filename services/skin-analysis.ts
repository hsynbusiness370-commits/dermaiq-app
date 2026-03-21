type ScanInput = {
  hydration: number;
  texture: number;
  redness: number;
  sensitivity: number;
};

export type SkinAnalysisResult = {
  score: number;
  concerns: string[];
  summary: string;
};

export function analyzeSkin(input: ScanInput): SkinAnalysisResult {
  const weighted =
    input.hydration * 0.35 + input.texture * 0.25 + (100 - input.redness) * 0.2 + (100 - input.sensitivity) * 0.2;
  const score = Math.max(0, Math.min(100, Math.round(weighted)));

  const concerns: string[] = [];
  if (input.hydration < 45) concerns.push("dehydration");
  if (input.texture < 50) concerns.push("uneven texture");
  if (input.redness > 55) concerns.push("redness");
  if (input.sensitivity > 60) concerns.push("sensitivity");

  return {
    score,
    concerns,
    summary:
      concerns.length === 0
        ? "Your skin indicators look balanced. Maintain your routine and continue weekly scans."
        : `Primary focus areas: ${concerns.join(", ")}. Adjust your routine and track improvements over the next 2 weeks.`,
  };
}
