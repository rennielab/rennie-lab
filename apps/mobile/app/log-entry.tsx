// Manual time entry — for time you've already worked. No timer; you type
// the duration directly. Used by the home quick-action "Log" and as the
// fallback when a timer ends without a matter picked.

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
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
  currentLawyer,
  matterById,
  matters,
  type TimeEntry,
} from '@/lib/mock';
import { submitEntry } from '@/lib/store';
import { colors, font, radii, space } from '@/lib/tokens';

export default function LogEntry() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ matterId?: string; durationSec?: string }>();

  const [matterId, setMatterId] = useState(params.matterId ?? matters[0].id);
  const [activity, setActivity] = useState<'call' | 'email' | 'document' | 'text'>('call');
  const [hours, setHours] = useState(
    params.durationSec ? String(Math.floor(Number(params.durationSec) / 3600)) : '0',
  );
  const [mins, setMins] = useState(
    params.durationSec
      ? String(Math.floor((Number(params.durationSec) % 3600) / 60))
      : '30',
  );
  const [description, setDescription] = useState('');
  const [nonBill, setNonBill] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const matter = matterById(matterId);
  const client = matter ? clientById(matter.clientId) : undefined;

  const totalSec = useMemo(() => {
    const h = parseInt(hours || '0', 10) || 0;
    const m = parseInt(mins || '0', 10) || 0;
    return h * 3600 + m * 60;
  }, [hours, mins]);

  const billable = useMemo(() => {
    if (nonBill || !matter) return 0;
    return (totalSec / 3600) * matter.rate;
  }, [totalSec, matter, nonBill]);

  const canSave = totalSec > 0 && !!matter;

  const onSave = async () => {
    if (!canSave) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const entry: TimeEntry = {
      id: `te_manual_${Date.now()}`,
      matterId,
      lawyerId: currentLawyer.id,
      durationSec: totalSec,
      description: description.trim() || `Time on ${matter!.shortName}.`,
      createdAt: Date.now(),
      status: 'pending',
      nonBillable: nonBill,
      source: activity === 'call' ? 'call' : 'manual',
      activity,
    };
    submitEntry(entry);
    router.replace('/(tabs)/activities');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.topBar, { paddingTop: insets.top + space.md }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Manual time entry</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: space.xxl, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.help}>For time you&apos;ve already worked.</Text>

        {/* Activity — Dana 2026-05-26: categorize manual entries */}
        <Text style={styles.section}>Activity</Text>
        <View style={styles.activityRow}>
          {(
            [
              ['call', 'call', 'Call'],
              ['email', 'mail', 'Email'],
              ['document', 'document-text', 'Document'],
              ['text', 'chatbubble', 'Text'],
            ] as const
          ).map(([key, icon, label]) => (
            <Pressable
              key={key}
              onPress={() => setActivity(key)}
              style={[styles.activityChip, activity === key && styles.activityChipActive]}>
              <Ionicons
                name={icon}
                size={15}
                color={activity === key ? colors.accent : colors.textSecondary}
              />
              <Text
                style={[
                  styles.activityLabel,
                  activity === key && { color: colors.accent, fontWeight: '700' },
                ]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Matter */}
        <Text style={styles.section}>Matter</Text>
        <Pressable onPress={() => setPickerOpen(true)} style={styles.field}>
          <View style={styles.fieldIcon}>
            <Ionicons name="briefcase" size={16} color={colors.accent} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.fieldValue} numberOfLines={1}>
              {matter?.name ?? 'Select matter'}
            </Text>
            <Text style={styles.fieldSub} numberOfLines={1}>
              {client?.name} · ${matter?.rate}/hr
            </Text>
          </View>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </Pressable>

        {/* Duration */}
        <Text style={styles.section}>Duration</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <TextInput
              value={hours}
              onChangeText={(v) => setHours(v.replace(/[^0-9]/g, '').slice(0, 2))}
              keyboardType="number-pad"
              style={styles.timeInput}
              maxLength={2}
              selectTextOnFocus
            />
            <Text style={styles.timeUnit}>hours</Text>
          </View>
          <Text style={styles.timeColon}>:</Text>
          <View style={styles.timeBox}>
            <TextInput
              value={mins}
              onChangeText={(v) => {
                const n = Math.min(59, parseInt(v.replace(/[^0-9]/g, '') || '0', 10));
                setMins(String(n));
              }}
              keyboardType="number-pad"
              style={styles.timeInput}
              maxLength={2}
              selectTextOnFocus
            />
            <Text style={styles.timeUnit}>mins</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.section}>Description</Text>
        <View style={styles.descBox}>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What did you work on?"
            placeholderTextColor={colors.textTertiary}
            multiline
            style={styles.descInput}
          />
        </View>

        {/* Non-billable */}
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>Non-billable</Text>
            <Text style={styles.toggleSub}>Internal time or pro bono</Text>
          </View>
          <Switch
            value={nonBill}
            onValueChange={setNonBill}
            trackColor={{ false: colors.bgSurface, true: colors.warningSoft }}
            thumbColor={nonBill ? colors.warning : '#cccccc'}
          />
        </View>

        {/* Summary */}
        {canSave && (
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>
                {hours}h {mins.padStart(2, '0')}m
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Billable</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: nonBill ? colors.textTertiary : colors.accent },
                ]}>
                {nonBill ? '—' : `$${Math.round(billable).toLocaleString()}`}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        <Pressable
          onPress={onSave}
          disabled={!canSave}
          style={({ pressed }) => [
            styles.cta,
            !canSave && { opacity: 0.4 },
            pressed && { opacity: 0.9 },
          ]}>
          <Text style={styles.ctaLabel}>Save entry</Text>
        </Pressable>
      </View>

      <MatterSheet
        visible={pickerOpen}
        selectedId={matterId}
        onPick={setMatterId}
        onClose={() => setPickerOpen(false)}
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
  title: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '700' },
  help: { color: colors.textSecondary, fontSize: font.size.sm, marginBottom: space.lg },

  section: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: space.lg,
    marginBottom: space.sm,
  },

  activityRow: { flexDirection: 'row', gap: 8 },
  activityChip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
  },
  activityChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: 'rgba(34, 197, 94, 0.45)',
  },
  activityLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    paddingVertical: 14,
  },
  fieldIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldValue: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  fieldSub: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },

  timeRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  timeBox: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: space.md,
    alignItems: 'center',
  },
  timeInput: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
    minWidth: 64,
    textAlign: 'center',
    padding: 0,
  },
  timeUnit: { color: colors.textTertiary, fontSize: font.size.xs, marginTop: 2 },
  timeColon: { color: colors.textTertiary, fontSize: 30, fontWeight: '700', marginHorizontal: 4 },

  descBox: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    minHeight: 96,
  },
  descInput: {
    color: colors.textPrimary,
    fontSize: font.size.base,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginTop: space.lg,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    paddingVertical: 14,
  },
  toggleTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  toggleSub: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },

  summary: {
    marginTop: space.lg,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '500' },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: font.size.base,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: space.sm },

  footer: { paddingHorizontal: space.xxl, paddingTop: space.md },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.xl,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaLabel: { color: colors.textOnAccent, fontSize: font.size.md, fontWeight: '700' },
});
