import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, radius, space, type } from "../theme";
import type { FeedItem, LanternVerdict } from "../types";

/** Placeholder feed until the family-circle backend exists. */
const SAMPLE_FEED: FeedItem[] = [
  {
    id: "1",
    member: "Mum",
    note: "Scam blocked: fake Medicare renewal text. No reply sent.",
    verdict: "scam",
    when: "Today, 9:41 am",
  },
  {
    id: "2",
    member: "Mum",
    note: "Checked a parcel-delivery text — it was a real AusPost notice.",
    verdict: "likely_safe",
    when: "Yesterday",
  },
  {
    id: "3",
    member: "Dad",
    note: "Suspicious 'bank security' call — hung up, no details shared.",
    verdict: "suspicious",
    when: "Monday",
  },
];

const DOT: Record<LanternVerdict, string> = {
  scam: colors.scam,
  suspicious: colors.caution,
  likely_safe: colors.safe,
  unclear: colors.indigoSoft,
};

export function FamilyScreen() {
  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={SAMPLE_FEED}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Your family circle</Text>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>
              scams blocked this month{"\n"}across your family
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: DOT[item.verdict] }]} />
          <View style={styles.rowBody}>
            <Text style={styles.rowMember}>
              {item.member} <Text style={styles.rowWhen}>· {item.when}</Text>
            </Text>
            <Text style={styles.rowNote}>{item.note}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: space.m, paddingBottom: space.xl * 2 },
  title: {
    fontSize: type.display,
    fontWeight: "800",
    color: colors.ink,
  },
  statCard: {
    marginTop: space.m,
    marginBottom: space.s,
    backgroundColor: colors.indigo,
    borderRadius: radius.card,
    padding: space.l,
    flexDirection: "row",
    alignItems: "center",
    gap: space.m,
  },
  statNum: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.amber,
  },
  statLabel: {
    flex: 1,
    fontSize: type.body,
    lineHeight: 25,
    color: colors.inkOnDark,
  },
  row: {
    flexDirection: "row",
    gap: space.s,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.m,
    marginTop: space.s,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 6 },
  rowBody: { flex: 1 },
  rowMember: { fontSize: type.body, fontWeight: "800", color: colors.ink },
  rowWhen: { fontWeight: "400", color: colors.inkSoft, fontSize: type.small },
  rowNote: {
    fontSize: type.body,
    color: colors.inkSoft,
    lineHeight: 26,
    marginTop: 4,
  },
});
