import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, font, space } from '@/lib/tokens';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/login'), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root}>
      <View style={styles.brand}>
        <Text style={styles.wordmark}>CLOCKD</Text>
        <Text style={styles.tagline}>Time tracking for lawyers</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  brand: {
    alignItems: 'center',
    gap: space.sm,
  },
  wordmark: {
    color: colors.accent,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: font.size.base,
    fontWeight: '400',
  },
});
