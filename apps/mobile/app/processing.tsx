import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors, font, space } from '@/lib/tokens';

const STEPS = [
  'Connecting to call',
  'Transcribing audio',
  'Identifying matter',
  'Drafting time entry',
];

export default function Processing() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(0)).current;
  const stepRef = useRef(0);
  const stepOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  useEffect(() => {
    const interval = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % STEPS.length;
      Animated.sequence([
        Animated.timing(stepOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(stepOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }, 1100);
    const done = setTimeout(() => router.replace('/review'), 4400);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [router, stepOpacity]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.08] });

  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Animated.View style={[styles.iconPulse, { transform: [{ scale }], opacity }]} />
        <View style={styles.iconCircle}>
          <Ionicons name="call" size={32} color={colors.accent} />
        </View>
      </View>

      <Text style={styles.title}>Processing Call</Text>
      <Text style={styles.subtitle}>Logging time to the correct matter.</Text>

      <Animated.View style={[styles.stepRow, { opacity: stepOpacity }]}>
        <View style={styles.stepDot} />
        <Text style={styles.stepText}>{STEPS[stepRef.current]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xxl },
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 140, height: 140, marginBottom: space.xl },
  iconPulse: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: colors.accent },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accentSoft,
  },
  title: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: font.size.base, marginTop: space.sm, textAlign: 'center' },
  stepRow: {
    marginTop: space.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm + 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  stepText: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '500' },
});
