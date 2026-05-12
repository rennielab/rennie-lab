import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { colors, font, radii, space } from '@/lib/tokens';

export default function ResetPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('jordan@bennetthayes.law');
  const [sent, setSent] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { paddingTop: insets.top + space.xl }]}>
      <Logo height={28} />

      <View style={{ marginTop: space.xxl, gap: space.sm }}>
        <Text style={styles.h1}>Reset password</Text>
        <Text style={styles.body}>
          Enter the email address associated with your account. We&apos;ll send you a link to reset your password.
        </Text>
      </View>

      <View style={{ marginTop: space.xxl, gap: space.sm }}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@mail.com"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <Pressable
        onPress={() => setSent(true)}
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }, { marginTop: space.lg }]}>
        <Text style={styles.ctaLabel}>{sent ? 'Link Sent ✓' : 'Send Reset Link'}</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
        <Text style={styles.backLabel}>Back to Login</Text>
      </Pressable>

      <View style={[styles.helpCard, { marginBottom: insets.bottom + space.lg }]}>
        <Text style={styles.helpTitle}>Can&apos;t access your account? </Text>
        <Text style={styles.helpBody}>Contact your firm administrator or IT support for assistance.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  h1: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  body: { color: colors.textSecondary, fontSize: font.size.base, lineHeight: 22 },
  label: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '500' },
  input: { backgroundColor: colors.bgSurface, color: colors.textPrimary, paddingHorizontal: space.lg, paddingVertical: space.lg, borderRadius: radii.md, fontSize: font.size.base, borderWidth: 1, borderColor: colors.border },
  cta: { backgroundColor: colors.accent, borderRadius: radii.lg, paddingVertical: 16, alignItems: 'center' },
  ctaLabel: { color: colors.textOnAccent, fontSize: font.size.md, fontWeight: '700' },
  back: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: space.lg },
  backLabel: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '500' },
  helpCard: { marginTop: 'auto', backgroundColor: colors.bgSurface, borderRadius: radii.lg, padding: space.lg, gap: 2, borderWidth: 1, borderColor: colors.border },
  helpTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: font.size.sm },
  helpBody: { color: colors.textSecondary, fontSize: font.size.sm },
});
