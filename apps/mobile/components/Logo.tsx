import { View } from 'react-native';

import L1 from '@/assets/logo/l1.svg';
import L2 from '@/assets/logo/l2.svg';
import L3 from '@/assets/logo/l3.svg';
import L4 from '@/assets/logo/l4.svg';
import L5 from '@/assets/logo/l5.svg';
import L6 from '@/assets/logo/l6.svg';

import { colors } from '@/lib/tokens';

// Letter dimensions from the Figma export — preserving aspect ratios as we scale.
const LETTERS = [
  { Svg: L1, w: 28.523, h: 31.859 },
  { Svg: L2, w: 22.382, h: 30.814 },
  { Svg: L3, w: 33.015, h: 31.901 },
  { Svg: L4, w: 28.706, h: 31.925 },
  { Svg: L5, w: 28.238, h: 30.852 },
  { Svg: L6, w: 39.454, h: 30.811 },
] as const;

const TOTAL_W = LETTERS.reduce((a, l) => a + l.w, 0) + (LETTERS.length - 1) * 4; // 4px gap
const MAX_H = Math.max(...LETTERS.map((l) => l.h));

// Color is baked into the SVGs as #22C55E. Recoloring the logo would require
// re-parsing the SVGs; for the prototype we lock it to the brand green.
export function Logo({ height = 32 }: { height?: number }) {
  const scale = height / MAX_H;
  const width = TOTAL_W * scale;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 * scale, height, width }}>
      {LETTERS.map(({ Svg, w, h }, i) => (
        <Svg key={i} width={w * scale} height={h * scale} />
      ))}
    </View>
  );
}
