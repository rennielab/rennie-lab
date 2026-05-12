// Calls hub — dial pad on top, recent calls below, contacts sheet on tap.
// This is the VoIP differentiator surface. Every call dialed here will
// (in the real Twilio wiring) go out on the firm's number, and on hangup
// it pre-fills a time entry. For the prototype we route to /call which
// simulates the in-call screen.

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import {
  clientById,
  contacts,
  contactById,
  formatDuration,
  formatRelative,
  matterById,
  recentCalls,
  type Contact,
  type RecentCall,
} from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

type Mode = 'recents' | 'contacts' | 'keypad';

export default function Calls() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('recents');
  const [query, setQuery] = useState('');
  const [dialed, setDialed] = useState('');

  const filteredContacts = useMemo(() => {
    if (!query) return contacts;
    const q = query.toLowerCase();
    return contacts.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')),
    );
  }, [query]);

  const onDial = async (contactId?: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (contactId) router.push({ pathname: '/call', params: { contactId } });
    else if (dialed.length > 4) {
      // Cold dial — for the demo, route to the first contact as a stand-in
      router.push({ pathname: '/call', params: { contactId: contacts[0].id } });
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.md }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.h1}>Calls</Text>
          <Text style={styles.sub}>On your firm number</Text>
        </View>
        <View style={styles.firmBadge}>
          <View style={styles.firmDot} />
          <Text style={styles.firmBadgeText}>Bennett &amp; Hayes</Text>
        </View>
      </View>

      <View style={styles.segmentBar}>
        {(['recents', 'contacts', 'keypad'] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={[styles.segment, mode === m && styles.segmentActive]}>
            <Text style={[styles.segmentLabel, mode === m && styles.segmentLabelActive]}>
              {m[0].toUpperCase() + m.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === 'recents' && (
        <ScrollView
          style={{ flex: 1, marginTop: space.lg }}
          contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: space.xxl }}
          showsVerticalScrollIndicator={false}>
          {recentCalls.map((c) => (
            <RecentRow key={c.id} call={c} onDial={onDial} />
          ))}
        </ScrollView>
      )}

      {mode === 'contacts' && (
        <View style={{ flex: 1, marginTop: space.lg }}>
          <View style={[styles.search, { marginHorizontal: space.xxl }]}>
            <Ionicons name="search" size={16} color={colors.textTertiary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search contacts…"
              placeholderTextColor={colors.textTertiary}
              style={styles.searchInput}
            />
            {!!query && (
              <Pressable hitSlop={8} onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
          <ScrollView
            style={{ flex: 1, marginTop: space.md }}
            contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: space.xxl }}
            showsVerticalScrollIndicator={false}>
            {filteredContacts.map((c) => (
              <ContactRow key={c.id} contact={c} onDial={onDial} />
            ))}
            {filteredContacts.length === 0 && (
              <Text style={styles.empty}>No contacts match “{query}”.</Text>
            )}
          </ScrollView>
        </View>
      )}

      {mode === 'keypad' && (
        <View style={{ flex: 1, paddingHorizontal: space.xxl, paddingTop: space.xl }}>
          <View style={styles.dialReadout}>
            <Text style={styles.dialNumber} numberOfLines={1} adjustsFontSizeToFit>
              {dialed || ' '}
            </Text>
            {!!dialed && (
              <Pressable
                hitSlop={10}
                onPress={() => setDialed((d) => d.slice(0, -1))}
                style={styles.delBtn}>
                <Ionicons name="backspace-outline" size={22} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
          <Keypad onPress={(d) => setDialed((s) => s + d)} />
          <Pressable
            onPress={() => onDial()}
            disabled={dialed.length < 4}
            style={({ pressed }) => [
              styles.dialCTA,
              dialed.length < 4 && { opacity: 0.4 },
              pressed && { opacity: 0.85 },
            ]}>
            <Ionicons name="call" size={22} color="#fff" />
            <Text style={styles.dialCTALabel}>Call</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─── Rows ──────────────────────────────────────────────────────────────────

function RecentRow({
  call,
  onDial,
}: {
  call: RecentCall;
  onDial: (id: string) => void;
}) {
  const contact = contactById(call.contactId);
  if (!contact) return null;
  const client = clientById(contact.clientId);
  const matter = call.matterId ? matterById(call.matterId) : undefined;
  const missed = call.direction === 'missed';

  const dirIcon =
    call.direction === 'out'
      ? 'arrow-up-outline'
      : call.direction === 'in'
        ? 'arrow-down-outline'
        : 'remove-outline';

  return (
    <View style={styles.row}>
      <Avatar
        size={44}
        initials={contact.initials}
        tone={missed ? 'red' : 'green'}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={[styles.rowTitle, missed && { color: colors.danger }]}
          numberOfLines={1}>
          {contact.firstName} {contact.lastName}
        </Text>
        <View style={styles.rowMetaRow}>
          <Ionicons
            name={dirIcon}
            size={12}
            color={missed ? colors.danger : colors.textTertiary}
          />
          <Text style={styles.rowMeta} numberOfLines={1}>
            {missed
              ? 'Missed'
              : matter?.shortName ?? client?.name ?? contact.phone}
          </Text>
          <View style={styles.metaDot} />
          <Text style={styles.rowMeta}>{formatRelative(call.at)}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        {!missed && call.durationSec > 0 && (
          <Text style={styles.rowDuration}>{formatDuration(call.durationSec)}</Text>
        )}
        <Pressable
          hitSlop={6}
          onPress={() => onDial(contact.id)}
          style={styles.callBtn}>
          <Ionicons name="call" size={16} color={colors.accent} />
        </Pressable>
      </View>
    </View>
  );
}

function ContactRow({
  contact,
  onDial,
}: {
  contact: Contact;
  onDial: (id: string) => void;
}) {
  const client = clientById(contact.clientId);
  const matter = contact.matterId ? matterById(contact.matterId) : undefined;
  return (
    <Pressable onPress={() => onDial(contact.id)} style={styles.row}>
      <Avatar size={44} initials={contact.initials} tone="neutral" />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {contact.firstName} {contact.lastName}
        </Text>
        <Text style={styles.rowMeta} numberOfLines={1}>
          {matter?.shortName ?? client?.name ?? contact.phone}
        </Text>
      </View>
      <View style={styles.callBtn}>
        <Ionicons name="call" size={16} color={colors.accent} />
      </View>
    </Pressable>
  );
}

// ─── Keypad ────────────────────────────────────────────────────────────────

const KEYS: { d: string; letters: string }[] = [
  { d: '1', letters: '' },
  { d: '2', letters: 'ABC' },
  { d: '3', letters: 'DEF' },
  { d: '4', letters: 'GHI' },
  { d: '5', letters: 'JKL' },
  { d: '6', letters: 'MNO' },
  { d: '7', letters: 'PQRS' },
  { d: '8', letters: 'TUV' },
  { d: '9', letters: 'WXYZ' },
  { d: '*', letters: '' },
  { d: '0', letters: '+' },
  { d: '#', letters: '' },
];

function Keypad({ onPress }: { onPress: (d: string) => void }) {
  return (
    <View style={styles.padWrap}>
      {KEYS.map((k) => (
        <Pressable
          key={k.d}
          onPress={async () => {
            await Haptics.selectionAsync();
            onPress(k.d);
          }}
          style={({ pressed }) => [
            styles.padKey,
            pressed && { backgroundColor: colors.bgSurface },
          ]}>
          <Text style={styles.padDigit}>{k.d}</Text>
          {!!k.letters && <Text style={styles.padLetters}>{k.letters}</Text>}
        </Pressable>
      ))}
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
    marginBottom: space.md,
  },
  h1: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700' },
  sub: { color: colors.textSecondary, fontSize: font.size.sm, marginTop: 2 },
  firmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  firmDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  firmBadgeText: { color: colors.accent, fontSize: 11, fontWeight: '700' },

  segmentBar: {
    flexDirection: 'row',
    gap: 4,
    marginTop: space.md,
    marginHorizontal: space.xxl,
    backgroundColor: colors.bgElevated,
    padding: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radii.pill },
  segmentActive: { backgroundColor: colors.bgSurface },
  segmentLabel: { color: colors.textSecondary, fontSize: font.size.sm, fontWeight: '500' },
  segmentLabelActive: { color: colors.textPrimary, fontWeight: '600' },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.pill,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: font.size.sm },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  rowMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  rowMeta: { color: colors.textSecondary, fontSize: font.size.xs },
  rowDuration: {
    color: colors.textSecondary,
    fontSize: font.size.xs,
    fontVariant: ['tabular-nums'],
  },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textTertiary },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { color: colors.textTertiary, fontSize: font.size.sm, marginTop: space.xl, textAlign: 'center' },

  // Keypad
  dialReadout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    minHeight: 64,
  },
  dialNumber: {
    color: colors.textPrimary,
    fontSize: 38,
    fontWeight: '600',
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
    minWidth: 80,
    textAlign: 'center',
  },
  delBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: space.lg,
    rowGap: space.md,
  },
  padKey: {
    width: '30%',
    aspectRatio: 1.1,
    borderRadius: 999,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padDigit: { color: colors.textPrimary, fontSize: 30, fontWeight: '500' },
  padLetters: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: -2,
  },
  dialCTA: {
    marginTop: space.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dialCTALabel: { color: '#fff', fontSize: font.size.md, fontWeight: '700' },
});
