import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { clearSavedAnalysesFromStorage, loadSavedAnalyses, removeSavedAnalysisFromStorage, saveAnalysisToStorage } from './storage';
import { ManualAnalysisPayload, SavedAnalysis } from './types';

type SavedAnalysesContextValue = {
  savedAnalyses: SavedAnalysis[];
  isHydrated: boolean;
  saveAnalysis: (payload: ManualAnalysisPayload) => Promise<{ savedAnalysis: SavedAnalysis; wasDuplicate: boolean }>;
  removeSavedAnalysis: (savedAnalysisId: string) => Promise<void>;
  clearSavedAnalyses: () => Promise<void>;
  isAnalysisSaved: (payload: ManualAnalysisPayload) => boolean;
};

const SavedAnalysesContext = createContext<SavedAnalysesContextValue | null>(null);

export function SavedAnalysesProvider({ children }: PropsWithChildren) {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function hydrateSavedAnalyses() {
      const persistedAnalyses = await loadSavedAnalyses();
      setSavedAnalyses(persistedAnalyses);
      setIsHydrated(true);
    }

    void hydrateSavedAnalyses();
  }, []);

  const value = useMemo<SavedAnalysesContextValue>(
    () => ({
      savedAnalyses,
      isHydrated,
      async saveAnalysis(payload) {
        const result = await saveAnalysisToStorage(payload, savedAnalyses);
        setSavedAnalyses(result.savedAnalyses);
        return {
          savedAnalysis: result.savedAnalysis,
          wasDuplicate: result.wasDuplicate,
        };
      },
      async removeSavedAnalysis(savedAnalysisId) {
        const nextSavedAnalyses = await removeSavedAnalysisFromStorage(savedAnalysisId, savedAnalyses);
        setSavedAnalyses(nextSavedAnalyses);
      },
      async clearSavedAnalyses() {
        await clearSavedAnalysesFromStorage();
        setSavedAnalyses([]);
      },
      isAnalysisSaved(payload) {
        const rawInput = payload.rawInput.trim().toLowerCase();
        const matchedNames = payload.matchedIngredients.map((ingredient) => ingredient.name.trim().toLowerCase()).sort();
        const unknownIngredients = payload.unknownIngredients.map((ingredient) => ingredient.trim().toLowerCase()).sort();

        return savedAnalyses.some((savedAnalysis) => {
          const savedMatched = savedAnalysis.matchedIngredients
            .map((ingredient) => ingredient.name.trim().toLowerCase())
            .sort();
          const savedUnknown = savedAnalysis.unknownIngredients.map((ingredient) => ingredient.trim().toLowerCase()).sort();

          return (
            savedAnalysis.rawInput.trim().toLowerCase() === rawInput &&
            JSON.stringify(savedMatched) === JSON.stringify(matchedNames) &&
            JSON.stringify(savedUnknown) === JSON.stringify(unknownIngredients)
          );
        });
      },
    }),
    [isHydrated, savedAnalyses]
  );

  return <SavedAnalysesContext.Provider value={value}>{children}</SavedAnalysesContext.Provider>;
}

export function useSavedAnalyses() {
  const context = useContext(SavedAnalysesContext);

  if (!context) {
    throw new Error('useSavedAnalyses must be used within a SavedAnalysesProvider');
  }

  return context;
}
