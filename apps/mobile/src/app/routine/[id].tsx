import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { DayChips } from '@/shared/components/day-chip';
import { StepRow } from '@/shared/components/step-row';
import { useRoutines } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

import type { GroupName } from '@routine-keeper/core';

export default function RoutineEditorScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routines = useRoutines();
  const routine = routines[id as GroupName];

  if (!routine) {
    return null;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 44,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
          hitSlop={12}
        >
          <ArrowLeft size={22} color={colors.t3} />
        </Pressable>
        <Pressable
          onPress={() => {
            router.back();
          }}
          hitSlop={12}
        >
          <Text
            style={{
              fontFamily: fonts.jpMedium,
              fontSize: 14,
              color: colors.acc,
            }}
          >
            保存
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 28,
          color: colors.text,
          marginBottom: 22,
        }}
      >
        {routine.group}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 32,
          paddingBottom: 18,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}
      >
        <View>
          <Text
            style={{ fontFamily: fonts.jp, fontSize: 12, color: colors.muted }}
          >
            開始
          </Text>
          <Text
            style={{
              fontFamily: fonts.figure,
              fontSize: 20,
              color: colors.text,
              marginTop: 3,
            }}
          >
            {routine.start}
          </Text>
        </View>
        <View>
          <Text
            style={{ fontFamily: fonts.jp, fontSize: 12, color: colors.muted }}
          >
            所要
          </Text>
          <Text
            style={{
              fontFamily: fonts.figure,
              fontSize: 20,
              color: colors.text,
              marginTop: 3,
            }}
          >
            {routine.duration}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontFamily: fonts.jp,
          fontSize: 13,
          color: colors.t3,
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        繰り返す曜日
      </Text>
      <DayChips days={routine.days} />

      <Text
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 14,
          color: colors.t2,
          marginTop: 30,
          marginBottom: 2,
        }}
      >
        ステップ
      </Text>
      {routine.steps.map((step) => (
        <StepRow key={step.id} step={step} />
      ))}

      <Pressable style={{ paddingVertical: 16 }}>
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 15,
            color: colors.acc,
          }}
        >
          ＋ ステップを追加
        </Text>
      </Pressable>

      <Text
        style={{
          fontFamily: fonts.jp,
          fontSize: 13,
          lineHeight: 22,
          color: colors.faint,
          marginTop: 8,
        }}
      >
        4ステップで{routine.group}
        は十分です。これより長いと、木曜日には続かなくなりがちです。
      </Text>
    </ScrollView>
  );
}
