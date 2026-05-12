import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { currentLawyer, firm } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

const items = [
  { icon: 'person-outline', label: 'Personal Details' },
  { icon: 'business-outline', label: 'Firm Settings' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'lock-closed-outline', label: 'Privacy & Security' },
  { icon: 'card-outline', label: 'Subscription' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
] as const;

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + space.xxxl }}>
      <Text style={styles.h1}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentLawyer.initials}</Text>
        </View>
        <Text style={styles.name}>{currentLawyer.name}</Text>
        <Text style={styles.role}>
          {currentLawyer.role} · {firm.name}
        </Text>
      </View>

      <View style={styles.list}>
        {items.map((it) => (
          <Pressable key={it.label} style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}>
            <View style={styles.itemIcon}>
              <Ionicons name={it.icon as any} size={18} color={colors.accent} />
            </View>
            <Text style={styles.itemLabel}>{it.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.logout, pressed && { opacity: 0.85 }]}
        onPress={() => router.replace('/login')}>
        <Text style={styles.logoutLabel}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  h1: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700', marginBottom: space.lg },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.xl,
    padding: space.xxl,
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  avatarText: { color: colors.accent, fontSize: 24, fontWeight: '700' },
  name: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '700' },
  role: { color: colors.textSecondary, fontSize: font.size.sm },
  list: { marginTop: space.lg, backgroundColor: colors.bgElevated, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: { flex: 1, color: colors.textPrimary, fontSize: font.size.base, fontWeight: '500' },
  logout: {
    marginTop: space.xxl,
    backgroundColor: colors.dangerSoft,
    borderRadius: radii.lg,
    paddingVertical: space.lg,
    alignItems: 'center',
  },
  logoutLabel: { color: colors.danger, fontWeight: '600', fontSize: font.size.base },
});
