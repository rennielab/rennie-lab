import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  clientById,
  contactById,
  formatDuration,
  formatMoney,
  lawyerById,
  matterById,
  seedEntries,
  type TimeEntry,
} from '@/lib/mock';
import { useSubmittedEntries } from '@/lib/store';
import { colors, font, radii, space } from '@/lib/tokens';

export default function EntryDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const submitted = useSubmittedEntries();

  const entry: TimeEntry | undefined =
    submitted.find((e) => e.id === params.id) ?? seedEntries.find((e) => e.id === params.id);

  if (!entry) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
        <Text style={styles.title}>Entry not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const matter = matterById(entry.matterId);
  const client = matter ? clientById(matter.clientId) : undefined;
  const lawyer = lawyerById(entry.lawyerId);
  const contact = entry.contactId ? contactById(entry.contactId) : undefined;
  const billable = matter ? (matter.rate * entry.durationSec) / 3600 : 0;
  const when = new Date(entry.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle}>Entry</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120, paddingHorizontal: space.xxl, gap: space.lg, paddingTop: space.md }}>
        <View style={styles.heroCard}>
          <View style={[styles.heroIcon, entry.source === 'call' && { backgroundColor: colors.accentSoft }]}>
            <Ionicons name={entry.source === 'call' ? 'call' : 'time-outline'} size={22} color={colors.accent} />
          </View>
          <Text style={styles.heroTitle}>
            {contact ? `${contact.firstName} ${contact.lastName}` : matter?.shortName ?? 'Entry'}
          </Text>
          <Text style={styles.heroSub}>{client?.name ?? ''}</Text>
          <Text style={styles.heroDuration}>{formatDuration(entry.durationSec)}</Text>
          <Text style={styles.heroDate}>{when}</Text>
        </View>

        <Section title="Matter">
          <Text style={styles.matterName}>{matter?.name ?? '—'}</Text>
          <View style={styles.matterMeta}>
            <Text style={styles.matterRate}>${matter?.rate ?? 0}/hr</Text>
            <View style={styles.dot} />
            <Text style={styles.matterRate}>by {lawyer?.name ?? '—'}</Text>
          </View>
        </Section>

        <Section title="Description" badge={entry.source === 'call' ? 'AI-summarized' : undefined}>
          <Text style={styles.body}>{entry.description}</Text>
        </Section>

        {entry.source === 'call' && (
          <Section title="Call recording">
            <View style={styles.recordRow}>
              <View style={styles.playBtn}>
                <Ionicons name="play" size={16} color={colors.textOnAccent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recordTitle}>Call with {contact ? `${contact.firstName} ${contact.lastName}` : 'contact'}</Text>
                <Text style={styles.recordSub}>{formatDuration(entry.durationSec)} · Encrypted</Text>
              </View>
              <Text style={styles.listen}>Listen</Text>
            </View>
          </Section>
        )}

        <Section title="Billing">
          <Row label="Rate" value={`${formatMoney(matter?.rate ?? 0)}/hr`} />
          <Row label="Duration" value={formatDuration(entry.durationSec)} />
          {entry.nonBillable && <Row label="Status" value="Non-billable" valueColor={colors.warning} />}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Billable amount</Text>
            <Text style={styles.totalValue}>
              {entry.nonBillable ? '—' : formatMoney(billable)}
            </Text>
          </View>
        </Section>

        <View style={[styles.statusPill, statusStyle(entry.status)]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor(entry.status) }]} />
          <Text style={[styles.statusLabel, { color: statusColor(entry.status) }]}>
            {entry.status === 'approved' ? 'Approved by your firm admin' : entry.status === 'pending' ? 'Pending admin review' : 'Draft'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {badge && (
          <View style={styles.sectionBadge}>
            <Ionicons name="sparkles" size={10} color={colors.accent} />
            <Text style={styles.sectionBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.rowLine}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

function statusColor(s: 'approved' | 'pending' | 'draft') {
  return s === 'approved' ? colors.accent : s === 'pending' ? colors.warning : colors.textTertiary;
}
function statusStyle(s: 'approved' | 'pending' | 'draft') {
  return { backgroundColor: s === 'approved' ? colors.accentSoft : s === 'pending' ? colors.warningSoft : colors.bgSurface };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xxl },
  topTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  iconBtn: { width: 36, height: 36, borderRadius: radii.pill, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700', textAlign: 'center', marginTop: space.huge, paddingHorizontal: space.xxl },
  backBtn: { marginTop: space.lg, alignSelf: 'center', paddingHorizontal: space.lg, paddingVertical: space.sm, borderRadius: radii.pill, backgroundColor: colors.bgElevated },
  backLabel: { color: colors.textPrimary, fontWeight: '600' },
  heroCard: { backgroundColor: colors.bgElevated, borderRadius: radii.xl, padding: space.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  heroIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.bgSurface, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  heroTitle: { color: colors.textPrimary, fontSize: font.size.xl, fontWeight: '700' },
  heroSub: { color: colors.textSecondary, fontSize: font.size.sm, marginTop: 2 },
  heroDuration: { color: colors.accent, fontSize: 38, fontWeight: '700', fontVariant: ['tabular-nums'], letterSpacing: 1, marginTop: space.md },
  heroDate: { color: colors.textTertiary, fontSize: font.size.xs, marginTop: 4 },
  section: { backgroundColor: colors.bgElevated, borderRadius: radii.lg, padding: space.md, borderWidth: 1, borderColor: colors.border },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: radii.pill },
  sectionBadgeText: { color: colors.accent, fontSize: 10, fontWeight: '700' },
  matterName: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  matterMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  matterRate: { color: colors.textSecondary, fontSize: font.size.xs },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  body: { color: colors.textPrimary, fontSize: font.size.sm, lineHeight: 22 },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  playBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  recordTitle: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600' },
  recordSub: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
  listen: { color: colors.accent, fontSize: font.size.sm, fontWeight: '600' },
  rowLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: colors.textSecondary, fontSize: font.size.sm },
  rowValue: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.sm, paddingTop: space.sm, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600' },
  totalValue: { color: colors.accent, fontSize: font.size.lg, fontWeight: '700' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: space.md, borderRadius: radii.lg },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: font.size.sm, fontWeight: '600' },
});
