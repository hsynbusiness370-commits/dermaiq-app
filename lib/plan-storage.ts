import AsyncStorage from '@react-native-async-storage/async-storage';

import { PlanState } from './types';

const PLAN_STATE_KEY = '@dermaiq/plan-state';
export const FREE_ANALYSIS_LIMIT = 3;

function getTodayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultPlanState(): PlanState {
  return {
    plan: 'free',
    analysesUsed: 0,
    usageDate: getTodayKey(),
  };
}

export function normalizePlanState(planState: PlanState): PlanState {
  const todayKey = getTodayKey();

  if (planState.usageDate !== todayKey) {
    return {
      ...planState,
      analysesUsed: 0,
      usageDate: todayKey,
    };
  }

  return planState;
}

export async function loadPlanState() {
  const rawValue = await AsyncStorage.getItem(PLAN_STATE_KEY);

  if (!rawValue) {
    return createDefaultPlanState();
  }

  try {
    return normalizePlanState(JSON.parse(rawValue) as PlanState);
  } catch {
    return createDefaultPlanState();
  }
}

export async function persistPlanState(planState: PlanState) {
  const normalized = normalizePlanState(planState);
  await AsyncStorage.setItem(PLAN_STATE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function getRemainingFreeAnalyses(planState: PlanState) {
  if (planState.plan === 'premium') {
    return Infinity;
  }

  return Math.max(0, FREE_ANALYSIS_LIMIT - normalizePlanState(planState).analysesUsed);
}
