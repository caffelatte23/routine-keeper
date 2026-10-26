import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const LABELS = ['月', '火', '水', '木', '金', '土', '日'];

/** Mon–Sun toggles; `days` is the routine's `activeDays` (月..日). */
export function DayChips({
  days,
  onToggle,
}: {
  days: boolean[];
  onToggle: (index: number) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      {LABELS.map((label, i) => {
        const on = days[i] === true;
        return (
          <View key={label} style={{ flex: 1, alignItems: 'center' }}>
            <Pressable
              onPress={() => {
                onToggle(i);
              }}
              accessibilityRole='checkbox'
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${label}曜日`}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: on ? 0 : 1,
                borderColor: colors.line,
                backgroundColor: on ? colors.text : 'transparent',
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.jpMedium,
                  fontSize: 14,
                  color: on ? colors.bg : colors.muted,
                }}
              >
                {label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
