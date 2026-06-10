// Daily Brief — Sophia's home. The first thing she sees each morning.
// One hero number, one decisive "next" card, fast quick-actions, then a
// scroll into depth (up next, matters, this week). Dark forest base with
// generous space, big tabular numbers, calm motion. No clutter.

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { BHLogo } from '@/components/BHLogo';
import {
  contactById,
  currentLawyer,
  entryValue,
  firm,
  formatHours,
  formatMoneyShort,
  formatRelative,
  greetingFor,
  matterById,
  recentCalls,
  seedEntries,
  upcoming,
  type Upcoming,
  type TimeEntry,
} from '@/lib/mock';
import { useSubmittedEntries } from '@/lib/store';
import { startTimer, useActiveTimer } from '@/lib/timer';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const submitted = useSubmittedEntries();
  const active = useActiveTimer();
  const [, setTick] = useState(0);

  // 1s tick while a timer is running, so the pill keeps current. The state
  // exists only to force a re-render — elapsedSec reads Date.now() directly.
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  // ---- numbers -------------------------------------------------------------
  const allEntries = useMemo(() => [...submitted, ...seedEntries], [submitted]);
  const todayCutoff = startOfDay();
  const weekCutoff = startOfWeek();

  const todayMine = allEntries.filter(
    (e) => e.lawyerId === currentLawyer.id && e.createdAt >= todayCutoff,
  );
  const weekMine = allEntries.filter(
    (e) => e.lawyerId === currentLawyer.id && e.createdAt >= weekCutoff,
  );

  const todayDollars = todayMine.reduce((a, e) => a + entryValue(e), 0);
  const todayHoursSec = todayMine.reduce((a, e) => a + e.durationSec, 0);
  const weekDollars = weekMine.reduce((a, e) => a + entryValue(e), 0);
  const weekCallsCount = recentCalls.filter((c) => c.at >= weekCutoff).length;

  // Real daily $ totals for the last 7 days — feeds the sparkline behind the
  // hero number so the bars are an honest representation of Sophia's week.
  const dailyTotals = useMemo(
    () => buildDailyTotals(allEntries, 7, currentLawyer.id),
    [allEntries],
  );

  // ---- animated counters ---------------------------------------------------
  const dollarAnim = useRef(new Animated.Value(0)).current;
  const [dollarDisplay, setDollarDisplay] = useState(0);
  useEffect(() => {
    Animated.timing(dollarAnim, {
      toValue: todayDollars,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = dollarAnim.addListener(({ value }) => setDollarDisplay(value));
    return () => dollarAnim.removeListener(id);
  }, [todayDollars, dollarAnim]);

  // ---- card stagger --------------------------------------------------------
  const cardOpacity = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  const cardY = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(8))).current;
  useEffect(() => {
    Animated.stagger(
      80,
      cardOpacity.map((o, i) =>
        Animated.parallel([
          Animated.timing(o, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(cardY[i], {
            toValue: 0,
            duration: 420,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const cardStyle = (i: number) => ({
    opacity: cardOpacity[i],
    transform: [{ translateY: cardY[i] }],
  });

  // ---- the "Next" item -----------------------------------------------------
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());
  const visibleUpcoming = useMemo(
    () => upcoming.filter((u) => !snoozedIds.has(u.id)),
    [snoozedIds],
  );
  const next = useMemo(() => pickNext(visibleUpcoming), [visibleUpcoming]);
  // Skip the hero item from the secondary "Up next" list so we don't show
  // the same call twice on screen.
  const upNextList = useMemo(
    () => visibleUpcoming.filter((u) => u.id !== next?.id).slice(0, 4),
    [visibleUpcoming, next],
  );

  const onSnoozeNext = async () => {
    if (!next) return;
    await Haptics.selectionAsync();
    setSnoozedIds((prev) => new Set(prev).add(next.id));
  };

  // ---- pull to refresh -----------------------------------------------------
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Replay the counter + stagger animations so the screen feels reactive.
    dollarAnim.setValue(0);
    Animated.timing(dollarAnim, {
      toValue: todayDollars,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    setTimeout(() => setRefreshing(false), 700);
  };

  // "Start" (quick action) — general time tracking, no matter yet. Sophia
  // can pick the matter when she stops the timer. The deliberate path (FAB
  // long-press) requires the matter up front.
  // If a timer is already running we navigate to it instead of starting a
  // new one (which would wipe the elapsed time).
  const onStartGeneral = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!active) startTimer({ source: 'manual' });
    router.push('/logged?mode=start');
  };

  // "Log" (quick action) — manual entry for time you've already worked.
  const onLogManual = async () => {
    await Haptics.selectionAsync();
    router.push('/log-entry');
  };

  const onTapCall = async (contactId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/call', params: { contactId } });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + space.md,
          paddingBottom: 140,
          paddingHorizontal: space.xxl,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.bgElevated}
          />
        }>
        {/* ── Firm bar — Bennett & Hayes presence at the top ────────────── */}
        <View style={styles.firmBar}>
          <BHLogo size={28} />
          <View style={{ flex: 1 }}>
            <Text style={styles.firmName}>{firm.name}</Text>
            <Text style={styles.firmLoc}>{firm.location}</Text>
          </View>
          <Pressable
            hitSlop={6}
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.firmAvatar}>
            <Avatar
              size={32}
              avatarKey={currentLawyer.avatarKey}
              initials={currentLawyer.initials}
            />
          </Pressable>
        </View>

        {/* ── Greeting ─────────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greetingFor()}</Text>
            <Text style={styles.name}>{currentLawyer.name.split(' ')[0]}</Text>
          </View>
        </View>

        {/* Timer pill is global now — rendered above the tab bar in _layout */}

        {/* ── HERO: today's billable ────────────────────────────────────── */}
        <Animated.View style={[styles.hero, cardStyle(0)]}>
          <Sparkline daily={dailyTotals} />
          <View style={styles.heroInner}>
            <Text style={styles.heroLabel}>Logged today</Text>
            <Text style={styles.heroNumber}>
              {formatMoneyShort(dollarDisplay)}
            </Text>
            <View style={styles.heroSub}>
              <Text style={styles.heroSubText}>
                {formatHours(todayHoursSec)} billable
              </Text>
              <View style={styles.heroDot} />
              <Text style={styles.heroSubText}>
                {todayMine.length} {todayMine.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── NEXT: the one decisive card ───────────────────────────────── */}
        {next && (
          <Animated.View style={cardStyle(1)}>
            <NextCard next={next} onPressCall={onTapCall} onSnooze={onSnoozeNext} />
          </Animated.View>
        )}

        {/* ── Quick actions ─────────────────────────────────────────────── */}
        <Animated.View style={[styles.actionsRow, cardStyle(2)]}>
          <QuickAction
            icon="call"
            label="Dial"
            onPress={() => router.push('/(tabs)')}
          />
          <QuickAction
            icon={active ? 'play' : 'play'}
            label={active ? 'Open' : 'Start'}
            sub={active ? undefined : 'General'}
            onPress={onStartGeneral}
            primary={!active}
          />
          <QuickAction
            icon="create-outline"
            label="Log"
            sub="Manual"
            onPress={onLogManual}
          />
          <QuickAction
            icon="time-outline"
            label="Today"
            onPress={() => router.push('/(tabs)/activities')}
          />
        </Animated.View>

        {/* ── Up next list ──────────────────────────────────────────────── */}
        {upNextList.length > 0 && (
          <Animated.View style={cardStyle(3)}>
            <SectionTitle
              title="Up next"
              hint={`${upNextList.length} ${upNextList.length === 1 ? 'item' : 'items'}`}
            />
            <View style={styles.upNextList}>
              {upNextList.map((u) => (
                <UpNextRow key={u.id} item={u} />
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── This week ─────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginTop: space.xl }, cardStyle(4)]}>
          <SectionTitle title="This week" />
          <View style={styles.weekRow}>
            <WeekStat label="Billable" value={formatMoneyShort(weekDollars)} />
            <WeekStat
              label="Hours"
              value={formatHours(weekMine.reduce((a, e) => a + e.durationSec, 0)).replace(
                'h',
                '',
              )}
              suffix="h"
            />
            <WeekStat label="Calls" value={String(weekCallsCount)} />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function NextCard({
  next,
  onPressCall,
  onSnooze,
}: {
  next: Upcoming;
  onPressCall: (id: string) => void;
  onSnooze: () => void;
}) {
  const at = new Date(next.at);
  const timeStr = at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const relStr = formatRelative(next.at);

  if (next.kind === 'call') {
    const contact = contactById(next.contactId)!;
    const matter = matterById(next.matterId);
    return (
      <View style={styles.nextWrap}>
        <View style={styles.nextHeader}>
          <View style={styles.nextLabel}>
            <View style={styles.nextLabelDot} />
            <Text style={styles.nextLabelText}>NEXT · {relStr.toUpperCase()}</Text>
          </View>
          <View style={styles.nextHeaderRight}>
            <Text style={styles.nextTime}>{timeStr}</Text>
            <Pressable hitSlop={8} onPress={onSnooze} style={styles.nextSnoozeBtn}>
              <Ionicons name="close" size={14} color={colors.textTertiary} />
            </Pressable>
          </View>
        </View>
        <View style={styles.nextBody}>
          <Avatar size={56} initials={contact.initials} tone="green" />
          <View style={{ flex: 1 }}>
            <Text style={styles.nextTitle}>
              Call {contact.firstName} {contact.lastName}
            </Text>
            <Text style={styles.nextSub} numberOfLines={1}>
              {matter?.shortName} · {next.durationMin}min
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => onPressCall(contact.id)}
          style={({ pressed }) => [
            styles.nextCTA,
            pressed && { opacity: 0.9 },
          ]}>
          <Ionicons name="call" size={18} color={colors.bg} />
          <Text style={styles.nextCTALabel}>Tap to dial</Text>
        </Pressable>
      </View>
    );
  }

  if (next.kind === 'deadline') {
    const matter = matterById(next.matterId);
    const danger = next.severity === 'overdue' || next.severity === 'today';
    return (
      <View
        style={[
          styles.nextWrap,
          danger && {
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderColor: 'rgba(245, 158, 11, 0.35)',
          },
        ]}>
        <View style={styles.nextHeader}>
          <View
            style={[
              styles.nextLabel,
              danger && { backgroundColor: colors.warningSoft },
            ]}>
            <View
              style={[
                styles.nextLabelDot,
                danger && { backgroundColor: colors.warning },
              ]}
            />
            <Text
              style={[
                styles.nextLabelText,
                danger && { color: colors.warning },
              ]}>
              {danger ? 'DUE' : 'UPCOMING'} · {relStr.toUpperCase()}
            </Text>
          </View>
          <View style={styles.nextHeaderRight}>
            <Text style={styles.nextTime}>{timeStr}</Text>
            <Pressable hitSlop={8} onPress={onSnooze} style={styles.nextSnoozeBtn}>
              <Ionicons name="close" size={14} color={colors.textTertiary} />
            </Pressable>
          </View>
        </View>
        <View style={styles.nextBody}>
          <View style={[styles.deadlineIcon, danger && { backgroundColor: colors.warningSoft }]}>
            <Ionicons
              name="flag"
              size={22}
              color={danger ? colors.warning : colors.accent}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nextTitle}>{next.title}</Text>
            <Text style={styles.nextSub} numberOfLines={1}>
              {matter?.shortName}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // meeting
  const matter = matterById(next.matterId);
  return (
    <View style={styles.nextWrap}>
      <View style={styles.nextHeader}>
        <View style={styles.nextLabel}>
          <View style={styles.nextLabelDot} />
          <Text style={styles.nextLabelText}>MEETING · {relStr.toUpperCase()}</Text>
        </View>
        <View style={styles.nextHeaderRight}>
          <Text style={styles.nextTime}>{timeStr}</Text>
          <Pressable hitSlop={8} onPress={onSnooze} style={styles.nextSnoozeBtn}>
            <Ionicons name="close" size={14} color={colors.textTertiary} />
          </Pressable>
        </View>
      </View>
      <View style={styles.nextBody}>
        <View style={styles.deadlineIcon}>
          <Ionicons name="people" size={22} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nextTitle}>{next.title}</Text>
          <Text style={styles.nextSub} numberOfLines={1}>
            {next.with} · {matter?.shortName}
          </Text>
        </View>
      </View>
    </View>
  );
}

function UpNextRow({ item }: { item: Upcoming }) {
  const matter = matterById((item as any).matterId);
  const at = new Date(item.at);
  const time = at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  let icon: any = 'time-outline';
  let title = '';
  let sub = matter?.shortName ?? '';
  let tone: 'green' | 'amber' = 'green';
  if (item.kind === 'call') {
    icon = 'call';
    const c = contactById(item.contactId);
    title = c ? `${c.firstName} ${c.lastName}` : 'Call';
    sub = `${matter?.shortName ?? ''} · ${item.durationMin}min`;
  } else if (item.kind === 'deadline') {
    icon = 'flag';
    title = item.title;
    if (item.severity === 'today' || item.severity === 'overdue') tone = 'amber';
  } else if (item.kind === 'meeting') {
    icon = 'people';
    title = item.title;
    sub = `${item.with} · ${matter?.shortName ?? ''}`;
  }

  return (
    <View style={styles.upRow}>
      <View
        style={[
          styles.upIcon,
          tone === 'amber' && { backgroundColor: colors.warningSoft },
        ]}>
        <Ionicons
          name={icon}
          size={16}
          color={tone === 'amber' ? colors.warning : colors.accent}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.upTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.upSub} numberOfLines={1}>
          {sub}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.upTime}>{time}</Text>
        <Text style={styles.upRel}>{formatRelative(item.at)}</Text>
      </View>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  sub,
  onPress,
  primary,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.qa,
        primary && styles.qaPrimary,
        pressed && { transform: [{ scale: 0.96 }] },
      ]}>
      <Ionicons name={icon} size={20} color={primary ? colors.bg : colors.textPrimary} />
      <Text style={[styles.qaLabel, primary && { color: colors.bg }]}>{label}</Text>
      {sub && (
        <Text
          style={[
            styles.qaSub,
            primary && { color: 'rgba(14, 42, 30, 0.7)' },
          ]}>
          {sub}
        </Text>
      )}
    </Pressable>
  );
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hint && <Text style={styles.sectionHint}>{hint}</Text>}
    </View>
  );
}

