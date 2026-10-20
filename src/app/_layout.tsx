import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { theme } from '../theme/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.canvas },
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: theme.fontWeight.semibold,
            color: theme.colors.text,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.canvas },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="member/[id]" options={{ title: 'Member' }} />
        <Stack.Screen name="paywall" options={{ title: 'FitTrack Pro', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
