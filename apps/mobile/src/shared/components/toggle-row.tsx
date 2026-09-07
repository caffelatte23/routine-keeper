import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const EASE = Easing.bezier(0.23, 1, 0.32, 1);

export function ToggleRow({
  name,
  detail,
  on,
  onToggle,
}: {
  name: string;
  detail: string;
  on: boolean;
  onToggle: () => void;
}) {
  const { colors } = useAppTheme();
  const knob = useSharedValue(on ? 22 : 3);

  useEffect(() => {
    knob.set(withTiming(on ? 22 : 3, { duration: 180, easing: EASE }));
  }, [on, knob]);

  const knobStyle = useAnimatedStyle(() => ({ left: knob.get() }));

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
        minHeight: 62,
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
          {name}
        </Text>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 12,
            lineHeight: 18,
            color: colors.muted,
            marginTop: 3,
          }}
        >
          {detail}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onToggle();
        }}
        hitSlop={10}
        accessibilityRole='switch'
        accessibilityState={{ checked: on }}
        accessibilityLabel={name}
        style={{
          width: 47,
          height: 28,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: on ? colors.acc : colors.dim,
          backgroundColor: on ? colors.acc : 'transparent',
        }}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 3,
              width: 20,
              height: 20,
              borderRadius: 999,
              backgroundColor: on ? colors.onAcc : colors.muted,
            },
            knobStyle,
          ]}
        />
      </Pressable>
    </View>
  );
}
