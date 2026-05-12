import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { currentLawyer, firm } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const MENU: { icon: IconName; label: string; danger?: boolean }[] = [
  { icon: 'person-circle-outline', label: 'Profile' },
  { icon: 'notifications-outline', label: 'Notification Settings' },
  { icon: 'information-circle-outline', label: 'About / Legal' },
  { icon: 'book-outline', label: 'Term & conditions' },
  { icon: 'log-out-outline', label: 'Log out', danger: true },
];

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.root]}
      contentContainerStyle={{ paddingTop: insets.top + space.md, paddingBottom: 160, paddingHorizontal: space.xxl }}>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentLawyer.initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{currentLawyer.name}</Text>
          <Text style={styles.role}>{currentLawyer.role}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {MENU.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={() => {
              if (item.danger) router.replace('/login');
            }}
            style={[styles.menuItem, i < MENU.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
            <Ionicons
              name={item.icon}
              size={20}
              color={item.danger ? colors.danger : colors.textPrimary}
            />
            <Text style={[styles.menuLabel, item.danger && { color: colors.danger }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.version}>Clockd v1.0.0</Text>
      <Text style={[styles.version, { marginTop: 2, fontSize: 11 }]}>{firm.name}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  identity: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.lg },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.accent, fontWeight: '700', fontSize: font.size.sm },
  name: { color: colors.textPrimary, fontSize: font.size.xl, fontWeight: '700' },
  role: { color: colors.textSecondary, fontSize: font.size.sm, marginTop: 2 },
  card: { backgroundColor: colors.bgElevated, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.lg },
  menuLabel: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '500' },
  version: { color: colors.textTertiary, fontSize: font.size.sm, textAlign: 'center', marginTop: space.xl },
});
