export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Sensitive';
export type SkinGoal = 'Acne' | 'Anti-aging' | 'Hydration' | 'Glow';

export type ScanHistoryItem = {
  id: string;
  productName: string;
  brand: string;
  category: string;
  scannedAt: string;
  summary: string;
  safetyScore: number;
  skinMatchScore: number;
  effectivenessScore: number;
  verdict: 'Great Match' | 'Use with Caution' | 'Not Ideal';
  status: 'Complete' | 'Needs review' | 'Saved';
};

export const skinTypes: SkinType[] = ['Dry', 'Oily', 'Combination', 'Sensitive'];
export const skinGoals: SkinGoal[] = ['Acne', 'Anti-aging', 'Hydration', 'Glow'];

export const defaultUser = {
  name: 'Ava',
  skinType: 'Combination' as SkinType,
  skinGoal: 'Glow' as SkinGoal,
  subscriptionStatus: 'Free',
};

export const dailyTip =
  'Layer hydration on slightly damp skin to help humectants draw in moisture without leaving the finish heavy.';

export const recentScans: ScanHistoryItem[] = [
  {
    id: 'scan-1',
    productName: 'Barrier Repair Serum',
    brand: 'Luma Skin Lab',
    category: 'Serum',
    scannedAt: 'Today, 8:42 AM',
    summary: 'Gentle formula with a calming ceramide blend.',
    safetyScore: 94,
    skinMatchScore: 89,
    effectivenessScore: 90,
    verdict: 'Great Match',
    status: 'Saved',
  },
  {
    id: 'scan-2',
    productName: 'Daily Defense SPF 50',
    brand: 'Studio Sol',
    category: 'Sunscreen',
    scannedAt: 'Yesterday, 6:15 PM',
    summary: 'Lightweight protection with low irritation risk.',
    safetyScore: 91,
    skinMatchScore: 86,
    effectivenessScore: 93,
    verdict: 'Great Match',
    status: 'Complete',
  },
  {
    id: 'scan-3',
    productName: 'Night Renewal Cream',
    brand: 'Aurea Clinical',
    category: 'Moisturizer',
    scannedAt: 'Mar 15, 9:03 PM',
    summary: 'Hydrating overnight cream with peptide support.',
    safetyScore: 88,
    skinMatchScore: 84,
    effectivenessScore: 87,
    verdict: 'Use with Caution',
    status: 'Needs review',
  },
];

export const resultPreview = {
  productName: 'Calm Balance Cleanser',
  brand: 'Luma Skin Lab',
  category: 'Low-foam gel cleanser',
  safetyScore: 92,
  skinMatchScore: 88,
  effectivenessScore: 85,
  verdict: 'Great Match' as const,
  verdictSummary:
    'This formula looks notably compatible with your profile thanks to its low-irritation cleansing base and barrier-supportive hydration.',
  explanation:
    'DermaIQ sees a balanced, low-irritation cleanser profile with ingredients that support a calm barrier and daily hydration. This preview UI is intentionally static until analysis logic is connected.',
  whyItMatches: [
    'Low-friction cleansing surfactants feel suitable for everyday use.',
    'Hydration-focused ingredients support your glow and barrier goals.',
    'No obvious high-risk irritants stand out in this preview.',
  ],
  possibleConcerns: [
    'Sensitive skin users may still want to patch test near the jawline first.',
    'The finish may feel slightly rich for very oily summer routines.',
  ],
  recommendedFor: [
    'Daily morning cleanse',
    'Hydration-supporting routines',
    'Combination skin that leans dehydrated',
  ],
};
