import { ProductVerdict, SkinGoal, SkinType } from './types';

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
  verdict: ProductVerdict;
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
