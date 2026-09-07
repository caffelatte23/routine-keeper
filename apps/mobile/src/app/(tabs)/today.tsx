import { systemClock, todayIso, type GroupName } from '@routine-keeper/core';
import { Link } from 'expo-router';
import { Flame } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatJpDate } from '@/lib/format';
import { CelebrationOverlay } from '@/shared/components/celebration-overlay';
import { ProgressRing } from '@/shared/components/progress-ring';
import { RhythmStrip } from '@/shared/components/rhythm-strip';
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
    rhythm,
    celebrating,
    encouragement,
    userName,
    setTaskDone,
    dismissCelebration,
  } = useRoutineStore();
  const todayLabel = formatJpDate(todayIso(systemClock));

  const remaining = tasks.length - doneCount;
  const next = tasks.find((t) => !t.done);

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

        <View style={{ alignItems: 'center', marginTop: 18 }}>
          <ProgressRing done={doneCount} total={Math.max(tasks.length, 1)} />

          {streakDays > 0 ? (
            <View style={{ alignItems: 'center', marginTop: 18, gap: 10 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <Flame size={17} weight='fill' color={colors.acc} />
                <Text
                  style={{
                    fontFamily: fonts.jpMedium,
                    fontSize: 15,
                    color: colors.accStrong,
                  }}
                >
                  {streakDays}日つづけています
                </Text>
              </View>
              <RhythmStrip pattern={rhythm} />
            </View>
          ) : null}

          <Text
            style={{
              fontFamily: fonts.jp,
              fontSize: 13,
              lineHeight: 21,
              color: colors.muted,
              textAlign: 'center',
              marginTop: streakDays > 0 ? 14 : 18,
              maxWidth: 270,
            }}
          >
            {remaining > 0
              ? `あと${remaining}つでループが閉じます`
              : encouragement}
          </Text>
        </View>

        {next ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              marginTop: 22,
              padding: 16,
              borderRadius: 16,
              backgroundColor: colors.accTint,
            }}
          >
            <Pressable
              onPress={() => {
                setTaskDone(next.id, true);
              }}
              accessibilityRole='checkbox'
              accessibilityState={{ checked: false }}
              accessibilityLabel={`${next.name} を完了`}
              hitSlop={12}
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                borderWidth: 1.5,
                borderColor: colors.acc,
              }}
            />
            <Link
              href={{ pathname: '/task/[id]', params: { id: next.id } }}
              asChild
            >
              <Pressable style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.jp,
                    fontSize: 11.5,
                    color: colors.accStrong,
                  }}
                >
                  次の一歩
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.jpMedium,
                    fontSize: 16,
                    color: colors.text,
                    marginTop: 2,
                  }}
                >
                  {next.name}
                  <Text
                    style={{
                      fontFamily: fonts.jp,
                      fontSize: 13,
                      color: colors.muted,
                    }}
                  >
                    {'   '}
                    {next.mins}
                  </Text>
                </Text>
              </Pressable>
            </Link>
          </View>
        ) : null}

        <View style={{ marginTop: next ? 26 : 12 }}>
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
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={setTaskDone}
                    hint={task.id === next?.id}
                  />
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
