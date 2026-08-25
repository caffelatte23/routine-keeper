import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme/colors';

const WEEK_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

export type MonthCell = {
  day: string;
  isToday: boolean;
  future: boolean;
  status: 'full' | 'partial' | 'missed' | 'none';
};

export function MonthGrid({ cells }: { cells: MonthCell[] }) {
  const { colors } = useAppTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        {WEEK_LABELS.map((w) => (
          <Text
            key={w}
            style={{ flex: 1, textAlign: 'center', fontSize: 11, color: colors.faint, fontFamily: 'NotoSansJP_400Regular' }}
          >
            {w}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {cells.map((c, i) => {
          const dot =
            c.status === 'full' ? colors.acc : c.status === 'partial' ? colors.heatPartBorder : c.status === 'missed' ? colors.line : 'transparent';
          return (
            <View
              key={i}
              style={{
                width: '12.28%',
                aspectRatio: 1,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                backgroundColor: c.isToday ? colors.accTint : 'transparent',
                boxShadow: `0 0 0 1px ${c.isToday ? colors.acc : colors.lineSoft}`,
              }}
            >
              <Text style={{ fontSize: 13, color: c.future ? colors.dim : colors.t2, fontFamily: 'NotoSansJP_400Regular' }}>
                {c.day}
              </Text>
              <View style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: dot }} />
            </View>
          );
        })}
      </View>
    </View>
  );
}
