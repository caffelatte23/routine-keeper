import { systemClock, todayIso, type GroupName } from '@routine-keeper/core';
import { Flame } from 'phosphor-react-native';
import { ScrollView, Text, View } from 'react-native';

import { formatJpDate } from '@/lib/format';
import { CelebrationOverlay } from '@/shared/components/celebration-overlay';
import { ProgressRing } from '@/shared/components/progress-ring';
import { TaskRow } from '@/shared/components/task-row';
import { useRoutines, useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const GROUP_ORDER: GroupName[] = ['朝', '日中', '夜'];

export default function TodayScreen() {
  const { colors } = useAppTheme();
  const routines = useRoutines();
  const {
    tasks,
    doneCount,
    streakDays,
    celebrating,
    encouragement,
    userName,
    setTaskDone,
    dismissCelebration,
  } = useRoutineStore();
  const todayLabel = formatJpDate(todayIso(systemClock));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: 14,
          paddingBottom: 28,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: fonts.jp,
                fontSize: 12,
                letterSpacing: 0.4,
                color: colors.muted,
              }}
            >
              {todayLabel}
            </Text>
            <Text
              style={{
                fontFamily: fonts.jpMedium,
                fontSize: 28,
                color: colors.text,
                marginTop: 6,
              }}
            >
              おはよう、{userName}
            </Text>
          </View>
          {streakDays > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginTop: 22,
              }}
            >
              <Flame size={14} weight='fill' color={colors.acc} />
              <Text
                style={{
                  fontFamily: fonts.figure,
                  fontSize: 15,
                  color: colors.t3,
                }}
              >
                {streakDays}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <ProgressRing done={doneCount} total={Math.max(tasks.length, 1)} />
          <Text
            style={{
              fontFamily: fonts.jp,
              fontSize: 13.5,
              lineHeight: 21,
              color: colors.muted,
              textAlign: 'center',
              marginTop: 18,
              maxWidth: 260,
            }}
          >
            {encouragement}
          </Text>
          {doneCount < tasks.length ? (
            <Text
              style={{
                fontFamily: fonts.jp,
                fontSize: 11.5,
                color: colors.faint,
                marginTop: 8,
              }}
            >
              右にスワイプして閉じる
            </Text>
          ) : null}
        </View>

        <View style={{ marginTop: 14 }}>
          {GROUP_ORDER.map((group) => {
            const groupTasks = tasks.filter((t) => t.group === group);
            if (groupTasks.length === 0) {
              return null;
            }
            return (
              <View key={group} style={{ marginBottom: 30 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.jpMedium,
                      fontSize: 14,
                      color: colors.t2,
                    }}
                  >
                    {group}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.jp,
                      fontSize: 11.5,
                      color: colors.faint,
                    }}
                  >
                    {routines[group]?.window}
                  </Text>
                </View>
                {groupTasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={setTaskDone} />
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {celebrating ? (
        <CelebrationOverlay
          streakDays={streakDays}
          onDismiss={dismissCelebration}
        />
      ) : null}
    </View>
  );
}
