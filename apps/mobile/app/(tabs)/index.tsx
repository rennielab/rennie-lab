import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { contactById, formatDuration, formatHours, matterById, matterDisplay, seedEntries } from '@/lib/mock';
import { recentlySubmittedIds, useSubmittedEntries } from '@/lib/store';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Activities() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'all' | 'pending' | 'approved'>('all');
  const submitted = useSubmittedEntries();
  const [newIds, setNewIds] = useState<Set<string>>(() => recentlySubmittedIds());

  // Drop the "NEW" badge after 6 seconds
  useEffect(() => {
    const fresh = recentlySubmittedIds(6000);
    setNewIds(fresh);
    if (fresh.size === 0) return;
    const t = setTimeout(() => setNewIds(new Set()), 6500);
    return () => clearTimeout(t);
  }, [submitted]);

  const all = useMemo(() => {
    return [...submitted, ...seedEntries].sort((a, b) => b.createdAt - a.createdAt);
  }, [submitted]);

  const entries = useMemo(
    () => (tab === 'all' ? all : all.filter((e) => e.status === tab)),
    [tab, all]
  );

  const todayHours = formatHours(all.filter((e) => Date.now() - e.createdAt < 86400000).reduce((a, e) => a + e.durationSec, 0));
  const weekHours = formatHours(all.reduce((a, e) => a + e.durationSec, 0));
  const pendingCount = all.filter((e) => e.status === 'pending').length;

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <View style={styles.header}>
        <Text style={styles.h1}>Activities</Text>
        <Pressable hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Today" value={todayHours} />
        <Stat label="This week" value={weekHours} />
        <Stat label="Pending" value={String(pendingCount)} accent={pendingCount > 0} />
      </View>

      <View style={styles.segmentBar}>
        {(['all', 'pending', 'approved'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.segment, tab === t && styles.segmentActive]}>
            <Text style={[styles.segmentLabel, tab === t && styles.segmentLabelActive]}>
              {t[0].toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: space.md }}
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: space.xxl }}
        showsVerticalScrollIndicator={false}>
        {entries.map((e) => {
          const c = e.contactId ? contactById(e.contactId) : undefined;
          const m = matterById(e.matterId);
          const isNew = newIds.has(e.id);
          return (
            <Pressable
              key={e.id}
              onPress={() => router.push({ pathname: '/entry/[id]', params: { id: e.id } })}
              style={[styles.entry, isNew && styles.entryNew]}>
              <View style={[styles.entryIcon, e.source === 'call' && { backgroundColor: colors.accentSoft }]}>
                <Ionicons
                  name={e.source === 'call' ? 'call' : 'time-outline'}
                  size={18}
                  color={e.source === 'call' ? colors.accent : colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.entryTopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginRight: space.sm }}>
                    <Text style={styles.entryTitle} numberOfLines={1}>
                      {c ? `${c.firstName} ${c.lastName}` : m?.shortName ?? 'Entry'}
                    </Text>
                    {isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.entryDuration}>{formatDuration(e.durationSec)}</Text>
                </View>
                <Text style={styles.entryMatter} numberOfLines={1}>{matterDisplay(e.matterId)}</Text>
                <View style={styles.entryMetaRow}>
                  <StatusDot status={e.status} />
                  <Text style={styles.entryMetaText}>
                    {e.status === 'approved' ? 'Approved' : e.status === 'pending' ? 'Pending review' : 'Draft'}
                  </Text>
                  {e.nonBillable && (
                    <>
                      <View style={styles.metaDot} />
                      <Text style={[styles.entryMetaText, { color: colors.warning }]}>Non-billable</Text>
                    </>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
        {entries.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={32} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No entries yet — tap + to start tracking.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, accent && { color: colors.warning }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatusDot({ status }: { status: 'approved' | 'pending' | 'draft' }) {
  const c = status === 'approved' ? colors.accent : status === 'pending' ? colors.warning : colors.textTertiary;
  return <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c }} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xxl, marginBottom: space.lg },
  h1: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: radii.pill, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  statsRow: { flexDirection: 'row', gap: space.md, paddingHorizontal: space.xxl },
  stat: { flex: 1, backgroundColor: colors.bgElevated, borderRadius: radii.lg, paddingVertical: space.md, paddingHorizontal: space.md, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
  segmentBar: { flexDirection: 'row', gap: 4, marginTop: space.lg, marginHorizontal: space.xxl, backgroundColor: colors.bgElevated, padding: 4, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radii.pill },
  segmentActive: { backgroundColor: colors.bgSurface },
  segmentLabel: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '500' },
  segmentLabelActive: { color: colors.textPrimary, fontWeight: '600' },
  entry: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  entryNew: { backgroundColor: colors.accentSoft, paddingHorizontal: space.md, marginHorizontal: -space.sm, borderRadius: radii.md, borderBottomColor: 'transparent' },
  entryIcon: { width: 38, height: 38, borderRadius: radii.pill, backgroundColor: colors.bgSurface, alignItems: 'center', justifyContent: 'center' },
  entryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600', flexShrink: 1 },
  entryDuration: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600', fontVariant: ['tabular-nums'] },
  entryMatter: { color: colors.accent, fontSize: font.size.xs, fontWeight: '500', marginTop: 2 },
  entryMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  entryMetaText: { color: colors.textSecondary, fontSize: font.size.xs },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  newBadge: { backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  newBadgeText: { color: colors.textOnAccent, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  empty: { alignItems: 'center', paddingTop: space.huge, gap: space.md },
  emptyText: { color: colors.textTertiary, fontSize: font.size.sm },
});
