import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

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
      <View
        style={{
          width: 128,
          height: 128,
          borderRadius: 999,
          borderWidth: 2.5,
          borderColor: colors.acc,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 64px 6px ${colors.glow}`,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.figure,
            fontSize: 52,
            color: colors.acc,
            lineHeight: 56,
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
      </View>

      <Text
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 24,
          color: colors.text,
          marginBottom: 10,
        }}
      >
        ループが閉じました
      </Text>
      <Text
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
      </Text>
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
