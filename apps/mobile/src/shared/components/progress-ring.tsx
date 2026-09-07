import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import { useAppTheme } from '@/theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 62;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({ done, total }: { done: number; total: number }) {
  const { colors } = useAppTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(total > 0 ? done / total : 0, { duration: 400, easing: Easing.bezier(0.23, 1, 0.32, 1) }));
  }, [done, total, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.get()),
  }));

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke={colors.line} strokeWidth={STROKE} />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={colors.acc}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}
