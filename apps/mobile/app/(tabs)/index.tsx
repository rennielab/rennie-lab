import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  contactById,
  currentLawyer,
  formatDuration,
  matterById,
  matterDisplay,
  seedEntries,
} from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recent = [...seedEntries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingBottom: space.xxxl }}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{currentLawyer.name.split(' ')[0]}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{currentLawyer.initials}</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>READY TO TRACK</Text>
        <Text style={styles.heroTimer}>00 : 00 : 00</Text>
        <View style={styles.heroActions}>
          <Pressable
            style={({ pressed }) => [styles.ctaSecondary, pressed && { opacity: 0.85 }]}
            onPress={() => router.push('/(tabs)/directory')}>
            <Ionicons name="play" size={16} color={colors.textPrimary} />
            <Text style={styles.ctaSecondaryLabel}>Start Timer</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.ctaPrimary, pressed && { opacity: 0.9 }]}
            onPress={() => router.push('/(tabs)/directory')}>
            <Ionicons name="call" size={16} color={colors.textOnAccent} />
            <Text style={styles.ctaPrimaryLabel}>Make a Call</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryStat label="Today" value="3.2h" />
        <SummaryStat label="This Week" value="24.8h" />
        <SummaryStat label="Pending" value="2" />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.sectionLink}>View all</Text>
          </Pressable>
        </View>

        {recent.map((entry) => {
          const m = matterById(entry.matterId);
          const c = entry.contactId ? contactById(entry.contactId) : undefined;
          return (
            <View key={entry.id} style={styles.entry}>
              <View style={[styles.entryIcon, entry.source === 'call' && { backgroundColor: colors.accentSoft }]}>
                <Ionicons
                  name={entry.source === 'call' ? 'call' : 'time-outline'}
                  size={18}
                  color={entry.source === 'call' ? colors.accent : colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.entryTitle} numberOfLines={1}>
                  {c ? `${c.firstName} ${c.lastName}` : matterDisplay(entry.matterId)}
                </Text>
                <Text style={styles.entryMeta} numberOfLines={1}>
                  {m?.shortName} · {formatDuration(entry.durationSec)}
                </Text>
              </View>
              <StatusPill status={entry.status} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatusPill({ status }: { status: 'draft' | 'pending' | 'approved' }) {
  const map = {
    approved: { bg: colors.accentSoft, fg: colors.accent, label: 'Approved' },
    pending: { bg: colors.warningSoft, fg: colors.warning, label: 'Pending' },
    draft: { bg: colors.bgSurface, fg: colors.textSecondary, label: 'Draft' },
  } as const;
  const s = map[status];
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <Text style={[styles.pillText, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: colors.textSecondary, fontSize: font.size.sm },
  name: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.accent, fontWeight: '700', fontSize: font.size.sm },
  hero: {
    marginTop: space.xxl,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.xl,
    padding: space.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroLabel: { color: colors.textTertiary, fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  heroTimer: {
    color: colors.accent,
    fontSize: 44,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginTop: space.md,
    letterSpacing: 1,
  },
  heroActions: { flexDirection: 'row', gap: space.md, marginTop: space.xl, width: '100%' },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    paddingVertical: space.lg - 2,
  },
  ctaPrimaryLabel: { color: colors.textOnAccent, fontWeight: '600', fontSize: font.size.sm },
  ctaSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.lg,
    paddingVertical: space.lg - 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctaSecondaryLabel: { color: colors.textPrimary, fontWeight: '600', fontSize: font.size.sm },
  summaryRow: { flexDirection: 'row', gap: space.md, marginTop: space.lg },
  stat: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    paddingVertical: space.lg,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { color: colors.textPrimary, fontSize: font.size.xl, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
  section: { marginTop: space.xxl },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.md },
  sectionTitle: { color: colors.textPrimary, fontSize: font.size.md, fontWeight: '600' },
  sectionLink: { color: colors.accent, fontSize: font.size.sm, fontWeight: '500' },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    padding: space.md,
    marginBottom: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  entryIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTitle: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600' },
  entryMeta: { color: colors.textSecondary, fontSize: 12 },
  pill: { paddingHorizontal: space.md, paddingVertical: 4, borderRadius: radii.pill },
  pillText: { fontSize: 11, fontWeight: '600' },
});
