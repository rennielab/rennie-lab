import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HoldStartFab } from '@/components/HoldStartFab';
import { useUnreadCount } from '@/lib/chat';
import { formatDuration } from '@/lib/mock';
import { elapsedSec, timerMatter, useActiveTimer } from '@/lib/timer';
import { colors, radii, space } from '@/lib/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

// Phone-first: the app opens on Calls. Ops is the daily brief. You lives
// top-right inside each screen, not in the tab bar.
const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'index', label: 'Calls', icon: 'call-outline' },
  { name: 'ops', label: 'Ops', icon: 'grid-outline' },
  { name: 'activities', label: 'Time', icon: 'time-outline' },
  { name: 'chat', label: 'Chat', icon: 'chatbubbles-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <ClockdTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="ops" />
      <Tabs.Screen name="activities" />
      <Tabs.Screen name="chat" />
      {/* kept as routes, hidden from the tab bar */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="directory" options={{ href: null }} />
    </Tabs>
  );
}

function ClockdTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;
  const unread = useUnreadCount();

  return (
    <View
      style={[styles.wrap, { paddingBottom: insets.bottom + space.sm }]}
      pointerEvents="box-none">
      {/* Global timer pill — floats above the tab bar on every screen */}
      <GlobalTimerPill />

      <View style={styles.barRow}>
        <View style={styles.pill}>
          {TABS.slice(0, 2).map((tab) => (
            <TabButton
              key={tab.name}
              tab={tab}
              active={currentRoute === tab.name}
              badge={0}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate(tab.name);
              }}
            />
          ))}
          <View style={styles.fabSlot}>
            <HoldStartFab />
          </View>
          {TABS.slice(2).map((tab) => (
            <TabButton
              key={tab.name}
              tab={tab}
              active={currentRoute === tab.name}
              badge={tab.name === 'chat' ? unread : 0}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate(tab.name);
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function TabButton({
  tab,
  active,
  badge,
  onPress,
}: {
  tab: { name: string; label: string; icon: IconName };
  active: boolean;
  badge: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tab} hitSlop={8}>
      <View style={styles.tabIconWrap}>
        <Ionicons
          name={active ? (tab.icon.replace('-outline', '') as IconName) : tab.icon}
          size={20}
          color={active ? colors.accent : colors.textSecondary}
        />
        {badge > 0 && !active && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
    </Pressable>
  );
}

// Floating timer pill — visible on every tab while a timer is live, so
// Sophia never loses track of running time. Tap to open the timer.
function GlobalTimerPill() {
  const router = useRouter();
  const active = useActiveTimer();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active || active.paused) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;
  const matter = timerMatter(active);
  const paused = active.paused;

  return (
    <Pressable
      onPress={() => router.push('/logged?mode=start')}
      style={[styles.timerPill, paused && styles.timerPillPaused]}>
      <View style={[styles.timerDot, paused && { backgroundColor: colors.warning }]} />
      <Text
        style={[styles.timerPillLabel, paused && { color: colors.warning }]}
        numberOfLines={1}>
        {paused ? 'Paused' : matter ? matter.shortName : 'Tracking'}
      </Text>
      <Text style={[styles.timerPillTime, paused && { color: colors.warning }]}>
        {formatDuration(elapsedSec(active))}
      </Text>
      <Ionicons name="chevron-up" size={14} color={paused ? colors.warning : colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: space.lg,
    gap: space.sm,
  },
  barRow: { flexDirection: 'row', width: '100%' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  tabIconWrap: { position: 'relative' },
  tabLabel: { color: colors.textSecondary, fontSize: 10.5, fontWeight: '600' },
  tabLabelActive: { color: colors.accent, fontWeight: '700' },
  fabSlot: { paddingHorizontal: 4, marginTop: -26 },
  tabBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.bgElevated,
  },
  tabBadgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },

  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(20, 55, 41, 0.97)',
    borderColor: 'rgba(34, 197, 94, 0.45)',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    maxWidth: 320,
  },
  timerPillPaused: { borderColor: 'rgba(245, 158, 11, 0.45)' },
  timerDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  timerPillLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  timerPillTime: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
