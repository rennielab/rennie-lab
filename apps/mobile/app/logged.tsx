import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MatterSheet } from '@/components/MatterSheet';
import { contactById, heroEntry, matterById, type TimeEntry } from '@/lib/mock';
import { submitEntry } from '@/lib/store';
import { elapsedSec, startTimer, stopTimer, updateTimer, useActiveTimer } from '@/lib/timer';
import { colors, font, radii, space } from '@/lib/tokens';

// Modes:
//   start  -> idle: timer counts up from 0, lawyer manually picks a matter
//   review -> coming from /processing: duration locked, AI summary pre-filled
export default function Logged() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    mode?: string;
    contactId?: string;
    durationSec?: string;
    matterId?: string;
  }>();
  const mode = (params.mode as 'start' | 'review') ?? 'review';

  const active = useActiveTimer();
  const [, setTick] = useState(0);

  const contact = params.contactId
    ? contactById(params.contactId)
    : contactById(heroEntry.contactId!);

  const lockedDuration =
    mode === 'review' ? Number(params.durationSec ?? heroEntry.durationSec) : null;

  // In start mode, prefer the active timer's matter (set by the FAB long-press
  // flow); fall back to the URL param or the contact's matter.
  const initialMatter =
    active?.matterId ?? (params.matterId as string) ?? contact?.matterId ?? heroEntry.matterId;
  const [nonBill, setNonBill] = useState(active?.nonBillable ?? false);
  const [selectedMatter, setSelectedMatter] = useState(initialMatter);
  const [matterSheetOpen, setMatterSheetOpen] = useState(false);

  // Ensure a timer is running in start mode (defensive — Home/FAB usually
  // start it before navigating here).
  useEffect(() => {
    if (mode === 'start' && !active) {
      startTimer({ source: 'manual', matterId: selectedMatter || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep timer's matter in sync if the user changes it from this screen.
  useEffect(() => {
    if (mode === 'start' && active) updateTimer({ matterId: selectedMatter || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMatter]);

  // Tick once per second so the live counter re-renders.
  useEffect(() => {
    if (mode !== 'start') return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [mode]);

  const seconds = mode === 'review' ? (lockedDuration ?? 0) : elapsedSec(active);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const matter = matterById(selectedMatter);

  const onDone = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const finalSec = mode === 'review' ? (lockedDuration ?? 0) : elapsedSec(active);
    const entry: TimeEntry = {
      id: `te_live_${Date.now()}`,
      matterId: selectedMatter,
      lawyerId: heroEntry.lawyerId,
      durationSec: finalSec,
      description:
        mode === 'review'
          ? heroEntry.description
          : `Time on ${matter?.shortName ?? 'matter'}.`,
      createdAt: Date.now(),
      status: 'pending',
      nonBillable: nonBill,
      source: mode === 'review' ? 'call' : 'manual',
      contactId: contact?.id,
    };
    submitEntry(entry);
    if (mode === 'start') stopTimer();
    router.replace('/(tabs)');
  };

  const scale = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  }, [scale]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-down" size={26} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.center}>
        <Animated.View style={[styles.iconRing, { transform: [{ scale }] }]}>
          <View style={styles.iconInner}>
            <Ionicons name={mode === 'review' ? 'call' : 'checkmark'} size={36} color={colors.accent} />
          </View>
        </Animated.View>

        {contact && mode === 'review' && (
          <Text style={styles.contactName}>
            {contact.firstName} {contact.lastName}
          </Text>
        )}
        {mode === 'start' && <Text style={styles.contactName}>Tracking time</Text>}

        <Pressable onPress={() => setMatterSheetOpen(true)} style={styles.matterPill}>
          <Text style={styles.matterPillText} numberOfLines={1}>
            {matter?.shortName ?? 'Select Matter'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </Pressable>

        <Text style={styles.timer}>
          {hh} : {mm} : {ss}
        </Text>

        <View style={styles.toggleRow}>
          <Switch
            value={nonBill}
            onValueChange={setNonBill}
            trackColor={{ false: colors.bgSurface, true: colors.warningSoft }}
            thumbColor={nonBill ? colors.warning : '#cccccc'}
          />
          <Text style={styles.toggleLabel}>Do not bill</Text>
        </View>

        {mode === 'review' && (
          <View style={styles.aiCard}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color={colors.accent} />
              <Text style={styles.aiBadgeText}>Auto-drafted from your call</Text>
            </View>
            <Text style={styles.aiBody} numberOfLines={3}>{heroEntry.description}</Text>
          </View>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        <Pressable
          onPress={onDone}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.92 }]}>
          <Text style={styles.ctaLabel}>Done</Text>
        </Pressable>
      </View>

      <MatterSheet
        visible={matterSheetOpen}
        selectedId={selectedMatter}
        onPick={setSelectedMatter}
        onClose={() => setMatterSheetOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md },
  iconRing: { width: 130, height: 130, borderRadius: 65, borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  iconInner: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.accentSoft },
  contactName: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  matterPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.md, paddingVertical: 6, backgroundColor: colors.bgSurface, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, maxWidth: 280 },
  matterPillText: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '500', flexShrink: 1 },
  timer: { color: colors.accent, fontSize: 56, fontWeight: '700', fontVariant: ['tabular-nums'], letterSpacing: 2, marginTop: space.sm },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  toggleLabel: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '500' },
  aiCard: { width: '100%', backgroundColor: colors.bgElevated, borderRadius: radii.lg, padding: space.md, marginTop: space.md, borderWidth: 1, borderColor: colors.border, gap: space.sm },
  aiBadge: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radii.pill },
  aiBadgeText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  aiBody: { color: colors.textSecondary, fontSize: font.size.sm, lineHeight: 18 },
  footer: { paddingTop: space.md },
  cta: { backgroundColor: colors.accent, borderRadius: radii.xl, paddingVertical: 18, alignItems: 'center' },
  ctaLabel: { color: colors.textOnAccent, fontSize: font.size.md, fontWeight: '700' },
});
