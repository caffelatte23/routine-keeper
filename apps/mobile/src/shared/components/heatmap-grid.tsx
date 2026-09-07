import { View } from 'react-native';

import { useAppTheme } from '@/theme/colors';

const DOT = 15;
const GAP = 9;

/** Four weeks as a chain of small loops: filled = closed, outline = partial. */
export function HeatmapGrid({ pattern }: { pattern: number[] }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
        width: 7 * DOT + 6 * GAP,
      }}
    >
      {pattern.map((v, i) => (
        <View
          key={i}
          style={{
            width: DOT,
            height: DOT,
            borderRadius: 999,
            borderWidth: v === 0 ? 1 : 1.5,
            borderColor: v === 0 ? colors.line : colors.acc,
            backgroundColor: v === 2 ? colors.acc : 'transparent',
          }}
        />
      ))}
    </View>
  );
}
