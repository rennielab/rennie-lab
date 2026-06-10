import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { checkMessage } from "../api";
import { VerdictCard } from "../components/VerdictCard";
import { colors, radius, space, type } from "../theme";
import type { CheckVerdict, LanternChannel } from "../types";

const CHANNELS: { id: LanternChannel; label: string }[] = [
  { id: "sms", label: "Text" },
  { id: "email", label: "Email" },
  { id: "social", label: "Social" },
  { id: "call", label: "Phone call" },
  { id: "other", label: "Other" },
];

export function CheckScreen() {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<LanternChannel>("sms");
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState<CheckVerdict | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);

  async function onCheck() {
    if (!text.trim() || busy) return;
    Keyboard.dismiss();
    setBusy(true);
    setError(null);
    setVerdict(null);
    const res = await checkMessage({ text: text.trim(), channel });
    setBusy(false);
    if (res.ok && res.verdict) {
      setVerdict(res.verdict);
      setDemo(Boolean(res.demo));
    } else {
      setError(res.error ?? "Something went wrong — try again.");
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.prompt}>Got a message that feels off?</Text>
      <Text style={styles.promptSub}>
        Paste it below. Lantern will tell you if it’s a scam — and exactly
        what to do.
      </Text>

      <View style={styles.chips}>
        {CHANNELS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setChannel(c.id)}
            style={[styles.chip, channel === c.id && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                channel === c.id && styles.chipTextActive,
              ]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        multiline
        placeholder={
          channel === "call"
            ? "Describe the call in your own words…"
            : "Paste the message here…"
        }
        placeholderTextColor={colors.inkSoft}
        value={text}
        onChangeText={setText}
      />

      <Pressable
        onPress={onCheck}
        disabled={!text.trim() || busy}
        style={[styles.button, (!text.trim() || busy) && styles.buttonDim]}
      >
        {busy ? (
          <ActivityIndicator color={colors.indigo} />
        ) : (
          <Text style={styles.buttonText}>Check this message</Text>
        )}
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {verdict ? <VerdictCard verdict={verdict} /> : null}
      {verdict && demo ? (
        <Text style={styles.demoNote}>
          Demo mode — connect the API to enable real analysis.
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: space.m, paddingBottom: space.xl * 2 },
  prompt: {
    fontSize: type.display,
    fontWeight: "800",
    color: colors.ink,
    lineHeight: 38,
  },
  promptSub: {
    fontSize: type.body,
    color: colors.inkSoft,
    lineHeight: 27,
    marginTop: space.s,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.xs + 2,
    marginTop: space.l,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.chip,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.indigo,
    borderColor: colors.indigo,
  },
  chipText: { fontSize: type.small + 1, color: colors.ink, fontWeight: "600" },
  chipTextActive: { color: colors.inkOnDark },
  input: {
    marginTop: space.m,
    minHeight: 150,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.m,
    fontSize: type.body,
    lineHeight: 26,
    color: colors.ink,
    textAlignVertical: "top",
  },
  button: {
    marginTop: space.m,
    minHeight: 58,
    borderRadius: radius.button,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDim: { opacity: 0.45 },
  buttonText: {
    fontSize: type.body + 1,
    fontWeight: "800",
    color: colors.indigo,
  },
  error: {
    marginTop: space.m,
    fontSize: type.body,
    lineHeight: 26,
    color: colors.scam,
  },
  demoNote: {
    marginTop: space.s,
    fontSize: type.small,
    color: colors.inkSoft,
    textAlign: "center",
  },
});
