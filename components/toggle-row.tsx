import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { useAppTheme } from '@/theme/colors';

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
  const knob = useSharedValue(on ? 24 : 3);

  useEffect(() => {
    knob.set(withTiming(on ? 24 : 3, { duration: 180, easing: EASE }));
  }, [on, knob]);

  const knobStyle = useAnimatedStyle(() => ({ left: knob.get() }));

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        minHeight: 62,
        borderRadius: 14,
        backgroundColor: colors.surface,
        boxShadow: `0 0 0 1px ${colors.line}`,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text }}>
          {name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'NotoSansJP_400Regular', marginTop: 2, lineHeight: 18 }}>
          {detail}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onToggle();
        }}
        hitSlop={8}
        style={{
          width: 50,
          height: 30,
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
              width: 22,
              height: 22,
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
