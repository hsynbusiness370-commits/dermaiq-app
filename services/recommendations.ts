import type { SkinAnalysisResult } from "@/services/skin-analysis";

type ProductRecommendation = {
  name: string;
  reason: string;
  category: "cleanser" | "serum" | "moisturizer" | "spf";
};

const CATALOG: ProductRecommendation[] = [
  { name: "Barrier Calm Gel Cleanser", reason: "supports sensitive skin", category: "cleanser" },
  { name: "Hydra Bounce HA Serum", reason: "boosts hydration retention", category: "serum" },
  { name: "Ceramide Recovery Cream", reason: "reinforces skin barrier", category: "moisturizer" },
  { name: "Daily Shield SPF 50", reason: "protects from UV-triggered redness", category: "spf" },
];

export function buildRecommendations(analysis: SkinAnalysisResult) {
  if (analysis.concerns.includes("dehydration")) {
    return CATALOG.filter((item) => item.category !== "cleanser");
  }

  if (analysis.concerns.includes("redness") || analysis.concerns.includes("sensitivity")) {
    return CATALOG.filter((item) => item.category !== "serum");
  }

  return CATALOG;
}
