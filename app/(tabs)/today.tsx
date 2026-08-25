import { ScrollView, Text, View } from 'react-native';
import { Flame, HandSwipeRight } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';
import { routines, useRoutineStore, type GroupName } from '@/state/routine-store';
import { TaskRow } from '@/components/task-row';
import { ProgressRing } from '@/components/progress-ring';
import { CelebrationOverlay } from '@/components/celebration-overlay';

const GROUP_ORDER: GroupName[] = ['朝', '日中', '夜'];
const TODAY_LABEL = '2026年8月25日 火曜日';

export default function TodayScreen() {
  const { colors } = useAppTheme();
  const { tasks, doneCount, streakDays, celebrating, encouragement, userName, setTaskDone, dismissCelebration, resetDay } =
    useRoutineStore();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 0 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <View>
            <Text style={{ fontSize: 12, letterSpacing: 0.6, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>
              {TODAY_LABEL}
            </Text>
            <Text
              style={{ fontSize: 27, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 6 }}
            >
              おはよう、{userName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingHorizontal: 11,
              paddingVertical: 7,
              borderRadius: 999,
              backgroundColor: colors.accTint,
              boxShadow: `0 0 0 1px ${colors.accBorder}`,
            }}
          >
            <Flame size={15} weight="fill" color={colors.acc} />
            <Text style={{ fontSize: 13, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.accStrong }}>
              {streakDays}日
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 18,
            marginTop: 24,
            marginBottom: 8,
            padding: 18,
            paddingHorizontal: 20,
            borderRadius: 14,
            backgroundColor: colors.surface,
            boxShadow: `0 0 0 1px ${colors.line}`,
          }}
        >
          <ProgressRing done={doneCount} total={7} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text }}>
              7件中 {doneCount}件 完了
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, fontFamily: 'NotoSansJP_400Regular', lineHeight: 20, marginTop: 2 }}>
              {encouragement}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginVertical: 18 }}>
          <HandSwipeRight size={15} color={colors.faint} />
          <Text style={{ fontSize: 12, color: colors.faint, fontFamily: 'NotoSansJP_400Regular' }}>
            右にスワイプすると完了になります
          </Text>
        </View>

        {GROUP_ORDER.map((group) => {
          const groupTasks = tasks.filter((t) => t.group === group);
          if (groupTasks.length === 0) {
            return null;
          }
          return (
            <View key={group} style={{ marginBottom: 26 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Text style={{ fontSize: 13, color: colors.t3, fontFamily: 'NotoSansJP_400Regular' }}>{group}</Text>
                <Text style={{ fontSize: 12, color: colors.faint, fontFamily: 'NotoSansJP_400Regular' }}>
                  {routines[group].window}
                </Text>
              </View>
              <View style={{ gap: 8 }}>
                {groupTasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={setTaskDone} />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {celebrating ? (
        <CelebrationOverlay streakDays={streakDays} onDismiss={dismissCelebration} onResetDay={resetDay} />
      ) : null}
    </View>
  );
}
