import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * The day's loop. One large ring whose arc is today's progress, the count set
 * as a figure inside it. This is the hero of the Today screen — it sits in open
 * space, not in a card.
 */
export function ProgressRing({
  done,
  total,
  size = 150,
}: {
  done: number;
  total: number;
  size?: number;
}) {
  const { colors } = useAppTheme();
  const stroke = size * 0.035;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const closed = total > 0 && done >= total;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(
      withTiming(total > 0 ? done / total : 0, {
        duration: 520,
        easing: Easing.bezier(0.22, 1, 0.32, 1),
      }),
    );
  }, [done, total, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.get()),
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke={colors.line}
          strokeWidth={stroke}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          stroke={colors.acc}
          strokeWidth={stroke}
          strokeLinecap='round'
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: fonts.figureBold,
            fontSize: size * 0.4,
            lineHeight: size * 0.44,
            letterSpacing: -1,
            color: closed ? colors.acc : colors.text,
          }}
        >
          {done}
        </Text>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: size * 0.09,
            color: colors.faint,
            marginTop: size * 0.02,
          }}
        >
          / {total}
        </Text>
      </View>
    </View>
  );
}
