// Calls — the front door. The app opens looking like a phone because that's
// what it is: the firm phone. Every call through it gets captured and billed.
// iPhone-style keypad by default, with Keypad / Contacts / Recents segments
// up top (white = inactive, lime = active). "You" lives top-right.

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
import { BHBadge } from '@/components/BHLogo';
import {
  clientById,
  contacts,
  contactById,
  currentLawyer,
  formatDuration,
  formatRelative,
  matterById,
  recentCalls,
  type Contact,
  type RecentCall,
} from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

type Mode = 'keypad' | 'contacts' | 'recents';

export default function Calls() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('keypad');
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
    else if (dialed.length >= 4) {
      // Cold dial — route to the first contact as a demo stand-in
      router.push({ pathname: '/call', params: { contactId: contacts[0].id } });
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.sm }]}>
      {/* ── Header: firm identity left, You top-right ── */}
      <View style={styles.header}>
        <View style={styles.firmRow}>
          <BHBadge size={20} />
          <View>
            <Text style={styles.firmName}>Bennett &amp; Hayes</Text>
            <Text style={styles.firmNumber}>Firm line · (415) 555-0100</Text>
          </View>
        </View>
        <Pressable
          hitSlop={8}
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.youBtn}>
          <Avatar
            size={34}
            avatarKey={currentLawyer.avatarKey}
            initials={currentLawyer.initials}
          />
        </Pressable>
      </View>

      {/* ── Segments: white inactive, lime active ── */}
      <View style={styles.segments}>
        {(
          [
            ['keypad', 'Keypad'],
            ['contacts', 'Contacts'],
            ['recents', 'Recents'],
          ] as const
        ).map(([key, label]) => {
          const active = mode === key;
          return (
            <Pressable
              key={key}
              onPress={() => {
                Haptics.selectionAsync();
                setMode(key);
              }}
              style={styles.segment}
              hitSlop={6}>
              <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                {label}
              </Text>
              <View style={[styles.segmentBar, active && styles.segmentBarActive]} />
            </Pressable>
          );
        })}
      </View>

      {/* ── KEYPAD ── */}
      {mode === 'keypad' && (
        <View style={styles.keypadWrap}>
          <View style={styles.dialReadout}>
            <Text style={styles.dialNumber} numberOfLines={1} adjustsFontSizeToFit>
              {formatDialed(dialed) || ' '}
            </Text>
            {!!dialed && (
              <Pressable
                hitSlop={10}
                onPress={() => setDialed((d) => d.slice(0, -1))}
                onLongPress={() => setDialed('')}
                style={styles.delBtn}>
                <Ionicons name="backspace" size={24} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>

          <Keypad onPress={(d) => setDialed((s) => (s.length < 15 ? s + d : s))} />

          <View style={styles.callRow}>
            <View style={{ width: 56 }} />
            <Pressable
              onPress={() => onDial()}
              disabled={dialed.length < 4}
              style={({ pressed }) => [
                styles.callBtn,
                dialed.length < 4 && { opacity: 0.35 },
                pressed && { transform: [{ scale: 0.95 }] },
              ]}>
              <Ionicons name="call" size={30} color="#fff" />
            </Pressable>
            <View style={{ width: 56 }} />
          </View>
        </View>
      )}

      {/* ── CONTACTS ── */}
      {mode === 'contacts' && (
        <View style={{ flex: 1 }}>
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

      {/* ── RECENTS ── */}
      {mode === 'recents' && (
        <ScrollView
          style={{ flex: 1, marginTop: space.sm }}
          contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: space.xxl }}
          showsVerticalScrollIndicator={false}>
          {recentCalls.map((c) => (
            <RecentRow key={c.id} call={c} onDial={onDial} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// E.164-ish pretty printing for the readout: 4155550142 → (415) 555-0142
function formatDialed(d: string): string {
  if (d.length === 0) return '';
  if (/[*#]/.test(d) || d.startsWith('+')) return d;
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return d;
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
      <Avatar size={44} initials={contact.initials} tone={missed ? 'red' : 'green'} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.rowTitle, missed && { color: colors.danger }]} numberOfLines={1}>
          {contact.firstName} {contact.lastName}
        </Text>
        <View style={styles.rowMetaRow}>
          <Ionicons name={dirIcon} size={12} color={missed ? colors.danger : colors.textTertiary} />
          <Text style={styles.rowMeta} numberOfLines={1}>
            {missed ? 'Missed' : matter?.shortName ?? client?.name ?? contact.phone}
          </Text>
          <View style={styles.metaDot} />
          <Text style={styles.rowMeta}>{formatRelative(call.at)}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        {!missed && call.durationSec > 0 && (
          <Text style={styles.rowDuration}>{formatDuration(call.durationSec)}</Text>
        )}
        <Pressable hitSlop={6} onPress={() => onDial(contact.id)} style={styles.rowCallBtn}>
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
      <View style={styles.rowCallBtn}>
        <Ionicons name="call" size={16} color={colors.accent} />
      </View>
    </Pressable>
  );
}

// ─── Keypad — iPhone proportions ───────────────────────────────────────────

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
          onPress={() => {
            Haptics.selectionAsync();
            onPress(k.d);
          }}
          style={({ pressed }) => [styles.padKey, pressed && styles.padKeyPressed]}>
          <Text style={styles.padDigit}>{k.d}</Text>
          <Text style={styles.padLetters}>{k.letters || ' '}</Text>
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
    paddingVertical: space.sm,
  },
  firmRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  firmName: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '700' },
  firmNumber: { color: colors.textTertiary, fontSize: 11, marginTop: 1 },
  youBtn: { padding: 2 },

  // Segments — white inactive, lime active, iPhone-clean
  segments: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.xxl,
    paddingTop: space.sm,
    paddingBottom: space.xs,
  },
  segment: { alignItems: 'center', gap: 6 },
  segmentLabel: {
    color: '#FFFFFF',
    fontSize: font.size.base,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  segmentLabelActive: { color: colors.accent, fontWeight: '700' },
  segmentBar: { width: 28, height: 3, borderRadius: 1.5, backgroundColor: 'transparent' },
  segmentBarActive: { backgroundColor: colors.accent },

  // Keypad layout
  keypadWrap: { flex: 1, paddingHorizontal: 40, justifyContent: 'flex-end', paddingBottom: 132 },
  dialReadout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginBottom: space.md,
  },
  dialNumber: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '500',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    flexShrink: 1,
  },
  delBtn: { position: 'absolute', right: 0, padding: 8 },

  padWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  padKey: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padKeyPressed: { backgroundColor: colors.bgSurface },
  padDigit: { color: colors.textPrimary, fontSize: 32, fontWeight: '500', lineHeight: 38 },
  padLetters: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginTop: -2,
  },

  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.lg,
  },
  callBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  // Contacts / recents shared
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
    marginTop: space.sm,
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
  rowCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: colors.textTertiary,
    fontSize: font.size.sm,
    marginTop: space.xl,
    textAlign: 'center',
  },
});
