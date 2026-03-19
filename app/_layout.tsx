import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PreferencesProvider } from '@/lib/preferences-context';
import { SavedAnalysesProvider } from '@/lib/saved-analyses-context';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
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
        </Stack>
      </SavedAnalysesProvider>
    </PreferencesProvider>
  );
}
