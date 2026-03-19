export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Sensitive';
export type SkinGoal = 'Acne' | 'Anti-aging' | 'Hydration' | 'Glow';

export type ScanHistoryItem = {
  id: string;
  productName: string;
  category: string;
  scannedAt: string;
  summary: string;
  safetyScore: number;
  skinMatchScore: number;
  effectivenessScore: number;
};

export const skinTypes: SkinType[] = ['Dry', 'Oily', 'Combination', 'Sensitive'];
export const skinGoals: SkinGoal[] = ['Acne', 'Anti-aging', 'Hydration', 'Glow'];

export const defaultUser = {
  name: 'Ava',
  skinType: 'Combination' as SkinType,
  skinGoal: 'Glow' as SkinGoal,
  subscriptionStatus: 'Free',
};

export const recentScans: ScanHistoryItem[] = [
  {
    id: 'scan-1',
    productName: 'Barrier Repair Serum',
    category: 'Serum',
    scannedAt: 'Today, 8:42 AM',
    summary: 'Gentle formula with a calming ceramide blend.',
    safetyScore: 94,
    skinMatchScore: 89,
    effectivenessScore: 90,
  },
  {
    id: 'scan-2',
    productName: 'Daily Defense SPF 50',
    category: 'Sunscreen',
    scannedAt: 'Yesterday, 6:15 PM',
    summary: 'Lightweight protection with low irritation risk.',
    safetyScore: 91,
    skinMatchScore: 86,
    effectivenessScore: 93,
  },
  {
    id: 'scan-3',
    productName: 'Night Renewal Cream',
    category: 'Moisturizer',
    scannedAt: 'Mar 15, 9:03 PM',
    summary: 'Hydrating overnight cream with peptide support.',
    safetyScore: 88,
    skinMatchScore: 84,
    effectivenessScore: 87,
  },
];

export const resultPreview = {
  productName: 'Calm Balance Cleanser',
  brand: 'Luma Skin Lab',
  safetyScore: 92,
  skinMatchScore: 88,
  effectivenessScore: 85,
  explanation:
    'DermaIQ sees a balanced, low-irritation cleanser profile with ingredients that support a calm barrier and daily hydration. This preview UI is intentionally static until analysis logic is connected.',
};