function WeekStat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <View style={styles.weekStat}>
      <Text style={styles.weekValue}>
        {value}
        {suffix && <Text style={styles.weekSuffix}>{suffix}</Text>}
      </Text>
      <Text style={styles.weekLabel}>{label}</Text>
    </View>
  );
}

// Real sparkline — each bar is one day of Sophia's billable $ for the last 7
// days. Today is the rightmost bar (brightest). Heights are normalized so
// the tallest day fills, others scale proportionally. If all days are zero
// we render a faint baseline so the card doesn't look broken.
function Sparkline({ daily }: { daily: { day: Date; total: number; isToday: boolean }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.total));
  return (
    <View style={styles.sparkWrap} pointerEvents="none">
      {daily.map((d, i) => {
        const ratio = d.total / max;
        const minHeight = 8;
        const maxHeight = 96;
        const h = minHeight + ratio * (maxHeight - minHeight);
        return (
          <View key={i} style={styles.sparkCol}>
            <View
              style={[
                styles.sparkBar,
                {
                  height: h,
                  opacity: d.isToday ? 0.85 : 0.18 + ratio * 0.22,
                  backgroundColor: d.isToday ? colors.accent : colors.accent,
                },
              ]}
            />
            <Text
              style={[
                styles.sparkLabel,
                d.isToday && { color: colors.accent, fontWeight: '700' },
              ]}>
              {dayLetter(d.day)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function startOfDay() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfWeek() {
  const d = new Date();
  const day = d.getDay() || 7; // make Sunday = 7 so weeks start Monday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (day - 1));
  return d.getTime();
}

function pickNext(items: Upcoming[]): Upcoming | undefined {
  const future = items.filter((i) => i.at >= Date.now()).sort((a, b) => a.at - b.at);
  return future[0];
}

// Group entries into per-day $ totals for the last `days` days for a single
// lawyer. Returns oldest → newest so the array maps left-to-right in the UI.
function buildDailyTotals(
  entries: TimeEntry[],
  days: number,
  lawyerId: string,
): { day: Date; total: number; isToday: boolean }[] {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const out: { day: Date; total: number; isToday: boolean }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    const dayStart = d.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const total = entries
      .filter((e) => e.lawyerId === lawyerId && e.createdAt >= dayStart && e.createdAt < dayEnd)
      .reduce((a, e) => a + entryValue(e), 0);
    out.push({ day: d, total, isToday: i === 0 });
  }
  return out;
}

function dayLetter(d: Date) {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  firmBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.bgElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    marginBottom: space.lg,
  },
  firmName: {
    color: colors.textPrimary,
    fontSize: font.size.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  firmLoc: { color: colors.textTertiary, fontSize: 11, marginTop: 1 },
  firmAvatar: { padding: 2 },
  firmIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  unreadDotText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: space.lg,
  },
  greeting: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '500' },
  name: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 2,
  },

  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.accentSoft,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    marginBottom: space.lg,
  },
  timerPillPaused: {
    backgroundColor: colors.warningSoft,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  timerPillLabel: {
    color: colors.accent,
    fontSize: font.size.sm,
    fontWeight: '600',
    flex: 1,
  },
  timerPillTime: {
    color: colors.accent,
    fontSize: font.size.sm,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  // ─── Hero ──
  hero: {
    backgroundColor: colors.bgElevated,
    borderRadius: 24,
    paddingVertical: space.xxl,
    paddingHorizontal: space.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    minHeight: 160,
  },
  heroInner: { position: 'relative', zIndex: 2 },
  heroLabel: {
    color: colors.textSecondary,
    fontSize: font.size.xs,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroNumber: {
    color: colors.textPrimary,
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
    marginTop: 6,
  },
  heroSub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  heroSubText: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '500' },
  heroDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  sparkWrap: {
    position: 'absolute',
    right: space.lg,
    top: space.xxl,
    bottom: space.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    zIndex: 1,
  },
  sparkCol: {
    alignItems: 'center',
    gap: 4,
    width: 14,
  },
  sparkBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  sparkLabel: {
    color: colors.textTertiary,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ─── Next card ──
  nextWrap: {
    marginTop: space.lg,
    backgroundColor: colors.bgElevated,
    borderRadius: 20,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.md,
  },
  nextLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  nextLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  nextLabelText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  nextHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nextTime: {
    color: colors.textSecondary,
    fontSize: font.size.sm,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  nextSnoozeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBody: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  nextTitle: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '700' },
  nextSub: { color: colors.textSecondary, fontSize: font.size.sm, marginTop: 2 },
  deadlineIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCTA: {
    marginTop: space.md,
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextCTALabel: { color: colors.bg, fontSize: font.size.base, fontWeight: '700' },

  // ─── Quick actions ──
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: space.lg,
  },
  qa: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  qaPrimary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  qaLabel: { color: colors.textPrimary, fontSize: font.size.xs, fontWeight: '600' },
  qaSub: {
    color: colors.textTertiary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },

  // ─── Sections ──
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: space.xl,
    marginBottom: space.md,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '700' },
  sectionHint: { color: colors.textTertiary, fontSize: font.size.xs },

  upNextList: {
    backgroundColor: colors.bgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  upRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  upIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  upSub: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
  upTime: {
    color: colors.textPrimary,
    fontSize: font.size.sm,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  upRel: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },

  weekRow: { flexDirection: 'row', gap: 10 },
  weekStat: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: 14,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekValue: {
    color: colors.textPrimary,
    fontSize: font.size.xl,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  weekSuffix: { color: colors.textSecondary, fontSize: font.size.base, fontWeight: '600' },
  weekLabel: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
});
