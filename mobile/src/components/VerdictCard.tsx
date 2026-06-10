import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space, type } from "../theme";
import type { CheckVerdict, LanternVerdict } from "../types";

const VERDICT_META: Record<
  LanternVerdict,
  { label: string; color: string }
> = {
  scam: { label: "This is a scam", color: colors.scam },
  suspicious: { label: "Be careful", color: colors.caution },
  likely_safe: { label: "Looks okay", color: colors.safe },
  unclear: { label: "We need more detail", color: colors.indigoSoft },
};

export function VerdictCard({ verdict }: { verdict: CheckVerdict }) {
  const meta = VERDICT_META[verdict.verdict];
  return (
    <View style={styles.card}>
      <View style={[styles.banner, { backgroundColor: meta.color }]}>
        <Text style={styles.bannerText}>{meta.label}</Text>
        {verdict.scamType ? (
          <Text style={styles.bannerSub}>{verdict.scamType}</Text>
        ) : null}
      </View>

      <Text style={styles.headline}>{verdict.headline}</Text>
      <Text style={styles.explanation}>{verdict.explanation}</Text>

      <Text style={styles.stepsTitle}>What to do now</Text>
      {verdict.whatToDo.map((step, i) => (
        <View key={i} style={styles.stepRow}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{i + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <View style={styles.familyNote}>
        <Text style={styles.familyNoteLabel}>Shared with your family</Text>
        <Text style={styles.familyNoteText}>{verdict.familyNote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    marginTop: space.m,
  },
  banner: {
    paddingVertical: space.m,
    paddingHorizontal: space.m,
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: type.title,
    fontWeight: "800",
  },
  bannerSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: type.small,
    marginTop: 2,
    textTransform: "capitalize",
  },
  headline: {
    fontSize: type.body + 2,
    fontWeight: "700",
    color: colors.ink,
    lineHeight: 28,
    paddingHorizontal: space.m,
    paddingTop: space.m,
  },
  explanation: {
    fontSize: type.body,
    color: colors.inkSoft,
    lineHeight: 27,
    paddingHorizontal: space.m,
    paddingTop: space.s,
  },
  stepsTitle: {
    fontSize: type.small,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.inkSoft,
    paddingHorizontal: space.m,
    paddingTop: space.l,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: space.m,
    paddingTop: space.s,
    gap: space.s,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumText: {
    color: colors.indigo,
    fontWeight: "800",
    fontSize: type.small,
  },
  stepText: {
    flex: 1,
    fontSize: type.body,
    color: colors.ink,
    lineHeight: 26,
  },
  familyNote: {
    margin: space.m,
    marginTop: space.l,
    padding: space.m,
    backgroundColor: colors.cream,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.line,
  },
  familyNoteLabel: {
    fontSize: type.small - 2,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.amberDeep,
  },
  familyNoteText: {
    fontSize: type.small + 1,
    color: colors.ink,
    marginTop: 4,
    lineHeight: 22,
  },
});
