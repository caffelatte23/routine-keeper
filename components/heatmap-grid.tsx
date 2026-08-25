import { View } from 'react-native';
import { useAppTheme } from '@/theme/colors';

export function HeatmapGrid({ pattern }: { pattern: number[] }) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {pattern.map((v, i) => {
        const style =
          v === 2
            ? { bg: colors.heatFull, border: colors.heatFull }
            : v === 1
              ? { bg: colors.heatPart, border: colors.heatPartBorder }
              : { bg: 'transparent', border: colors.line };
        return (
          <View
            key={i}
            style={{
              width: '12.28%',
              aspectRatio: 1,
              borderRadius: 6,
              backgroundColor: style.bg,
              boxShadow: `0 0 0 1px ${style.border}`,
            }}
          />
        );
      })}
    </View>
  );
}
