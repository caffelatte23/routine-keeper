import { Text, View } from 'react-native';
import { useAppTheme } from '@/theme/colors';

export function StatTile({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        borderRadius: 14,
        backgroundColor: accent ? colors.tileFrom : colors.surface,
        boxShadow: `0 0 0 1px ${accent ? colors.accBorder : colors.line}`,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: '500',
          fontFamily: 'NotoSansJP_500Medium',
          color: accent ? colors.accStrong : colors.text,
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'NotoSansJP_400Regular', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}
