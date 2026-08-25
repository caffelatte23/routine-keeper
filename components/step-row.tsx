import { Text, View } from 'react-native';
import { DotsSixVertical } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';
import type { RoutineStep } from '@/state/routine-store';

export function StepRow({ step }: { step: RoutineStep }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 15,
        minHeight: 56,
        borderRadius: 14,
        backgroundColor: colors.surface,
        boxShadow: `0 0 0 1px ${colors.line}`,
      }}
    >
      <DotsSixVertical size={20} color={colors.dim} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text }}>
          {step.name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.faint, fontFamily: 'NotoSansJP_400Regular', marginTop: 2 }}>
          {step.detail}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.accTint }}>
        <Text style={{ fontSize: 13, color: colors.accStrong, fontFamily: 'NotoSansJP_400Regular' }}>{step.mins}</Text>
      </View>
    </View>
  );
}
