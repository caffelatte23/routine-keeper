import { Pressable, Text } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export function CelebrationOverlay({
  streakDays,
  onDismiss,
}: {
  streakDays: number;
  onDismiss: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(240)}
      exiting={FadeOut.duration(180)}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 44,
        backgroundColor: colors.celebTo,
      }}
    >
      <Animated.View
        entering={ZoomIn.springify().damping(13).delay(80)}
        style={{
          width: 132,
          height: 132,
          borderRadius: 999,
          borderWidth: 3,
          borderColor: colors.acc,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 72px 10px ${colors.accTint}`,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.figure,
            fontSize: 52,
            lineHeight: 56,
            color: colors.acc,
          }}
        >
          {streakDays}
        </Text>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 11.5,
            color: colors.faint,
            marginTop: 2,
          }}
        >
          日つづけて
        </Text>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.duration(320).delay(220)}
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 24,
          color: colors.text,
          marginBottom: 10,
        }}
      >
        ループが閉じました
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.duration(320).delay(300)}
        style={{
          fontFamily: fonts.jp,
          fontSize: 14,
          lineHeight: 24,
          color: colors.t2,
          textAlign: 'center',
          marginBottom: 34,
          maxWidth: 280,
        }}
      >
        今日のルーティンをすべて閉じました。
      </Animated.Text>
      <Pressable
        onPress={onDismiss}
        hitSlop={16}
        style={{ minHeight: 44, justifyContent: 'center' }}
      >
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 15,
            color: colors.acc,
          }}
        >
          閉じる
        </Text>
      </Pressable>
    </Animated.View>
  );
}
