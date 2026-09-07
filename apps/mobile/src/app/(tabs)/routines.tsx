import { Link } from 'expo-router';
import {
  Briefcase,
  CaretRight,
  MoonStars,
  SunHorizon,
} from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useRoutines } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

import type { GroupName } from '@routine-keeper/core';

const ICONS: Record<GroupName, typeof SunHorizon> = {
  朝: SunHorizon,
  日中: Briefcase,
  夜: MoonStars,
};

const GROUP_ORDER: GroupName[] = ['朝', '日中', '夜'];

export default function RoutinesScreen() {
  const { colors } = useAppTheme();
  const routines = useRoutines();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{
        paddingHorizontal: 22,
        paddingTop: 14,
        paddingBottom: 28,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 28,
          color: colors.text,
          marginBottom: 18,
        }}
      >
        ルーティン
      </Text>

      {GROUP_ORDER.map((group) => {
        const routine = routines[group];
        const Icon = ICONS[group];
        const stepCount = routine?.steps.length ?? 0;
        return (
          <Link
            key={group}
            href={{ pathname: '/routine/[id]', params: { id: group } }}
            asChild
          >
            <Pressable
              style={{
                paddingVertical: 18,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}
              >
                <Icon size={22} weight='regular' color={colors.acc} />
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.jpMedium,
                    fontSize: 16,
                    color: colors.text,
                  }}
                >
                  {group}
                </Text>
                <CaretRight size={15} color={colors.dim} />
              </View>
              <Text
                style={{
                  fontFamily: fonts.jp,
                  fontSize: 12.5,
                  color: colors.muted,
                  marginTop: 4,
                  marginLeft: 38,
                }}
              >
                {routine?.start}開始{'    '}
                <Text style={{ fontFamily: fonts.figure }}>{stepCount}</Text>
                ステップ
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}
