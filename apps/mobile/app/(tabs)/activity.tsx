import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { contactById, formatDuration, matterDisplay, seedEntries } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Activity() {
  const insets = useSafeAreaInsets();
  const entries = [...seedEntries].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.lg }]}>
      <Text style={styles.h1}>Activity</Text>
      <Text style={styles.sub}>Your recent time entries</Text>

      <ScrollView
        style={{ marginTop: space.lg }}
        contentContainerStyle={{ paddingBottom: space.xxxl }}
        showsVerticalScrollIndicator={false}>
        {entries.map((e) => {
          const c = e.contactId ? contactById(e.contactId) : undefined;
          return (
            <View key={e.id} style={styles.entry}>
              <View style={styles.row}>
                <Text style={styles.title} numberOfLines={1}>
                  {c ? `${c.firstName} ${c.lastName}` : matterDisplay(e.matterId)}
                </Text>
                <StatusDot status={e.status} />
              </View>
              <Text style={styles.matter} numberOfLines={1}>{matterDisplay(e.matterId)}</Text>
              <Text style={styles.body} numberOfLines={2}>{e.description}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.duration}>{formatDuration(e.durationSec)}</Text>
                <Text style={styles.source}>{e.source === 'call' ? 'From call' : 'Manual'}</Text>
                {e.nonBillable && <Text style={styles.nonBill}>Non-billable</Text>}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function StatusDot({ status }: { status: 'approved' | 'pending' | 'draft' }) {
  const colorFor = status === 'approved' ? colors.accent : status === 'pending' ? colors.warning : colors.textTertiary;
  return <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colorFor }} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  h1: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  sub: { color: colors.textSecondary, fontSize: font.size.sm, marginTop: 4 },
  entry: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    padding: space.lg,
    marginBottom: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600', flex: 1, marginRight: space.md },
  matter: { color: colors.accent, fontSize: font.size.xs, fontWeight: '500', marginTop: 2 },
  body: { color: colors.textSecondary, fontSize: font.size.sm, marginTop: space.sm, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: space.md, alignItems: 'center', marginTop: space.md },
  duration: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600', fontVariant: ['tabular-nums'] },
  source: { color: colors.textTertiary, fontSize: font.size.xs },
  nonBill: { color: colors.warning, fontSize: font.size.xs, fontWeight: '500' },
});
