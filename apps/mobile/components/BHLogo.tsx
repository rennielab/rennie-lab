// Bennett & Hayes LLP firm mark for mobile. Forest-green tile with a serif
// "BH" — same visual as the web BHLogo so the firm identity carries across
// platforms. Use BHLogo for headers, BHBadge as a corner accent.

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib/tokens';

export function BHLogo({ size = 36, withBorder = true }: { size?: number; withBorder?: boolean }) {
  const radius = Math.max(4, size * 0.18);
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: withBorder ? 1 : 0,
        },
      ]}>
      <Text
        style={[
          styles.letters,
          { fontSize: size * 0.42, lineHeight: size * 0.55 },
        ]}>
        BH
      </Text>
    </View>
  );
}

export function BHBadge({ size = 16 }: { size?: number }) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: Math.max(3, size * 0.2), borderWidth: 0 },
      ]}>
      <Text style={[styles.letters, { fontSize: size * 0.5, lineHeight: size * 0.65 }]}>BH</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.bg,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letters: {
    color: colors.accent,
    fontWeight: '700',
    fontFamily: 'Georgia',
    letterSpacing: 0.5,
  },
});
