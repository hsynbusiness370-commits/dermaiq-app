import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PreferencesProvider } from '@/lib/preferences-context';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <PreferencesProvider>
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
    </PreferencesProvider>
  );
}
