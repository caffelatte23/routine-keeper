import { Redirect, router } from 'expo-router';
import { Briefcase, MoonStars, SunHorizon } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

import type { GroupName } from '@routine-keeper/core';

type TimeKey = 'morning' | 'midday' | 'evening';

const GROUP_OF: Record<TimeKey, GroupName> = {
  morning: '朝',
  midday: '日中',
  evening: '夜',
};

const OPTIONS: {
  key: TimeKey;
  label: string;
  detail: string;
  Icon: typeof SunHorizon;
}[] = [
  {
    key: 'morning',
    label: '朝',
    detail: '起きて、動いて、流れをつくる',
    Icon: SunHorizon,
  },
  { key: 'midday', label: '日中', detail: '集中とひと休み', Icon: Briefcase },
  {
    key: 'evening',
    label: '夜',
    detail: '力を抜いて、時間どおりに眠る',
    Icon: MoonStars,
  },
];

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const { onboarded, completeOnboarding } = useRoutineStore();
  const [selected, setSelected] = useState<Record<TimeKey, boolean>>({
    morning: true,
    midday: false,
    evening: true,
  });

  const count = Object.values(selected).filter(Boolean).length;

  if (onboarded) {
    return <Redirect href='/(tabs)/today' />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={['top', 'bottom']}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 28,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.acc,
          }}
        />

        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 30,
            lineHeight: 42,
            color: colors.text,
            marginTop: 28,
            marginBottom: 16,
          }}
        >
          一日を、{'\n'}ひとつのループから。
        </Text>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 15,
            lineHeight: 26,
            color: colors.t3,
          }}
        >
          整えたい時間帯を選んでください。あとから自由に変えられます。ここでの選択に縛られることはありません。
        </Text>

        <View style={{ marginTop: 30 }}>
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
                  gap: 16,
                  paddingVertical: 18,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.line,
                }}
              >
                <Icon
                  size={22}
                  weight='regular'
                  color={on ? colors.acc : colors.faint}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: fonts.jpMedium,
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    {label}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.jp,
                      fontSize: 13,
                      color: colors.muted,
                      marginTop: 3,
                    }}
                  >
                    {detail}
                  </Text>
                </View>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    borderWidth: on ? 7 : 1.5,
                    borderColor: on ? colors.acc : colors.dim,
                  }}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => {
            const groups = (Object.keys(selected) as TimeKey[])
              .filter((k) => selected[k])
              .map((k) => GROUP_OF[k]);
            completeOnboarding(groups);
            router.replace('/(tabs)/today');
          }}
          style={{
            minHeight: 54,
            borderRadius: 16,
            backgroundColor: colors.acc,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.jpMedium,
              fontSize: 16,
              color: colors.onAcc,
            }}
          >
            {count}つのルーティンではじめる
          </Text>
        </Pressable>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 13,
            color: colors.muted,
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          最初の一週間は2つで十分です。
        </Text>
      </View>
    </SafeAreaView>
  );
}
