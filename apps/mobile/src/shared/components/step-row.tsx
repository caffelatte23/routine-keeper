import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

import type { RoutineStep } from '@/shared/stores/routine-store';

export function StepRow({ step }: { step: RoutineStep }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        minHeight: 56,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 15,
            color: colors.text,
          }}
        >
          {step.name}
        </Text>
        {step.detail ? (
          <Text
            style={{
              fontFamily: fonts.jp,
              fontSize: 12,
              color: colors.faint,
              marginTop: 3,
            }}
          >
            {step.detail}
          </Text>
        ) : null}
      </View>
      <Text style={{ fontFamily: fonts.jp, fontSize: 13, color: colors.t3 }}>
        {step.mins}
      </Text>
    </View>
  );
}
