import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import { defaultUser, SkinGoal, SkinType } from './mock-data';

type PreferencesContextValue = {
  name: string;
  skinType: SkinType;
  skinGoal: SkinGoal;
  subscriptionStatus: string;
  setSkinType: (value: SkinType) => void;
  setSkinGoal: (value: SkinGoal) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [skinType, setSkinType] = useState<SkinType>(defaultUser.skinType);
  const [skinGoal, setSkinGoal] = useState<SkinGoal>(defaultUser.skinGoal);

  const value = useMemo(
    () => ({
      name: defaultUser.name,
      skinType,
      skinGoal,
      subscriptionStatus: defaultUser.subscriptionStatus,
      setSkinType,
      setSkinGoal,
    }),
    [skinGoal, skinType]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }

  return context;
}
