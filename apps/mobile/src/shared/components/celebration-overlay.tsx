import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Flame } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';

export function CelebrationOverlay({
  streakDays,
  onDismiss,
  onResetDay,
}: {
  streakDays: number;
  onDismiss: () => void;
  onResetDay: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(180)}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: colors.celebTo,
      }}
    >
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 0 1px ${colors.acc}, 0 0 60px 8px ${colors.glow}`,
          marginBottom: 26,
        }}
      >
        <Flame size={44} weight="fill" color={colors.acc} />
      </View>
      <Text style={{ fontSize: 25, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginBottom: 10 }}>
        ループが閉じました
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: colors.t2,
          fontFamily: 'NotoSansJP_400Regular',
          textAlign: 'center',
          lineHeight: 26,
          marginBottom: 30,
        }}
      >
        7件すべて完了。これで{streakDays}日連続です。
      </Text>
      <Pressable
        onPress={onDismiss}
        style={{
          paddingHorizontal: 30,
          paddingVertical: 14,
          minHeight: 48,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.acc,
        }}
      >
        <Text style={{ fontSize: 15, fontFamily: 'NotoSansJP_500Medium', color: colors.acc }}>閉じる</Text>
      </Pressable>
      <Pressable onPress={onResetDay} style={{ marginTop: 6, minHeight: 44, justifyContent: 'center' }}>
        <Text style={{ color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>一日をリセット</Text>
      </Pressable>
    </Animated.View>
  );
}
