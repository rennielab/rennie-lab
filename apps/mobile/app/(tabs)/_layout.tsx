import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HoldStartFab } from '@/components/HoldStartFab';
import { recentCalls } from '@/lib/mock';
import { colors, radii, space } from '@/lib/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'index', label: 'Home', icon: 'home-outline' },
  { name: 'calls', label: 'Calls', icon: 'call-outline' },
  { name: 'activities', label: 'Time', icon: 'time-outline' },
  { name: 'profile', label: 'You', icon: 'person-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <ClockdTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="calls" />
      <Tabs.Screen name="activities" />
      <Tabs.Screen name="profile" />
      {/* directory kept as a route but hidden from tab bar — used by other screens */}
      <Tabs.Screen name="directory" options={{ href: null }} />
    </Tabs>
  );
}

function ClockdTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;

  // Missed-call count — shown as a tiny red badge on the Calls tab icon so
  // Sophia can see at a glance she has a call to return.
  const missedCount = recentCalls.filter((c) => c.direction === 'missed').length;

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + space.sm }]} pointerEvents="box-none">
      <View style={styles.pill}>
        {TABS.map((tab) => {
          const isActive = currentRoute === tab.name;
          const showMissed = tab.name === 'calls' && missedCount > 0 && !isActive;
          return (
            <Pressable
              key={tab.name}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate(tab.name);
              }}
              style={[styles.tab, isActive && styles.tabActive]}
              hitSlop={8}>
              <View style={styles.tabIconWrap}>
                <Ionicons
                  name={isActive ? (tab.icon.replace('-outline', '') as IconName) : tab.icon}
                  size={18}
                  color={isActive ? colors.textOnAccent : colors.textSecondary}
                />
                {showMissed && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{missedCount}</Text>
                  </View>
                )}
              </View>
              {isActive ? (
                <Text style={styles.tabLabel}>{tab.label}</Text>
              ) : (
                <Text style={styles.tabLabelInactive}>{tab.label}</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <HoldStartFab />
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
  tabIconWrap: { position: 'relative' },
  tabBadge: {
    position: 'absolute',
    top: -5,
    right: -7,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.bgElevated,
  },
  tabBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
});
