import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useAppFonts } from '@/theme/typography';
import { useAppTheme } from '@/theme/colors';
import { RoutineDataProvider } from '@/state/routine-store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const { colors, isDark } = useAppTheme();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <RoutineDataProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="routine/[id]"
            options={{ presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.92] }}
          />
          <Stack.Screen
            name="task/[id]"
            options={{ presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.92] }}
          />
        </Stack>
      </RoutineDataProvider>
    </GestureHandlerRootView>
  );
}
