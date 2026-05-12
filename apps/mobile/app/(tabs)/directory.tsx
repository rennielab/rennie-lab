import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clientById, contacts, matterById } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

type Tab = 'contacts' | 'matters' | 'clients';

export default function Directory() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('contacts');
  const [q, setQ] = useState('');

  const filteredContacts = contacts.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.lg }]}>
      <Text style={styles.h1}>Directory</Text>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search contacts, matters, clients"
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.tabBar}>
        {(['contacts', 'matters', 'clients'] as Tab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
              {t === 'contacts' ? 'Contacts' : t === 'matters' ? 'Matters' : 'Clients'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }} showsVerticalScrollIndicator={false}>
        {tab === 'contacts' &&
          filteredContacts.map((c) => {
            const matter = c.matterId ? matterById(c.matterId) : undefined;
            const client = matter ? clientById(matter.clientId) : undefined;
            return (
              <Pressable
                key={c.id}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
                onPress={() =>
                  router.push({
                    pathname: '/call',
                    params: { contactId: c.id },
                  })
                }>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{c.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>
                    {c.firstName} {c.lastName}
                  </Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {client?.name}
                    {matter ? ` · ${matter.shortName}` : ''}
                  </Text>
                </View>
                <View style={styles.callIcon}>
                  <Ionicons name="call" size={16} color={colors.accent} />
                </View>
              </Pressable>
            );
          })}
        {tab === 'matters' && <EmptyHint text="Matters list comes through here. Tap a contact to call." />}
        {tab === 'clients' && <EmptyHint text="Clients list comes through here. Tap a contact to call." />}
      </ScrollView>
    </View>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="folder-open-outline" size={32} color={colors.textTertiary} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  h1: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700', marginBottom: space.lg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.md,
    paddingHorizontal: space.lg,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: font.size.base },
  tabBar: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.lg,
    marginBottom: space.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.pill,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: space.sm + 2, alignItems: 'center', borderRadius: radii.pill },
  tabActive: { backgroundColor: colors.bgSurface },
  tabLabel: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '500' },
  tabLabelActive: { color: colors.textPrimary, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    marginBottom: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.accent, fontWeight: '700' },
  rowTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  rowSub: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
  callIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { alignItems: 'center', paddingTop: space.huge, gap: space.md },
  emptyText: { color: colors.textTertiary, fontSize: font.size.sm, textAlign: 'center', paddingHorizontal: space.xxl },
});
