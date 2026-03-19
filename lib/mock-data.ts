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
  ingredientNames: string[];
  unknownIngredients: string[];
  verdictSummary: string;
  explanation: string;
  whyItMatches: string[];
  possibleConcerns: string[];
  recommendedFor: string[];
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
    ingredientNames: ['Ceramide NP', 'Panthenol', 'Glycerin', 'Niacinamide', 'Hyaluronic Acid'],
    unknownIngredients: [],
    verdictSummary:
      'A calm, barrier-friendly formula that looks highly compatible with your profile and daily routine goals.',
    explanation:
      'Strong for hydration and barrier comfort, with little in this ingredient mix suggesting major irritation risk.',
    whyItMatches: [
      'Ceramide NP and Panthenol support barrier comfort.',
      'Hyaluronic Acid and Glycerin reinforce hydration.',
      'Niacinamide adds extra support for tone and resilience.',
    ],
    possibleConcerns: ['The finish may feel richer if your skin is very oily in warm weather.'],
    recommendedFor: [
      'Barrier-supporting nightly routines',
      'Hydration-focused layering',
      'Combination skin that leans dehydrated',
    ],
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
    ingredientNames: ['Niacinamide', 'Vitamin C', 'Glycerin', 'Panthenol', 'Squalane'],
    unknownIngredients: [],
    verdictSummary:
      'This looks like a confident match for a glow-focused routine with a strong balance of support and low friction.',
    explanation:
      'Promising for glow and antioxidant support without leaning too harsh for everyday use.',
    whyItMatches: [
      'Vitamin C supports radiance and antioxidant protection.',
      'Niacinamide helps with tone, balance, and resilience.',
      'Panthenol keeps the formula from feeling overly sharp.',
    ],
    possibleConcerns: ['Some users may still want to patch test brightening products before daily use.'],
    recommendedFor: [
      'Morning glow routines',
      'Antioxidant-supporting product lineups',
      'Skin goals centered on brightness and clarity',
    ],
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
    ingredientNames: ['Retinol', 'Shea Butter', 'Fragrance', 'Panthenol'],
    unknownIngredients: ['Botanical Complex'],
    verdictSummary:
      'There is real upside here, but the formula brings enough friction points that it deserves a more careful read.',
    explanation:
      'Useful for texture and overnight renewal, but fragrance and a richer base may be less comfortable for reactive or breakout-prone skin.',
    whyItMatches: [
      'Retinol supports texture refinement and anti-aging goals.',
      'Panthenol adds some calming support around stronger actives.',
    ],
    possibleConcerns: [
      'Fragrance may irritate reactive skin.',
      'Shea Butter can feel heavy in breakout-prone routines.',
      'Retinol may increase dryness or sensitivity.',
    ],
    recommendedFor: [
      'Careful evening use',
      'Users prioritizing renewal over simplicity',
      'Routines that can support occasional retinol dryness',
    ],
  },
];
