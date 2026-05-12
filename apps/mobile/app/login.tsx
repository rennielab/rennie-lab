import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('jordan@bennetthayes.law');
  const [password, setPassword] = useState('demopass');
  const [reveal, setReveal] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.root, { paddingTop: insets.top + space.xl }]}>
      <Logo height={28} />

      <View style={{ marginTop: space.xxl, gap: space.sm }}>
        <Text style={styles.h1}>Login to your account</Text>
        <Text style={styles.subtitle}>Please enter your email and password to log in.</Text>
      </View>

      <View style={{ marginTop: space.xl, gap: space.lg }}>
        <View style={{ gap: space.sm }}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@mail.com"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </View>
        </View>
        <View style={{ gap: space.sm }}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!reveal}
              style={styles.input}
            />
            <Pressable onPress={() => setReveal((r) => !r)} hitSlop={10}>
              <Ionicons name={reveal ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <Pressable hitSlop={8} onPress={() => router.push('/reset-password')}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: space.xl }}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.ctaLabel}>Login</Text>
        </Pressable>
      </View>

      <View style={[styles.helpCard, { marginBottom: insets.bottom + space.lg }]}>
        <Text style={styles.helpTitle}>Can&apos;t access your account? </Text>
        <Text style={styles.helpBody}>Contact your firm administrator or IT support for assistance.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  h1: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: font.size.base },
  label: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '500' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgSurface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: space.lg },
  input: { flex: 1, color: colors.textPrimary, paddingVertical: space.lg, fontSize: font.size.base },
  forgot: { color: colors.warning, fontSize: font.size.sm, fontWeight: '500' },
  cta: { backgroundColor: colors.accent, borderRadius: radii.lg, paddingVertical: 16, alignItems: 'center' },
  ctaLabel: { color: colors.textOnAccent, fontSize: font.size.md, fontWeight: '700' },
  helpCard: { marginTop: 'auto', backgroundColor: colors.bgSurface, borderRadius: radii.lg, padding: space.lg, gap: 2, borderWidth: 1, borderColor: colors.border },
  helpTitle: { color: colors.textPrimary, fontWeight: '600', fontSize: font.size.sm },
  helpBody: { color: colors.textSecondary, fontSize: font.size.sm },
});
