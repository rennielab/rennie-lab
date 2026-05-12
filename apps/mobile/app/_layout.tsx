import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/lib/tokens';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'fade',
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="call" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="processing" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="review" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="submitted" options={{ animation: 'fade' }} />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
