import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { createDefaultPlanState, getRemainingFreeAnalyses, loadPlanState, persistPlanState, FREE_ANALYSIS_LIMIT, normalizePlanState } from './plan-storage';
import { PlanState, UserPlan } from './types';

type ConsumeAnalysisResult = {
  allowed: boolean;
  remaining: number;
};

type PlanContextValue = {
  planState: PlanState;
  isHydrated: boolean;
  currentPlan: UserPlan;
  isPremium: boolean;
  remainingAnalyses: number;
  dailyFreeLimit: number;
  consumeAnalysis: () => Promise<ConsumeAnalysisResult>;
  upgradeToPremium: () => Promise<void>;
};

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: PropsWithChildren) {
  const [planState, setPlanState] = useState<PlanState>(createDefaultPlanState());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function hydratePlanState() {
      const persistedState = await loadPlanState();
      const normalizedState = await persistPlanState(persistedState);
      setPlanState(normalizedState);
      setIsHydrated(true);
    }

    void hydratePlanState();
  }, []);

  const value = useMemo<PlanContextValue>(
    () => ({
      planState,
      isHydrated,
      currentPlan: planState.plan,
      isPremium: planState.plan === 'premium',
      remainingAnalyses: getRemainingFreeAnalyses(planState),
      dailyFreeLimit: FREE_ANALYSIS_LIMIT,
      async consumeAnalysis() {
        const normalizedState = normalizePlanState(planState);

        if (normalizedState.plan === 'premium') {
          if (normalizedState.usageDate !== planState.usageDate) {
            const persisted = await persistPlanState(normalizedState);
            setPlanState(persisted);
          }

          return {
            allowed: true,
            remaining: Infinity,
          };
        }

        const remaining = getRemainingFreeAnalyses(normalizedState);

        if (remaining <= 0) {
          if (normalizedState.usageDate !== planState.usageDate) {
            const persisted = await persistPlanState(normalizedState);
            setPlanState(persisted);
          }

          return {
            allowed: false,
            remaining: 0,
          };
        }

        const nextState = {
          ...normalizedState,
          analysesUsed: normalizedState.analysesUsed + 1,
        };
        const persisted = await persistPlanState(nextState);
        setPlanState(persisted);

        return {
          allowed: true,
          remaining: getRemainingFreeAnalyses(persisted),
        };
      },
      async upgradeToPremium() {
        const nextState = {
          ...normalizePlanState(planState),
          plan: 'premium' as const,
        };
        const persisted = await persistPlanState(nextState);
        setPlanState(persisted);
      },
    }),
    [isHydrated, planState]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }

  return context;
}
