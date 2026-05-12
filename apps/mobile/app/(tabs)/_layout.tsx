import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, space } from '@/lib/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'index', label: 'Activities', icon: 'time-outline' },
  { name: 'directory', label: 'Directory', icon: 'folder-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <ClockdTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="directory" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function ClockdTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentRoute = state.routes[state.index].name;

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + space.sm }]} pointerEvents="box-none">
      <View style={styles.pill}>
        {TABS.map((tab) => {
          const active = currentRoute === tab.name;
          return (
            <Pressable
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              style={[styles.tab, active && styles.tabActive]}
              hitSlop={8}>
              <Ionicons name={active ? (tab.icon.replace('-outline', '') as IconName) : tab.icon} size={18} color={active ? colors.textOnAccent : colors.textSecondary} />
              {active && <Text style={styles.tabLabel}>{tab.label}</Text>}
              {!active && <Text style={styles.tabLabelInactive}>{tab.label}</Text>}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => router.push('/logged?mode=start')}
        style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.95 }] }]}>
        <Ionicons name="add" size={28} color={colors.textOnAccent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    gap: space.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radii.pill,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.accent, flex: 1.4 },
  tabLabel: { color: colors.textOnAccent, fontSize: 13, fontWeight: '600' },
  tabLabelInactive: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
