import { Check } from 'phosphor-react-native';
import { Pressable, Text } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

/** Shown once a day when every scheduled step is done. */
export function CelebrationOverlay({ onDismiss }: { onDismiss: () => void }) {
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
          width: 104,
          height: 104,
          borderRadius: 52,
          backgroundColor: colors.heatFull,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        <Check size={48} weight='bold' color='#ffffff' />
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.duration(320).delay(220)}
        style={{
          fontFamily: fonts.jpBold,
          fontSize: 24,
          lineHeight: 30,
          color: colors.text,
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        今日はすべて完了
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.duration(320).delay(300)}
        style={{
          fontFamily: fonts.jp,
          fontSize: 14,
          lineHeight: 22,
          color: colors.t2,
          textAlign: 'center',
        }}
      >
        おつかれさまでした。あとはゆっくり。
      </Animated.Text>
      <Pressable
        onPress={onDismiss}
        accessibilityRole='button'
        style={{
          marginTop: 34,
          height: 52,
          paddingHorizontal: 32,
          borderRadius: 26,
          backgroundColor: colors.text,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 15,
            lineHeight: 22,
            color: colors.bg,
          }}
        >
          閉じる
        </Text>
      </Pressable>
    </Animated.View>
  );
}
