import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const WEEK_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

export type MonthCell = {
  day: string;
  isToday: boolean;
  future: boolean;
  status: 'full' | 'partial' | 'missed' | 'none';
};

/** The month as a field of loops — one ring per day, closed when the day was. */
export function MonthGrid({ cells }: { cells: MonthCell[] }) {
  const { colors } = useAppTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {WEEK_LABELS.map((w) => (
          <Text
            key={w}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 11,
              color: colors.faint,
              fontFamily: fonts.jp,
            }}
          >
            {w}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 7 }}>
        {cells.map((c, i) => {
          const filled = c.status === 'full';
          const border = c.isToday
            ? colors.acc
            : c.status === 'full'
              ? colors.acc
              : c.status === 'partial'
                ? colors.accBorder
                : c.status === 'missed'
                  ? colors.line
                  : colors.lineSoft;
          return (
            <View
              key={i}
              style={{
                width: `${100 / 7}%`,
                height: 34,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: c.isToday ? 2 : filled ? 0 : 1,
                  borderColor: c.day ? border : 'transparent',
                  backgroundColor: filled ? colors.acc : 'transparent',
                }}
              >
                {c.day ? (
                  <Text
                    style={{
                      fontFamily: fonts.figure,
                      fontSize: 13,
                      color: filled
                        ? colors.onAcc
                        : c.isToday
                          ? colors.acc
                          : c.future
                            ? colors.dim
                            : colors.t2,
                    }}
                  >
                    {c.day}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
