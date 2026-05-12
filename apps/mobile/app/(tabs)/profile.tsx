import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { currentLawyer, firm } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const MENU: { icon: IconName; label: string; danger?: boolean }[] = [
  { icon: 'person-circle-outline', label: 'Edit profile' },
  { icon: 'call-outline', label: 'Calling & voicemail' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & security' },
  { icon: 'information-circle-outline', label: 'About Clockd' },
  { icon: 'log-out-outline', label: 'Log out', danger: true },
];

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + space.md,
        paddingBottom: 160,
        paddingHorizontal: space.xxl,
      }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.identity}>
        <Avatar
          size={72}
          avatarKey={currentLawyer.avatarKey}
          initials={currentLawyer.initials}
          ring
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{currentLawyer.name}</Text>
          <Text style={styles.role}>
            {currentLawyer.role} · {firm.name}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Pill icon="call" label="(415) 555-0199" />
        <Pill icon="mail" label="sophia@bennett…" />
      </View>

      <View style={styles.card}>
        {MENU.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={() => {
              if (item.danger) router.replace('/login');
            }}
            style={[
              styles.menuItem,
              i < MENU.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}>
            <View
              style={[
                styles.menuIcon,
                item.danger && { backgroundColor: colors.dangerSoft },
              ]}>
              <Ionicons
                name={item.icon}
                size={18}
                color={item.danger ? colors.danger : colors.textPrimary}
              />
            </View>
            <Text style={[styles.menuLabel, item.danger && { color: colors.danger }]}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.version}>Clockd v1.0.0</Text>
      <Text style={[styles.version, { marginTop: 2, fontSize: 11 }]}>{firm.name}</Text>
    </ScrollView>
  );
}

function Pill({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={12} color={colors.accent} />
      <Text style={styles.pillLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  identity: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginBottom: space.lg },
  name: { color: colors.textPrimary, fontSize: font.size.xl, fontWeight: '700' },
  role: { color: colors.textSecondary, fontSize: font.size.sm, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: space.xl },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.pill,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillLabel: { color: colors.textSecondary, fontSize: font.size.xs, flex: 1, fontWeight: '500' },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: font.size.base,
    fontWeight: '500',
  },
  version: {
    color: colors.textTertiary,
    fontSize: font.size.sm,
    textAlign: 'center',
    marginTop: space.xl,
  },
});
