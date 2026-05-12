import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { contactById, contacts, matterById } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

export default function Call() {
  const params = useLocalSearchParams<{ contactId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const contact = contactById(params.contactId ?? '') ?? contacts[0];
  const matter = contact.matterId ? matterById(contact.matterId) : undefined;

  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [doNotBill, setDoNotBill] = useState(false);

  // pulsing ring around the avatar
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const onEnd = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace('/processing');
  };

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0] });

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.huge }]}>
      <View style={styles.avatarWrap}>
        <Animated.View style={[styles.pulseRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{contact.initials}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.name}>
        {contact.firstName} {contact.lastName}
      </Text>
      {matter && <Text style={styles.matter}>{matter.shortName}</Text>}

      <Text style={styles.timer}>
        {hh} : {mm} : {ss}
      </Text>

      <View style={styles.toggleRow}>
        <Switch
          value={doNotBill}
          onValueChange={setDoNotBill}
          trackColor={{ false: colors.bgSurface, true: colors.warningSoft }}
          thumbColor={doNotBill ? colors.warning : '#cccccc'}
        />
        <Text style={styles.toggleLabel}>Do not bill</Text>
      </View>

      <View style={[styles.controls, { paddingBottom: insets.bottom + space.huge }]}>
        <ControlButton
          icon={muted ? 'mic-off' : 'mic'}
          label="Mute"
          active={muted}
          onPress={() => setMuted((m) => !m)}
        />
        <Pressable
          onPress={onEnd}
          style={({ pressed }) => [styles.endButton, pressed && { transform: [{ scale: 0.96 }] }]}>
          <Ionicons name="call" size={26} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
        </Pressable>
        <ControlButton
          icon={speaker ? 'volume-high' : 'volume-medium-outline'}
          label="Speaker"
          active={speaker}
          onPress={() => setSpeaker((s) => !s)}
        />
      </View>
    </View>
  );
}

function ControlButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', gap: space.sm }}>
      <View style={[styles.ctrlBtn, active && styles.ctrlBtnActive]}>
        <Ionicons name={icon} size={20} color={active ? colors.accent : colors.textPrimary} />
      </View>
      <Text style={styles.ctrlLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', paddingHorizontal: space.xxl },
  avatarWrap: { alignItems: 'center', justifyContent: 'center', marginTop: space.huge },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accent,
  },
  avatarRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accentSoft,
  },
  avatarText: { color: colors.accent, fontSize: 30, fontWeight: '700' },
  name: { color: colors.textPrimary, fontSize: font.size.xxl, fontWeight: '700', marginTop: space.xxl },
  matter: { color: colors.textSecondary, fontSize: font.size.base, marginTop: space.xs },
  timer: {
    color: colors.accent,
    fontSize: 52,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginTop: space.xxl,
    letterSpacing: 1,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.xl },
  toggleLabel: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '500' },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: space.xxl,
    right: space.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctrlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctrlBtnActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  ctrlLabel: { color: colors.textPrimary, fontSize: font.size.xs, fontWeight: '500' },
  endButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
