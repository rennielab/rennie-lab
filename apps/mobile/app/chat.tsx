// Campfire chat — single firm-wide thread, Basecamp-style. Full-screen on
// mobile (no slide-out — slide-outs are awkward on a phone). Messages
// grouped by author when consecutive, @mention typeahead in the composer,
// presence dots and "typing" affordances. Mirrors the web Campfire shape.

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import {
  activeMentionToken,
  markRead,
  MENTIONS,
  sendMessage,
  useChatMessages,
  type ChatMessage,
  type Mention,
} from '@/lib/chat';
import { firm } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Chat() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const messages = useChatMessages();
  const [draft, setDraft] = useState('');
  const [caret, setCaret] = useState(0);
  const [mentions, setMentions] = useState<string[]>([]);
  const listRef = useRef<FlatList<Group>>(null);

  // Mark thread read when the user opens it.
  useEffect(() => {
    markRead();
  }, []);

  // Scroll to bottom on mount and whenever a new message comes in.
  useEffect(() => {
    const id = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(id);
  }, [messages.length]);

  const mentionToken = activeMentionToken(draft, caret);
  const mentionMatches = useMemo<Mention[]>(() => {
    if (mentionToken == null) return [];
    const q = mentionToken.toLowerCase();
    return MENTIONS.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 4);
  }, [mentionToken]);

  const onPickMention = (m: Mention) => {
    if (mentionToken == null) return;
    Haptics.selectionAsync();
    const before = draft.slice(0, caret - mentionToken.length - 1); // drop "@token"
    const after = draft.slice(caret);
    const insert = `@${m.name} `;
    const next = `${before}${insert}${after}`;
    setDraft(next);
    setCaret(before.length + insert.length);
    setMentions((prev) => (prev.includes(m.id) ? prev : [...prev, m.id]));
  };

  const onSend = async () => {
    const body = draft.trim();
    if (!body) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(body, mentions);
    setDraft('');
    setMentions([]);
    setCaret(0);
  };

  // Group messages: a "group" is consecutive messages by the same author.
  const grouped = useMemo(() => groupMessages(messages), [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + space.md }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Message Center</Text>
          <Text style={styles.subtitle}>{firm.name} · Reyes v. Horizon</Text>
        </View>
        <View style={styles.presenceWrap}>
          {MENTIONS.slice(0, 3).map((m, i) => (
            <View key={m.id} style={[styles.presenceAvatar, { marginLeft: i === 0 ? 0 : -10 }]}>
              <Avatar
                size={26}
                avatarKey={m.avatarKey}
                initials={m.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
                tone={m.side === 'client' ? 'amber' : 'green'}
              />
            </View>
          ))}
        </View>
      </View>

      {/* ── Messages ── */}
      <FlatList
        ref={listRef}
        data={grouped}
        keyExtractor={(g) => g.id}
        contentContainerStyle={{
          paddingHorizontal: space.xxl,
          paddingTop: space.md,
          paddingBottom: space.xl,
        }}
        renderItem={({ item, index }) => (
          <Bubble group={item} showDate={shouldShowDate(grouped, index)} />
        )}
        ListEmptyComponent={
          <Text style={{ color: colors.textTertiary, textAlign: 'center', marginTop: 80 }}>
            No messages yet.
          </Text>
        }
      />

      {/* ── @mention typeahead ── */}
      {mentionMatches.length > 0 && (
        <View style={styles.mentionWrap}>
          {mentionMatches.map((m) => (
            <Pressable key={m.id} onPress={() => onPickMention(m)} style={styles.mentionRow}>
              <Avatar
                size={28}
                avatarKey={m.avatarKey}
                initials={m.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
                tone={m.side === 'client' ? 'amber' : 'green'}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.mentionName}>{m.name}</Text>
                <Text style={styles.mentionRole}>{m.role}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {/* ── Composer ── */}
      <View style={[styles.composer, { paddingBottom: insets.bottom + space.sm }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSelectionChange={(e) => setCaret(e.nativeEvent.selection.end)}
          placeholder="Message the team or your client…"
          placeholderTextColor={colors.textTertiary}
          multiline
          style={styles.input}
        />
        <Pressable
          onPress={onSend}
          disabled={!draft.trim()}
          style={({ pressed }) => [
            styles.sendBtn,
            !draft.trim() && { opacity: 0.4 },
            pressed && { opacity: 0.85 },
          ]}>
          <Ionicons name="arrow-up" size={20} color={colors.bg} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Bubble / grouping ──────────────────────────────────────────────────────

type Group = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorAvatarKey?: string;
  side: 'firm' | 'client';
  messages: ChatMessage[];
  at: number;
};

function groupMessages(messages: ChatMessage[]): Group[] {
  const out: Group[] = [];
  for (const m of messages) {
    const last = out[out.length - 1];
    if (last && last.authorId === m.authorId && m.at - last.messages[last.messages.length - 1].at < 5 * 60 * 1000) {
      last.messages.push(m);
    } else {
      out.push({
        id: m.id,
        authorId: m.authorId,
        authorName: m.authorName,
        authorInitials: m.authorInitials,
        authorAvatarKey: m.authorAvatarKey,
        side: m.side,
        messages: [m],
        at: m.at,
      });
    }
  }
  return out;
}

function shouldShowDate(groups: Group[], i: number) {
  if (i === 0) return true;
  const prev = new Date(groups[i - 1].at);
  const cur = new Date(groups[i].at);
  return prev.toDateString() !== cur.toDateString();
}

function Bubble({ group, showDate }: { group: Group; showDate: boolean }) {
  const isMe = group.authorId === 'sophia';
  const time = new Date(group.at).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View>
      {showDate && (
        <View style={styles.dateDivider}>
          <View style={styles.dateLine} />
          <Text style={styles.dateLabel}>{formatDateLabel(group.at)}</Text>
          <View style={styles.dateLine} />
        </View>
      )}
      <View style={[styles.row, isMe && { justifyContent: 'flex-end' }]}>
        {!isMe && (
          <Avatar
            size={32}
            avatarKey={group.authorAvatarKey}
            initials={group.authorInitials}
            tone={group.side === 'client' ? 'amber' : 'green'}
          />
        )}
        <View style={[styles.bubbleStack, isMe && { alignItems: 'flex-end' }]}>
          {!isMe && (
            <View style={styles.metaRow}>
              <Text style={styles.author}>{group.authorName}</Text>
              {group.side === 'client' && (
                <View style={styles.clientBadge}>
                  <Text style={styles.clientBadgeText}>CLIENT</Text>
                </View>
              )}
              <Text style={styles.metaTime}>{time}</Text>
            </View>
          )}
          {group.messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                isMe ? styles.bubbleMe : styles.bubbleThem,
                group.side === 'client' && !isMe && styles.bubbleClient,
              ]}>
              <RichBody body={m.body} isMe={isMe} />
            </View>
          ))}
          {isMe && <Text style={styles.metaTimeMe}>{time}</Text>}
        </View>
      </View>
    </View>
  );
}

// Render @Name mentions in accent green inline.
function RichBody({ body, isMe }: { body: string; isMe: boolean }) {
  const parts = body.split(/(@[A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/g);
  return (
    <Text style={[styles.bubbleText, isMe && { color: colors.bg }]}>
      {parts.map((p, i) =>
        p.startsWith('@') ? (
          <Text
            key={i}
            style={[
              styles.mentionInline,
              isMe && { color: '#143729', fontWeight: '700' },
            ]}>
            {p}
          </Text>
        ) : (
          <Text key={i}>{p}</Text>
        ),
      )}
    </Text>
  );
}

function formatDateLabel(at: number) {
  const d = new Date(at);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 60 * 60 * 1000;
  if (d >= today) return 'Today';
  if (d.getTime() >= today.getTime() - dayMs) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.xxl,
    paddingBottom: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  subtitle: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
  presenceWrap: { flexDirection: 'row', alignItems: 'center' },
  presenceAvatar: {
    borderWidth: 2,
    borderColor: colors.bg,
    borderRadius: 99,
  },

  // Bubbles
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: space.md,
  },
  dateLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dateLabel: { color: colors.textTertiary, fontSize: 11, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, marginBottom: space.md },
  bubbleStack: { gap: 4, maxWidth: '78%' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  author: { color: colors.textPrimary, fontSize: font.size.xs, fontWeight: '700' },
  metaTime: { color: colors.textTertiary, fontSize: 10 },
  metaTimeMe: { color: colors.textTertiary, fontSize: 10, marginTop: 2 },
  clientBadge: {
    backgroundColor: colors.warningSoft,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  clientBadgeText: { color: colors.warning, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  bubbleThem: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 4,
  },
  bubbleClient: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  bubbleMe: {
    backgroundColor: colors.accent,
    borderTopRightRadius: 4,
  },
  bubbleText: { color: colors.textPrimary, fontSize: font.size.sm, lineHeight: 20 },
  mentionInline: { color: colors.accent, fontWeight: '700' },

  // Composer
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: space.xxl,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: font.size.sm,
    backgroundColor: colors.bgElevated,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mention typeahead
  mentionWrap: {
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 4,
  },
  mentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.xxl,
    paddingVertical: 8,
  },
  mentionName: { color: colors.textPrimary, fontSize: font.size.sm, fontWeight: '600' },
  mentionRole: { color: colors.textSecondary, fontSize: 11, marginTop: 1 },
});
