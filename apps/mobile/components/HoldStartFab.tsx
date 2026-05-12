// HoldStartFab — the center bottom-bar action. The deliberate path: press
// and hold for ~2.5s, a ring fills around the button, haptic ramps up, then
// the matter picker opens. Pick a matter → timer starts pre-bound to that
// matter and client. Cancel by releasing early.
//
// This is the "I'm starting work on something specific" gesture. The home
// quick-action "Start" is the looser path (general time, pick matter later).

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { MatterSheet } from '@/components/MatterSheet';
import { matters } from '@/lib/mock';
import { startTimer, useActiveTimer } from '@/lib/timer';
import { colors } from '@/lib/tokens';

const HOLD_MS = 3000;
const SIZE = 56;
const RING = 64;

export function HoldStartFab() {
  const router = useRouter();
  const active = useActiveTimer();
  const [pickerOpen, setPickerOpen] = useState(false);

  // 0 → 1 as the user holds; resets on release / cancel.
  const progress = useRef(new Animated.Value(0)).current;
  const cancelRef = useRef<() => void>(() => {});

  // If a timer is already running, the FAB becomes a "go back to timer" tap.
  const isRunning = !!active;

  const beginHold = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    anim.start(async ({ finished }) => {
      if (!finished) return;
      // Held all the way through → open the matter picker.
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      progress.setValue(0);
      setPickerOpen(true);
    });
    cancelRef.current = () => {
      anim.stop();
      Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    };
  };

  const endHold = () => {
    cancelRef.current?.();
  };

  const onTapWhileRunning = () => {
    router.push('/logged?mode=start');
  };

  const onPickMatter = (matterId: string) => {
    startTimer({ matterId, source: 'manual' });
    router.push({ pathname: '/logged', params: { mode: 'start', matterId } });
  };

  // Stroke length-style animation: rotate a partial ring to "fill" 0 → 360°.
  // Simpler approach: opacity + scale of the outer ring as a "charge" cue,
  // plus a small inner pulse on the button.
  const ringOpacity = progress.interpolate({
    inputRange: [0, 0.05, 1],
    outputRange: [0, 0.4, 1],
  });
  const ringScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.25],
  });
  const innerScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.94],
  });

  // Pulse the icon size up subtly as the hold completes.
  return (
    <>
      <Pressable
        onPress={isRunning ? onTapWhileRunning : undefined}
        onPressIn={isRunning ? undefined : beginHold}
        onPressOut={isRunning ? undefined : endHold}
        hitSlop={8}
        style={styles.wrap}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.chargeRing,
            { opacity: ringOpacity, transform: [{ scale: ringScale }] },
          ]}
        />
        <Animated.View style={[styles.button, { transform: [{ scale: innerScale }] }]}>
          {isRunning ? (
            <View style={styles.runningDot}>
              <View style={styles.runningSquare} />
            </View>
          ) : (
            <Ionicons name="add" size={28} color={colors.textOnAccent} />
          )}
        </Animated.View>
      </Pressable>

      <MatterSheet
        visible={pickerOpen}
        selectedId={matters[0].id}
        onPick={onPickMatter}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chargeRing: {
    position: 'absolute',
    width: RING + 18,
    height: RING + 18,
    borderRadius: (RING + 18) / 2,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  runningDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runningSquare: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
});
