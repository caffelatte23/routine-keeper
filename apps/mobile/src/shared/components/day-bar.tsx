import { Text, View } from 'react-native';

import { dayFraction } from '@/lib/day';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export interface DayBarBlock {
  key: string;
  start: number; // minutes since midnight
  end: number;
  color: string;
}

const TICKS = ['6:00', '12:00', '18:00', '24:00'];

/** The day from 6:00 to 24:00 as one bar: a block per routine, a marker for now. */
export function DayBar({
  blocks,
  now,
}: {
  blocks: DayBarBlock[];
  now: number;
}) {
  const { colors } = useAppTheme();
  const pct = (min: number) => `${dayFraction(min) * 100}%` as const;

  return (
    <View accessible accessibilityLabel='一日の流れ' style={{ gap: 8 }}>
      <View
        style={{
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.surface2,
        }}
      >
        {blocks.map((b) => (
          <View
            key={b.key}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: pct(b.start),
              width: `${(dayFraction(b.end) - dayFraction(b.start)) * 100}%`,
              minWidth: 8,
              borderRadius: 6,
              backgroundColor: b.color,
            }}
          />
        ))}
        <View
          style={{
            position: 'absolute',
            left: pct(now),
            top: -5,
            width: 3,
            height: 22,
            marginLeft: -1.5,
            borderRadius: 2,
            backgroundColor: colors.text,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {TICKS.map((t) => (
          <Text
            key={t}
            style={{
              fontFamily: fonts.figure,
              fontSize: 12,
              color: colors.muted,
            }}
          >
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
}
