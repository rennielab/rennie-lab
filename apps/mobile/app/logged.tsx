// Logged screen — handles two top-level modes:
//   start  → live timer (Running ↔ Paused ↔ Review-and-confirm)
//   review → from a call's /processing → duration locked, AI summary pre-filled
//
// In start mode the user can pause (counter freezes), resume, or stop. Stop
// transitions to the in-screen "Confirm & log" state — duration is locked,
// matter and description editable, then Save submits the entry. This solves
// the "I tapped Done by accident" case.

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MatterSheet } from '@/components/MatterSheet';
import {
  clientById,
  contactById,
  heroEntry,
  matterById,
  type TimeEntry,
} from '@/lib/mock';
import { submitEntry } from '@/lib/store';
import {
  elapsedSec,
  pauseTimer,
  resumeTimer,
  startTimer,
  stopTimer,
  updateTimer,
  useActiveTimer,
} from '@/lib/timer';
import { colors, font, radii, space } from '@/lib/tokens';

type StartPhase = 'live' | 'review';

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
  const [phase, setPhase] = useState<StartPhase>('live');
  const [confirmedSec, setConfirmedSec] = useState<number | null>(null);

  const contact = params.contactId
    ? contactById(params.contactId)
    : contactById(heroEntry.contactId!);

  const lockedDuration =
    mode === 'review' ? Number(params.durationSec ?? heroEntry.durationSec) : null;

  const initialMatter =
    active?.matterId ?? (params.matterId as string) ?? contact?.matterId ?? heroEntry.matterId;
  const [nonBill, setNonBill] = useState(active?.nonBillable ?? false);
  const [selectedMatter, setSelectedMatter] = useState(initialMatter);
  const [matterSheetOpen, setMatterSheetOpen] = useState(false);
  const [description, setDescription] = useState(
    mode === 'review' ? heroEntry.description : '',
  );

  // Defensively start a timer if start mode but no active one.
  useEffect(() => {
    if (mode === 'start' && !active) {
      startTimer({ source: 'manual', matterId: selectedMatter || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync matter onto timer if user changes it mid-run.
  useEffect(() => {
    if (mode === 'start' && active) updateTimer({ matterId: selectedMatter || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMatter]);

  // 1Hz re-render while live.
  useEffect(() => {
    if (mode !== 'start' || phase !== 'live') return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [mode, phase]);

  // Subtle breathing pulse on the timer ring while running.
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const running = mode === 'start' && phase === 'live' && active && !active.paused;
    if (!running) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mode, phase, active, pulse]);

  // Resolve elapsed seconds based on phase.
  const liveSec = mode === 'start' ? elapsedSec(active) : 0;
  const seconds =
    mode === 'review'
      ? (lockedDuration ?? 0)
      : phase === 'review'
        ? (confirmedSec ?? liveSec)
        : liveSec;

  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const matter = matterById(selectedMatter);
  const client = matter ? clientById(matter.clientId) : undefined;
  const billable = !nonBill && matter ? (seconds / 3600) * matter.rate : 0;

  // ── Actions ─────────────────────────────────────────────────────────────
  const onPause = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pauseTimer();
  };

  const onResume = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resumeTimer();
  };

  const onStop = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setConfirmedSec(liveSec);
    pauseTimer(); // freeze the counter; we don't discard the timer until save/discard
    setPhase('review');
  };

  const onSave = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const finalSec =
      mode === 'review' ? (lockedDuration ?? 0) : (confirmedSec ?? liveSec);
    const entry: TimeEntry = {
      id: `te_live_${Date.now()}`,
      matterId: selectedMatter,
      lawyerId: heroEntry.lawyerId,
      durationSec: finalSec,
      description: description.trim() || `Time on ${matter?.shortName ?? 'matter'}.`,
      createdAt: Date.now(),
      status: 'pending',
      nonBillable: nonBill,
      source: mode === 'review' ? 'call' : 'manual',
      contactId: contact?.id,
    };
    submitEntry(entry);
    if (mode === 'start') stopTimer();
    router.replace('/(tabs)/activities');
  };

  const onDiscard = () => {
    const finalSec = mode === 'review' ? (lockedDuration ?? 0) : (confirmedSec ?? liveSec);
    const minutes = Math.round(finalSec / 60);
    Alert.alert(
      'Discard entry?',
      minutes > 0
        ? `You'll lose ${minutes} minute${minutes === 1 ? '' : 's'} of tracked time. This can't be undone.`
        : "This entry won't be saved.",
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            if (mode === 'start') stopTimer();
            router.replace('/(tabs)');
          },
        },
      ],
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────
  const isPaused = !!active?.paused;
  const isLiveStart = mode === 'start' && phase === 'live';
  const isReviewing = mode === 'review' || (mode === 'start' && phase === 'review');

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.15] });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.topBar, { paddingTop: insets.top + space.md }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.iconBtn}>
          <Ionicons name="chevron-down" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle}>
          {isLiveStart ? (isPaused ? 'Paused' : 'Tracking') : 'Confirm & log'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: space.xxl,
          paddingBottom: 160,
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Timer */}
        <View style={styles.timerWrap}>
          <Animated.View
            style={[
              styles.ringPulse,
              { transform: [{ scale: ringScale }], opacity: ringOpacity },
              isPaused && { opacity: 0 },
            ]}
          />
          <View style={[styles.ring, isPaused && styles.ringPaused, isReviewing && styles.ringReview]}>
            <Ionicons
              name={
                mode === 'review' ? 'call' : isPaused ? 'pause' : isReviewing ? 'checkmark' : 'timer'
              }
              size={36}
              color={
                isPaused
                  ? colors.warning
                  : isReviewing
                    ? colors.accent
                    : colors.accent
              }
            />
          </View>
        </View>

        {/* Status pill */}
        {isLiveStart && (
          <View
            style={[
              styles.statusPill,
              isPaused
                ? { backgroundColor: colors.warningSoft }
                : { backgroundColor: colors.accentSoft },
            ]}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isPaused ? colors.warning : colors.accent },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: isPaused ? colors.warning : colors.accent },
              ]}>
              {isPaused ? 'PAUSED' : 'RUNNING'}
            </Text>
          </View>
        )}

        {/* Matter pill */}
        <Pressable
          onPress={() => setMatterSheetOpen(true)}
          style={styles.matterPill}>
          <Ionicons name="briefcase" size={14} color={colors.accent} />
          <Text style={styles.matterPillText} numberOfLines={1}>
            {matter?.shortName ?? 'Pick matter'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </Pressable>
        {client && (
          <Text style={styles.clientLine} numberOfLines={1}>
            {client.name} · ${matter?.rate}/hr
          </Text>
        )}

        {/* Big timer */}
        <Text
          style={[
            styles.timer,
            isPaused && { color: colors.warning },
            isReviewing && { color: colors.textPrimary },
          ]}>
          {hh} : {mm} : {ss}
        </Text>

        {/* Billable preview while reviewing */}
        {isReviewing && !nonBill && matter && (
          <Text style={styles.billLine}>
            ${Math.round(billable).toLocaleString()} billable
          </Text>
        )}

        {/* Description input (always editable on start review; pre-filled AI summary on call review) */}
        {isReviewing && (
          <View style={styles.descCard}>
            {mode === 'review' && (
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={12} color={colors.accent} />
                <Text style={styles.aiBadgeText}>Auto-drafted from your call</Text>
              </View>
            )}
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What did you work on?"
              placeholderTextColor={colors.textTertiary}
              multiline
              style={styles.descInput}
            />
          </View>
        )}

        {/* Non-billable toggle (always available) */}
        <View style={styles.toggleRow}>
          <Switch
            value={nonBill}
            onValueChange={setNonBill}
            trackColor={{ false: colors.bgSurface, true: colors.warningSoft }}
            thumbColor={nonBill ? colors.warning : '#cccccc'}
          />
          <Text style={styles.toggleLabel}>Do not bill</Text>
        </View>
      </ScrollView>

      {/* ── Footer actions ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        {isLiveStart && (
          <View style={styles.actionRow}>
            <Pressable
              onPress={isPaused ? onResume : onPause}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.85 },
              ]}>
              <Ionicons
                name={isPaused ? 'play' : 'pause'}
                size={18}
                color={colors.textPrimary}
              />
              <Text style={styles.secondaryLabel}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </Pressable>
            <Pressable
              onPress={onStop}
              style={({ pressed }) => [
                styles.stopBtn,
                pressed && { opacity: 0.9 },
              ]}>
              <View style={styles.stopSquare} />
              <Text style={styles.stopLabel}>Stop</Text>
            </Pressable>
          </View>
        )}

        {isReviewing && (
          <View style={styles.actionRow}>
            <Pressable
              onPress={onDiscard}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && { opacity: 0.85 },
              ]}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={[styles.secondaryLabel, { color: colors.danger }]}>
                Discard
              </Text>
            </Pressable>
            <Pressable
              onPress={onSave}
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { opacity: 0.9 },
              ]}>
              <Ionicons name="checkmark" size={18} color={colors.bg} />
              <Text style={styles.saveLabel}>Save entry</Text>
            </Pressable>
          </View>
        )}
      </View>

      <MatterSheet
        visible={matterSheetOpen}
        selectedId={selectedMatter}
        onPick={setSelectedMatter}
        onClose={() => setMatterSheetOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.xxl,
    paddingBottom: space.md,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  topTitle: {
    color: colors.textPrimary,
    fontSize: font.size.base,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  timerWrap: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  ringPulse: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.accent,
  },
  ring: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    borderColor: 'rgba(34,197,94,0.45)',
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPaused: {
    borderColor: 'rgba(245, 158, 11, 0.55)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  ringReview: {
    backgroundColor: colors.accentSoft,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginTop: space.lg,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },

  matterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: space.md,
    maxWidth: 280,
  },
  matterPillText: {
    color: colors.textPrimary,
    fontSize: font.size.sm,
    fontWeight: '600',
    flexShrink: 1,
  },
  clientLine: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 4 },

  timer: {
    color: colors.accent,
    fontSize: 56,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
    marginTop: space.md,
  },
  billLine: {
    color: colors.accent,
    fontSize: font.size.sm,
    fontWeight: '600',
    marginTop: 4,
  },

  descCard: {
    width: '100%',
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    marginTop: space.lg,
    gap: space.sm,
  },
  aiBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  aiBadgeText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  descInput: {
    color: colors.textPrimary,
    fontSize: font.size.sm,
    lineHeight: 20,
    minHeight: 64,
    textAlignVertical: 'top',
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.lg,
  },
  toggleLabel: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '500' },

  footer: {
    paddingHorizontal: space.xxl,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  actionRow: { flexDirection: 'row', gap: 10 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryLabel: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  stopBtn: {
    flex: 1.2,
    backgroundColor: colors.danger,
    borderRadius: radii.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stopSquare: { width: 12, height: 12, backgroundColor: '#fff', borderRadius: 2 },
  stopLabel: { color: '#fff', fontSize: font.size.base, fontWeight: '700' },
  saveBtn: {
    flex: 1.5,
    backgroundColor: colors.accent,
    borderRadius: radii.xl,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveLabel: { color: colors.bg, fontSize: font.size.base, fontWeight: '700' },
});
