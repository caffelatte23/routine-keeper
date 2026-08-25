import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme/colors';

const LABELS = ['月', '火', '水', '木', '金', '土', '日'];

export function DayChips({ days }: { days: boolean[] }) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {LABELS.map((label, i) => {
        const on = days[i];
        return (
          <View
            key={label}
            style={{
              flex: 1,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: on ? colors.accTint : 'transparent',
              boxShadow: `0 0 0 1px ${on ? colors.accBorder : colors.line}`,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                fontFamily: 'NotoSansJP_500Medium',
                color: on ? colors.accStrong : colors.faint,
              }}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
