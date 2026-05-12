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
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import {
  contactById,
  currentLawyer,
  entryValue,
  firm,
  formatDuration,
  formatHours,
  formatMoneyShort,
  formatRelative,
  greetingFor,
  matterById,
  recentCalls,
  seedEntries,
  upcoming,
  type Upcoming,
} from '@/lib/mock';
import { useSubmittedEntries } from '@/lib/store';
import { elapsedSec, startTimer, useActiveTimer } from '@/lib/timer';
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
  const next = useMemo(() => pickNext(upcoming), []);

  const onStartTimer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startTimer({ source: 'manual' });
    router.push('/logged?mode=start');
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
        showsVerticalScrollIndicator={false}>
        {/* ── Greeting header ───────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greetingFor()}</Text>
            <Text style={styles.name}>{currentLawyer.name.split(' ')[0]}</Text>
            <Text style={styles.firm}>{firm.name}</Text>
          </View>
          <Pressable
            hitSlop={10}
            style={styles.headerBtn}
            onPress={() => router.push('/(tabs)/profile')}>
            <Avatar
              size={44}
              avatarKey={currentLawyer.avatarKey}
              initials={currentLawyer.initials}
              ring
            />
          </Pressable>
        </View>

        {/* ── Active timer pill (only when running) ─────────────────────── */}
        {active && (
          <Pressable
            onPress={() => router.push('/logged?mode=start')}
            style={styles.timerPill}>
            <View style={styles.timerDot} />
            <Text style={styles.timerPillLabel}>Timer running</Text>
            <Text style={styles.timerPillTime}>
              {formatDuration(elapsedSec(active))}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.accent} />
          </Pressable>
        )}

        {/* ── HERO: today's billable ────────────────────────────────────── */}
        <Animated.View style={[styles.hero, cardStyle(0)]}>
          <Sparkline weekTotal={weekDollars} todayTotal={todayDollars} />
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
            <NextCard next={next} onPressCall={onTapCall} />
          </Animated.View>
        )}

        {/* ── Quick actions ─────────────────────────────────────────────── */}
        <Animated.View style={[styles.actionsRow, cardStyle(2)]}>
          <QuickAction
            icon="call"
            label="Dial"
            onPress={() => router.push('/(tabs)/calls')}
          />
          <QuickAction
            icon="play"
            label={active ? 'Open' : 'Start'}
            onPress={onStartTimer}
            primary={!active}
          />
          <QuickAction
            icon="add"
            label="Log"
            onPress={() => router.push('/logged?mode=start')}
          />
          <QuickAction
            icon="time-outline"
            label="Today"
            onPress={() => router.push('/(tabs)/activities')}
          />
        </Animated.View>

        {/* ── Up next list ──────────────────────────────────────────────── */}
        <Animated.View style={cardStyle(3)}>
          <SectionTitle title="Up next" hint={`${upcoming.length} today & this week`} />
          <View style={styles.upNextList}>
            {upcoming.slice(0, 4).map((u) => (
              <UpNextRow key={u.id} item={u} />
            ))}
          </View>
        </Animated.View>

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
}: {
  next: Upcoming;
  onPressCall: (id: string) => void;
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
          <Text style={styles.nextTime}>{timeStr}</Text>
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
          <Text style={styles.nextTime}>{timeStr}</Text>
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
        <Text style={styles.nextTime}>{timeStr}</Text>
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
  onPress,
  primary,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
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
      <Ionicons
        name={icon}
        size={20}
        color={primary ? colors.bg : colors.textPrimary}
      />
      <Text style={[styles.qaLabel, primary && { color: colors.bg }]}>{label}</Text>
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

// Subtle decorative sparkline behind the hero number. Generated from a
// gentle sin wave for the demo — the shape sells "growing throughout the
// week" without distracting from the headline number.
function Sparkline({ weekTotal, todayTotal }: { weekTotal: number; todayTotal: number }) {
  const pct = weekTotal > 0 ? todayTotal / weekTotal : 0.4;
  // 7 points, progress matches today's share of the week (rough vibe only)
  const heights = [0.25, 0.4, 0.32, 0.55, 0.48, 0.7, 0.55 + 0.3 * pct];
  return (
    <View style={styles.sparkWrap} pointerEvents="none">
      {heights.map((h, i) => (
        <View
          key={i}
          style={[
            styles.sparkBar,
            {
              height: 40 + h * 60,
              opacity: 0.08 + (i / heights.length) * 0.18,
            },
          ]}
        />
      ))}
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

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

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
  firm: { color: colors.textTertiary, fontSize: font.size.xs, marginTop: 4 },
  headerBtn: { padding: 2 },

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
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingRight: space.xl,
    paddingBottom: space.lg,
    zIndex: 1,
  },
  sparkBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
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
  nextTime: {
    color: colors.textSecondary,
    fontSize: font.size.sm,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
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
