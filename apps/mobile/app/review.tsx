import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clientById, contactById, formatDuration, heroEntry, matterById } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Review() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const matter = matterById(heroEntry.matterId)!;
  const client = clientById(matter.clientId)!;
  const contact = contactById(heroEntry.contactId!)!;

  const [description, setDescription] = useState(heroEntry.description);
  const [nonBillable, setNonBillable] = useState(false);

  const billable = matter.rate * (heroEntry.durationSec / 3600);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Entry</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: space.xxl, gap: space.lg, paddingBottom: 140 }}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text style={styles.aiBadgeText}>Auto-drafted from your call</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{contact.initials}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.contactName}>
              {contact.firstName} {contact.lastName}
            </Text>
            <Text style={styles.contactSub}>{client.name}</Text>
          </View>
          <Text style={styles.duration}>{formatDuration(heroEntry.durationSec)}</Text>
        </View>

        <Field label="Matter">
          <Pressable style={styles.select}>
            <Text style={styles.selectText}>{matter.name}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </Pressable>
        </Field>

        <Field label="Description">
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.textarea}
            placeholderTextColor={colors.textTertiary}
          />
          <Text style={styles.hint}>
            <Ionicons name="sparkles" size={11} color={colors.accent} /> Auto-summarized from the call transcript
          </Text>
        </Field>

        <View style={styles.billingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Billing</Text>
            <Text style={styles.billingValue}>
              ${billable.toFixed(2)}
              <Text style={styles.billingRate}> · @${matter.rate}/hr</Text>
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <Text style={styles.label}>Non-billable</Text>
            <Switch
              value={nonBillable}
              onValueChange={setNonBillable}
              trackColor={{ false: colors.bgSurface, true: colors.warningSoft }}
              thumbColor={nonBillable ? colors.warning : '#cccccc'}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        <Pressable
          style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.8 }]}
          onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.btnSecondaryLabel}>Discard</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.9 }]}
          onPress={() => router.replace('/submitted')}>
          <Text style={styles.btnPrimaryLabel}>Submit Entry</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.xxl,
    paddingVertical: space.md,
  },
  headerTitle: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '600' },
  aiBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  aiBadgeText: { color: colors.accent, fontSize: font.size.xs, fontWeight: '600' },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.accent, fontWeight: '700', fontSize: font.size.base },
  contactName: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  contactSub: { color: colors.textSecondary, fontSize: font.size.xs },
  duration: { color: colors.accent, fontSize: font.size.lg, fontWeight: '700', fontVariant: ['tabular-nums'] },
  label: { color: colors.textSecondary, fontSize: font.size.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectText: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '500', flex: 1, marginRight: space.md },
  textarea: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    padding: space.lg,
    color: colors.textPrimary,
    fontSize: font.size.base,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  hint: { color: colors.textTertiary, fontSize: font.size.xs },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  billingValue: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '700', marginTop: 4 },
  billingRate: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '400' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: space.md,
    paddingHorizontal: space.xxl,
    paddingTop: space.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnPrimary: {
    flex: 2,
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: space.lg,
    alignItems: 'center',
  },
  btnPrimaryLabel: { color: colors.textOnAccent, fontSize: font.size.md, fontWeight: '600' },
  btnSecondary: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    paddingVertical: space.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryLabel: { color: colors.textPrimary, fontSize: font.size.md, fontWeight: '600' },
});
