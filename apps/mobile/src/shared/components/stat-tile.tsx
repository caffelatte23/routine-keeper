import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export function StatTile({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: fonts.figure,
          fontSize: 30,
          color: accent ? colors.acc : colors.text,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: fonts.jp,
          fontSize: 11.5,
          color: colors.muted,
          marginTop: 3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
