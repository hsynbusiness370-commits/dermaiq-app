import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import { defaultUser } from './mock-data';
import { SkinGoal, SkinType, UserProfile, UserSensitivity } from './types';

type PreferencesContextValue = {
  name: string;
  skinType: SkinType;
  skinGoal: SkinGoal;
  subscriptionStatus: string;
  userProfile: UserProfile;
  setSkinType: (value: SkinType) => void;
  setSkinGoal: (value: SkinGoal) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function deriveSensitivities(skinType: SkinType): UserSensitivity[] {
  switch (skinType) {
    case 'Dry':
      return ['dryness', 'drying alcohols'];
    case 'Oily':
      return ['pore clogging'];
    case 'Combination':
      return ['pore clogging'];
    case 'Sensitive':
      return ['irritation', 'fragrance'];
    default:
      return [];
  }
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [skinType, setSkinType] = useState<SkinType>(defaultUser.skinType);
  const [skinGoal, setSkinGoal] = useState<SkinGoal>(defaultUser.skinGoal);
  const userProfile = useMemo<UserProfile>(
    () => ({
      skinType,
      goals: [skinGoal],
      sensitivities: deriveSensitivities(skinType),
    }),
    [skinGoal, skinType]
  );

  const value = useMemo(
    () => ({
      name: defaultUser.name,
      skinType,
      skinGoal,
      subscriptionStatus: defaultUser.subscriptionStatus,
      userProfile,
      setSkinType,
      setSkinGoal,
    }),
    [skinGoal, skinType, userProfile]
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
