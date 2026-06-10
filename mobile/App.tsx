import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CheckScreen } from "./src/screens/CheckScreen";
import { FamilyScreen } from "./src/screens/FamilyScreen";
import { colors, space, type } from "./src/theme";

type Tab = "check" | "family";

export default function App() {
  const [tab, setTab] = useState<Tab>("check");

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.brand}>
          <Text style={styles.brandGlow}>●</Text> Lantern
        </Text>
        <Text style={styles.brandSub}>
          Keep the people you love out of the dark
        </Text>
      </View>

      {tab === "check" ? <CheckScreen /> : <FamilyScreen />}

      <View style={styles.tabs}>
        <TabButton
          label="Check a message"
          active={tab === "check"}
          onPress={() => setTab("check")}
        />
        <TabButton
          label="Family"
          active={tab === "family"}
          onPress={() => setTab("family")}
        />
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tab}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
      {active ? <View style={styles.tabUnderline} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.indigo },
  header: {
    backgroundColor: colors.indigo,
    paddingHorizontal: space.m,
    paddingTop: space.l,
    paddingBottom: space.m,
  },
  brand: {
    color: colors.inkOnDark,
    fontSize: type.title,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandGlow: { color: colors.amber },
  brandSub: {
    color: colors.inkFaintOnDark,
    fontSize: type.small,
    marginTop: 2,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.indigo,
    paddingBottom: space.s,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.m,
    minHeight: 56,
  },
  tabText: {
    color: colors.inkFaintOnDark,
    fontSize: type.body,
    fontWeight: "700",
  },
  tabTextActive: { color: colors.amber },
  tabUnderline: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.amber,
    marginTop: 6,
  },
});
