import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/Logo';
import { colors } from '@/lib/tokens';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/onboarding/1'), 1500);
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
