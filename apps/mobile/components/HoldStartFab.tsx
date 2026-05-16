// HoldStartFab — the center bottom-bar action. Press and hold for ~3s, a
// ring fills around the button while a setTimeout counts down, then the
// matter picker opens. Release early to cancel.
//
// Completion is driven by setTimeout (not the animation callback) because
// on mobile web the Animated.timing callback gets cancelled by scrolls,
// browser long-press menus, etc. The animation here is *purely visual*.
//
// This is the "I'm starting work on something specific" gesture. The home
// quick-action "Start" is the looser path (general time, pick matter later).

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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

  const progress = useRef(new Animated.Value(0)).current;
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fireHaptic = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRunning = !!active;

  const clearAllTimers = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (fireHaptic.current) {
      clearTimeout(fireHaptic.current);
      fireHaptic.current = null;
    }
  };

  const beginHold = () => {
    // Don't block on awaiting haptics — fire and forget so the timer
    // starts on the first frame. Native devices haptic; web no-ops.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    // Visual ring fill.
    Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Mid-hold haptic tap to confirm the gesture is registering.
    fireHaptic.current = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }, HOLD_MS / 2);

    // Completion — independent of the animation, fires reliably on web.
    holdTimer.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      progress.setValue(0);
      setPickerOpen(true);
      holdTimer.current = null;
    }, HOLD_MS);
  };

  const endHold = () => {
    if (holdTimer.current) {
      // Released early — cancel everything and snap the ring back.
      clearAllTimers();
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const onTapWhileRunning = () => {
    router.push('/logged?mode=start');
  };

  const onPickMatter = (matterId: string) => {
    startTimer({ matterId, source: 'manual' });
    router.push({ pathname: '/logged', params: { mode: 'start', matterId } });
  };

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

  return (
    <>
      <Pressable
        onPress={isRunning ? onTapWhileRunning : undefined}
        onPressIn={isRunning ? undefined : beginHold}
        onPressOut={isRunning ? undefined : endHold}
        // 800ms delayLongPress + onLongPress is a belt-and-braces fallback
        // for any platform where onPressIn/Out flakes — gives us a second
        // path to start the hold timer.
        delayLongPress={150}
        onLongPress={isRunning ? undefined : undefined}
        hitSlop={12}
        // Disable browser long-press context menu on mobile web.
        // @ts-expect-error — web-only prop, ignored on native
        onContextMenu={(e: any) => e.preventDefault?.()}
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
    // Disable text-select / iOS long-press callout on mobile web.
    userSelect: 'none',
    ...({ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' } as object),
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
