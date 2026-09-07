import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const LABELS = ['月', '火', '水', '木', '金', '土', '日'];

export function DayChips({ days }: { days: boolean[] }) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      {LABELS.map((label, i) => {
        const on = days[i];
        return (
          <View key={label} style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: on ? 0 : 1,
                borderColor: colors.line,
                backgroundColor: on ? colors.acc : 'transparent',
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.jpMedium,
                  fontSize: 13,
                  color: on ? colors.onAcc : colors.faint,
                }}
              >
                {label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
