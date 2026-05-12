import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { avatarSource } from '@/lib/mock';
import { colors, font } from '@/lib/tokens';

// Avatar — bundled photo if we have one for this person, otherwise a colored
// disc with their initials. Used everywhere a face needs to appear.
export function Avatar({
  size = 40,
  avatarKey,
  initials,
  tone = 'green',
  ring = false,
}: {
  size?: number;
  avatarKey?: string;
  initials?: string;
  tone?: 'green' | 'neutral' | 'amber' | 'red';
  ring?: boolean;
}) {
  const src = avatarKey ? avatarSource[avatarKey] : undefined;
  const radius = size / 2;
  const toneBg = {
    green: colors.accentSoft,
    neutral: colors.bgSurface,
    amber: colors.warningSoft,
    red: colors.dangerSoft,
  }[tone];
  const toneFg = {
    green: colors.accent,
    neutral: colors.textPrimary,
    amber: colors.warning,
    red: colors.danger,
  }[tone];

  const ringStyle = ring
    ? {
        borderWidth: 2,
        borderColor: colors.accent,
        padding: 2,
        width: size + 8,
        height: size + 8,
        borderRadius: (size + 8) / 2,
      }
    : null;

  const inner = src ? (
    <Image
      source={src}
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: colors.bgElevated }}
      contentFit="cover"
      transition={120}
    />
  ) : (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius, backgroundColor: toneBg },
      ]}>
      <Text style={[styles.fallbackText, { color: toneFg, fontSize: Math.max(11, size * 0.38) }]}>
        {(initials ?? '?').slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );

  if (!ringStyle) return inner;
  return <View style={[styles.ringWrap, ringStyle]}>{inner}</View>;
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
  fallbackText: { fontWeight: '700', letterSpacing: 0.3 },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
});
