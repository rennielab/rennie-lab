import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors, font, space } from '@/lib/tokens';

export default function Processing() {
  const router = useRouter();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  useEffect(() => {
    const done = setTimeout(() => router.replace('/logged?mode=review'), 4000);
    return () => clearTimeout(done);
  }, [router]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.06] });

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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xxl },
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 140, height: 140, marginBottom: space.xl },
  iconPulse: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: colors.accent },
  iconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.accentSoft },
  title: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: font.size.base, marginTop: space.sm, textAlign: 'center' },
});
