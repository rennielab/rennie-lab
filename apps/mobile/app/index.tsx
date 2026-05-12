import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/Logo';
import { colors } from '@/lib/tokens';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    // Onboarding lives in /onboarding/[step] and is reachable from the
    // post-signup welcome flow. For day-to-day launches we go straight to
    // login so returning users don't re-permission every time.
    const t = setTimeout(() => router.replace('/login'), 1500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root}>
      <Logo height={36} />
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
});
