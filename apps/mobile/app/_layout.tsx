import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/lib/tokens';

// Respect iOS Dynamic Type, but cap it: dense surfaces (keypad, pill
// slider, tab bar) break past ~115%. Found in the wild on Dana's phone —
// larger system text size made segment labels clip and the keypad
// overlap the slider.
type ScalableDefaults = { defaultProps?: { maxFontSizeMultiplier?: number } };
const TextWithDefaults = Text as unknown as ScalableDefaults;
const TextInputWithDefaults = TextInput as unknown as ScalableDefaults;
TextWithDefaults.defaultProps = { ...TextWithDefaults.defaultProps, maxFontSizeMultiplier: 1.15 };
TextInputWithDefaults.defaultProps = { ...TextInputWithDefaults.defaultProps, maxFontSizeMultiplier: 1.15 };

export default function RootLayout() {
  // Load the Ionicons font for web. On native this is auto-linked at build
  // time, but in the web export the browser has no way to fetch the glyph
  // file unless we declare it here. Without this, every icon renders as the
  // missing-glyph X.
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) return null;

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
          <Stack.Screen name="onboarding/[step]" />
          <Stack.Screen name="login" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="call" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="processing" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="logged" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="log-entry" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="entry/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
