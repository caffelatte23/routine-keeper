import { View } from 'react-native';

import { useAppTheme } from '@/theme/colors';

const BAR_W = 4;
const GAP = 5;
const MAX_H = 22;

/**
 * The last two weeks as a rhythm — one slim bar per day. Full bar = the day was
 * closed, half = partial / grace, stub = missed. The final bar is today, drawn
 * in the accent whatever its state so it reads as live.
 */
export function RhythmStrip({ pattern }: { pattern: number[] }) {
  const { colors } = useAppTheme();
  const last = pattern.length - 1;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: GAP,
        height: MAX_H,
      }}
    >
      {pattern.map((v, i) => {
        const isToday = i === last;
        const height = v === 2 ? MAX_H : v === 1 ? 12 : isToday ? 7 : 5;
        const color = isToday
          ? colors.acc
          : v === 2
            ? colors.acc
            : v === 1
              ? colors.accBorder
              : colors.line;
        return (
          <View
            key={i}
            style={{
              width: BAR_W,
              height,
              borderRadius: 2,
              backgroundColor: color,
            }}
          />
        );
      })}
    </View>
  );
}
