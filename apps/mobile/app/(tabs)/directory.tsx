import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clients, contacts, matters } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

type Tab = 'clients' | 'matters';

// Deterministic color picker for the contact avatar background
const AVATAR_TINTS = [
  { bg: 'rgba(34, 197, 94, 0.18)', fg: '#22C55E' },
  { bg: 'rgba(245, 158, 11, 0.18)', fg: '#F59E0B' },
  { bg: 'rgba(59, 130, 246, 0.18)', fg: '#3B82F6' },
  { bg: 'rgba(168, 85, 247, 0.18)', fg: '#A855F7' },
  { bg: 'rgba(239, 68, 68, 0.18)', fg: '#EF4444' },
  { bg: 'rgba(20, 184, 166, 0.18)', fg: '#14B8A6' },
];

export default function Directory() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('clients');
  const [q, setQ] = useState('');

  const filteredContacts = useMemo(
    () =>
      contacts.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );
  const filteredMatters = useMemo(
    () => matters.filter((m) => m.name.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <View style={styles.tabsRow}>
        {(['clients', 'matters'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabPill, tab === t && styles.tabPillActive]}>
            <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
              {t === 'clients' ? 'Contacts' : 'Matters'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={tab === 'clients' ? 'Search Contacts' : 'Search Matters'}
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {tab === 'clients' &&
          filteredContacts.map((c, idx) => {
            const tint = AVATAR_TINTS[idx % AVATAR_TINTS.length];
            const matterCount = matters.filter((m) => m.clientId === c.clientId).length;
            return (
              <Pressable
                key={c.id}
                onPress={() => router.push({ pathname: '/call', params: { contactId: c.id } })}
                style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: tint.bg }]}>
                  <Text style={[styles.avatarText, { color: tint.fg }]}>{c.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{c.firstName} {c.lastName}</Text>
                  <Text style={styles.rowSub}>{matterCount} {matterCount === 1 ? 'Matter' : 'Matters'}</Text>
                </View>
                <View style={styles.callBtn}>
                  <Ionicons name="call" size={18} color={colors.textOnAccent} />
                </View>
              </Pressable>
            );
          })}
        {tab === 'matters' &&
          filteredMatters.map((m) => {
            const client = clients.find((c) => c.id === m.clientId);
            const matterContactsCount = contacts.filter((c) => c.matterId === m.id).length;
            return (
              <Pressable
                key={m.id}
                onPress={() => router.push('/logged?mode=start')}
                style={styles.row}>
                <View style={styles.matterIcon}>
                  <Ionicons name="briefcase-outline" size={20} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{m.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <View style={styles.activePill}>
                      <Text style={styles.activePillText}>ACTIVE</Text>
                    </View>
                    <Text style={styles.rowSub}>· {matterContactsCount} {matterContactsCount === 1 ? 'Contact' : 'Contacts'}</Text>
                  </View>
                  <Text style={[styles.rowSub, { marginTop: 2 }]} numberOfLines={1}>{client?.name}</Text>
                </View>
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.xxl },
  tabsRow: { flexDirection: 'row', gap: space.sm, marginBottom: space.lg },
  tabPill: { paddingHorizontal: space.lg, paddingVertical: 8, borderRadius: radii.pill, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  tabPillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  tabLabel: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '500' },
  tabLabelActive: { color: colors.textOnAccent, fontWeight: '700' },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.bgSurface, borderRadius: radii.md, paddingHorizontal: space.lg, height: 48, borderWidth: 1, borderColor: colors.border, marginBottom: space.md },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: font.size.base },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { width: 44, height: 44, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700', fontSize: font.size.sm },
  matterIcon: { width: 44, height: 44, borderRadius: radii.pill, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  rowSub: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
  callBtn: { width: 44, height: 44, borderRadius: radii.pill, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  activePill: { backgroundColor: colors.accentSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  activePillText: { color: colors.accent, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
