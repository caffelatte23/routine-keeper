import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, CircleIcon, MoonStars, SunHorizon, Briefcase } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';

type TimeKey = 'morning' | 'midday' | 'evening';

const OPTIONS: { key: TimeKey; label: string; detail: string; Icon: typeof SunHorizon }[] = [
  { key: 'morning', label: '朝', detail: '起きて、動いて、流れをつくる', Icon: SunHorizon },
  { key: 'midday', label: '日中', detail: '集中とひと休み', Icon: Briefcase },
  { key: 'evening', label: '夜', detail: '力を抜いて、時間どおりに眠る', Icon: MoonStars },
];

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const [selected, setSelected] = useState<Record<TimeKey, boolean>>({
    morning: true,
    midday: false,
    evening: true,
  });

  const count = Object.values(selected).filter(Boolean).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: 26, paddingTop: 12, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 32 }}>
          <View style={{ width: 26, height: 3, borderRadius: 2, backgroundColor: colors.acc }} />
          <View style={{ width: 26, height: 3, borderRadius: 2, backgroundColor: colors.line }} />
          <View style={{ width: 26, height: 3, borderRadius: 2, backgroundColor: colors.line }} />
        </View>

        <Text style={{ fontSize: 12, letterSpacing: 1.2, color: colors.acc, marginBottom: 16, fontFamily: 'NotoSansJP_400Regular' }}>
          ようこそ
        </Text>
        <Text
          style={{
            fontSize: 30,
            lineHeight: 40,
            fontWeight: '500',
            fontFamily: 'NotoSansJP_500Medium',
            color: colors.text,
            marginBottom: 16,
          }}
        >
          一日を、{'\n'}ひとつのループから。
        </Text>
        <Text style={{ color: colors.t3, fontSize: 15, lineHeight: 26, fontFamily: 'NotoSansJP_400Regular', marginBottom: 32 }}>
          整えたい時間帯を選んでください。あとから自由に変えられます。ここでの選択に縛られることはありません。
        </Text>

        <View style={{ gap: 12 }}>
          {OPTIONS.map(({ key, label, detail, Icon }) => {
            const on = selected[key];
            return (
              <Pressable
                key={key}
                onPress={() => {
                  setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  padding: 18,
                  borderRadius: 14,
                  backgroundColor: colors.surface,
                  boxShadow: `0 0 0 1px ${on ? colors.accBorder : colors.line}`,
                }}
              >
                <Icon size={24} weight={on ? 'fill' : 'regular'} color={on ? colors.acc : colors.t3} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text }}>
                    {label}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.muted, fontFamily: 'NotoSansJP_400Regular', marginTop: 2 }}>
                    {detail}
                  </Text>
                </View>
                {on ? (
                  <CheckCircle size={22} weight="fill" color={colors.acc} />
                ) : (
                  <CircleIcon size={22} color={colors.dim} />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => {
            router.replace('/(tabs)/today');
          }}
          style={{
            minHeight: 54,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.acc,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'NotoSansJP_500Medium', color: colors.acc }}>
            {count}つのルーティンで始める
          </Text>
        </Pressable>
        <Text style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>
          最初の一週間は2つで十分です。
        </Text>
      </View>
    </SafeAreaView>
  );
}
