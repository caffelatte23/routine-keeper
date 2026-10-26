import { router, useLocalSearchParams } from 'expo-router';
import { Minus, Plus, Trash } from 'phosphor-react-native';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { repos } from '@/db/client';
import { parseMins } from '@/lib/day';
import { DayChips } from '@/shared/components/day-chip';
import { PHASE_ICON } from '@/shared/components/phase-icon';
import { useRoutines, type RoutineStep } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

import type { GroupName } from '@routine-keeper/core';

const MAX_MINS = 120;

// Edits write straight through the repository; the store's live queries
// re-render this screen, so there is no draft state and no save button.
export default function RoutineEditorScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routines = useRoutines();
  const group = id as GroupName;
  const routine = routines[group];

  if (!routine) {
    return null;
  }

  const pc = colors.phase[group];
  const PhaseIcon = PHASE_ICON[group];
  const total = routine.steps.reduce((n, s) => n + parseMins(s.mins), 0);

  const toggleDay = (i: number) => {
    const days = routine.days.map((on, j) => (j === i ? !on : on));
    repos.routines.update(routine.id, { activeDays: days });
  };

  const setMins = (step: RoutineStep, delta: number) => {
    const next = Math.min(Math.max(parseMins(step.mins) + delta, 1), MAX_MINS);
    repos.routines.updateStep(step.id, { minsLabel: `${next}分` });
  };

  const rename = (step: RoutineStep, name: string) => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== step.name) {
      repos.routines.updateStep(step.id, { name: trimmed });
    }
  };

  const remove = (step: RoutineStep) => {
    Alert.alert(`「${step.name}」を削除しますか？`, undefined, [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          repos.routines.removeStep(step.id);
        },
      },
    ]);
  };

  const add = () => {
    repos.routines.addStep({
      routineId: routine.id,
      name: '新しいステップ',
      minsLabel: '5分',
      sortOrder: routine.steps.length,
    });
  };

  const stepperBtn = {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  } as const;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior='automatic'
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 44,
        gap: 28,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: pc.tint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PhaseIcon size={22} color={pc.ink} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.jpBold,
              fontSize: 24,
              lineHeight: 30,
              color: colors.text,
            }}
          >
            {group}のルーティン
          </Text>
          <Text
            style={{
              fontFamily: fonts.jp,
              fontSize: 13,
              lineHeight: 19,
              color: colors.muted,
            }}
          >
            {routine.window}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            router.back();
          }}
          accessibilityRole='button'
          style={{
            height: 40,
            paddingHorizontal: 18,
            borderRadius: 20,
            backgroundColor: colors.text,
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.jpMedium,
              fontSize: 14,
              lineHeight: 20,
              color: colors.bg,
            }}
          >
            完了
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 14,
            lineHeight: 20,
            color: colors.muted,
          }}
        >
          くり返す曜日
        </Text>
        <DayChips days={routine.days} onToggle={toggleDay} />
      </View>

      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.jpMedium,
              fontSize: 14,
              lineHeight: 20,
              color: colors.muted,
            }}
          >
            ステップ
          </Text>
          <Text
            style={{
              fontFamily: fonts.jp,
              fontSize: 13,
              lineHeight: 19,
              color: colors.muted,
            }}
          >
            合計 約
            <Text style={{ fontFamily: fonts.figureBold, color: colors.text }}>
              {total}
            </Text>
            分
          </Text>
        </View>

        {routine.steps.map((step) => (
          <View
            key={step.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              minHeight: 58,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            }}
          >
            <TextInput
              defaultValue={step.name}
              onEndEditing={(e) => {
                rename(step, e.nativeEvent.text);
              }}
              accessibilityLabel='ステップ名'
              returnKeyType='done'
              style={{
                flex: 1,
                minHeight: 44,
                fontFamily: fonts.jp,
                fontSize: 15,
                lineHeight: 22,
                color: colors.text,
              }}
            />
            <Pressable
              onPress={() => {
                setMins(step, -1);
              }}
              hitSlop={6}
              accessibilityRole='button'
              accessibilityLabel={`${step.name} を1分短く`}
              style={stepperBtn}
            >
              <Minus size={14} color={colors.text} />
            </Pressable>
            <Text
              style={{
                minWidth: 40,
                textAlign: 'center',
                fontFamily: fonts.figureBold,
                fontSize: 14,
                lineHeight: 20,
                color: colors.text,
              }}
            >
              {parseMins(step.mins)}
              <Text
                style={{ fontFamily: fonts.jp, fontSize: 12, lineHeight: 17 }}
              >
                分
              </Text>
            </Text>
            <Pressable
              onPress={() => {
                setMins(step, 1);
              }}
              hitSlop={6}
              accessibilityRole='button'
              accessibilityLabel={`${step.name} を1分長く`}
              style={stepperBtn}
            >
              <Plus size={14} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={() => {
                remove(step);
              }}
              accessibilityRole='button'
              accessibilityLabel={`${step.name} を削除`}
              style={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash size={18} color={colors.muted} />
            </Pressable>
          </View>
        ))}

        <Pressable
          onPress={add}
          accessibilityRole='button'
          style={{
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Plus size={18} color={colors.acc} />
          <Text
            style={{
              fontFamily: fonts.jpMedium,
              fontSize: 15,
              lineHeight: 22,
              color: colors.acc,
            }}
          >
            ステップを追加
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
