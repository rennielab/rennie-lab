import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { colors, font, radii, space } from '@/lib/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const STEPS: { icon: IconName; title: string[]; body: string; cta: string; next: string }[] = [
  { icon: 'person-outline', title: ['Access', 'Contacts'], body: 'So we know who your clients are.', cta: 'Allow Contacts', next: '/onboarding/2' },
  { icon: 'call-outline', title: ['Access', 'Phone'], body: 'So we capture every call automatically.', cta: 'Allow Phone Access', next: '/onboarding/3' },
  { icon: 'notifications-outline', title: ['Enable', 'Notifications'], body: 'So we remind you when something needs review.', cta: 'Allow Notifications', next: '/onboarding/4' },
  { icon: 'checkmark', title: ["You're", 'Set.'], body: 'Make a call and see what happens.', cta: 'Open Clockd', next: '/login' },
];

export default function OnboardingStep() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const idx = Math.max(0, Math.min(STEPS.length - 1, Number(step ?? 1) - 1));
  const config = STEPS[idx];

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.progressSegment, i <= idx && styles.progressFilled]} />
        ))}
      </View>

      <View style={styles.logoWrap}>
        <Logo height={28} />
      </View>

      <View style={styles.spacer} />

      <View style={styles.iconCircle}>
        <Ionicons name={config.icon} size={32} color={colors.accent} />
      </View>

      <View style={{ paddingHorizontal: space.xxl, marginTop: space.lg }}>
        <Text style={styles.title}>{config.title[0]}</Text>
        <Text style={styles.title}>{config.title[1]}</Text>
        <Text style={styles.body}>{config.body}</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        <Pressable
          onPress={() => router.replace(config.next as any)}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}>
          <Text style={styles.ctaLabel}>{config.cta}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: space.lg },
  progressSegment: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 1 },
  progressFilled: { backgroundColor: colors.textPrimary },
  logoWrap: { marginBottom: space.lg },
  spacer: { flex: 1, minHeight: 60 },
  iconCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.textPrimary, fontSize: 40, fontWeight: '800', lineHeight: 46 },
  body: { color: colors.textSecondary, fontSize: font.size.base, marginTop: space.md },
  footer: { paddingTop: space.lg },
  cta: { backgroundColor: colors.accent, borderRadius: radii.lg, paddingVertical: 16, alignItems: 'center' },
  ctaLabel: { color: colors.textOnAccent, fontSize: font.size.md, fontWeight: '700' },
});
