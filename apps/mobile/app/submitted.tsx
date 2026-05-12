import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, font, radii, space } from '@/lib/tokens';

export default function Submitted() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
        <Ionicons name="checkmark" size={48} color={colors.bg} />
      </Animated.View>

      <Animated.View style={{ opacity, alignItems: 'center', gap: space.sm, marginTop: space.xxl }}>
        <Text style={styles.title}>Entry Submitted</Text>
        <Text style={styles.subtitle}>Sent to your firm admin for approval.</Text>
      </Animated.View>

      <Animated.View style={[styles.card, { opacity }]}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Status</Text>
          <View style={styles.pending}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>Pending approval</Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Reviewed by</Text>
          <Text style={styles.cardValue}>Marcus Hayes</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Expected</Text>
          <Text style={styles.cardValue}>Within 24 hours</Text>
        </View>
      </Animated.View>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }, { marginBottom: insets.bottom + space.lg }]}
        onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.ctaLabel}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xxl },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: font.size.base },
  card: {
    width: '100%',
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    padding: space.lg,
    marginTop: space.xxxl,
    gap: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: colors.textSecondary, fontSize: font.size.sm },
  cardValue: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600' },
  pending: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pendingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  pendingText: { color: colors.warning, fontSize: font.size.sm, fontWeight: '600' },
  cta: {
    position: 'absolute',
    bottom: 0,
    left: space.xxl,
    right: space.xxl,
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: space.lg,
    alignItems: 'center',
  },
  ctaLabel: { color: colors.textOnAccent, fontSize: font.size.md, fontWeight: '600' },
});
