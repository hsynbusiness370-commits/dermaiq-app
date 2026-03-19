import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PlanProvider } from '@/lib/plan-context';
import { PreferencesProvider } from '@/lib/preferences-context';
import { SavedAnalysesProvider } from '@/lib/saved-analyses-context';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <PlanProvider>
      <PreferencesProvider>
        <SavedAnalysesProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="result"
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="premium"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </SavedAnalysesProvider>
      </PreferencesProvider>
    </PlanProvider>
  );
}
