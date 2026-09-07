import { systemClock, todayIso, type GroupName } from '@routine-keeper/core';
import { CaretLeft, CaretRight, Flame } from 'phosphor-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatJpDate } from '@/lib/format';
import { MonthGrid, type MonthCell } from '@/shared/components/month-grid';
import { useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const GROUP_ORDER: GroupName[] = ['朝', '日中', '夜'];

export default function CalendarScreen() {
  const { colors } = useAppTheme();
  const { monthStatus, tasks } = useRoutineStore();

  const today = todayIso(systemClock);
  const year = Number(today.slice(0, 4));
  const month1 = Number(today.slice(5, 7));
  const todayDay = Number(today.slice(8, 10));

  const { firstWeekday, statuses, fullDays } = monthStatus(year, month1);

  const cells = useMemo<MonthCell[]>(() => {
    const out: MonthCell[] = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      out.push({ day: '', isToday: false, future: false, status: 'none' });
    }
    statuses.forEach((status, idx) => {
      const day = idx + 1;
      out.push({
        day: String(day),
        isToday: day === todayDay,
        future: day > todayDay,
        status,
      });
    });
    return out;
  }, [firstWeekday, statuses, todayDay]);

  const byGroup = GROUP_ORDER.map((group) => {
    const groupTasks = tasks.filter((t) => t.group === group);
    return {
      group,
      total: groupTasks.length,
      done: groupTasks.filter((t) => t.done).length,
    };
  }).filter((g) => g.total > 0);

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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 28,
            color: colors.text,
          }}
        >
          {month1}月
          <Text
            style={{
              fontFamily: fonts.figure,
              fontSize: 15,
              color: colors.faint,
            }}
          >
            {' '}
            {year}
          </Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Pressable hitSlop={12}>
            <CaretLeft size={18} color={colors.t3} />
          </Pressable>
          <Pressable hitSlop={12}>
            <CaretRight size={18} color={colors.t3} />
          </Pressable>
        </View>
      </View>

      <MonthGrid cells={cells} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 9,
          marginTop: 26,
          marginBottom: 8,
        }}
      >
        <Flame size={18} weight='fill' color={colors.acc} />
        <Text style={{ fontFamily: fonts.jp, fontSize: 14, color: colors.t2 }}>
          すべて閉じた日は今月{' '}
          <Text style={{ fontFamily: fonts.figure, color: colors.text }}>
            {fullDays}
          </Text>{' '}
          日
        </Text>
      </View>

      <Text
        style={{
          fontFamily: fonts.jp,
          fontSize: 13,
          color: colors.t3,
          marginTop: 22,
          marginBottom: 4,
        }}
      >
        {formatJpDate(today)}
      </Text>
      {byGroup.map(({ group, total, done }) => {
        const complete = done >= total;
        return (
          <View
            key={group}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                borderWidth: complete ? 0 : 1.5,
                borderColor: colors.dim,
                backgroundColor: complete ? colors.grow : 'transparent',
              }}
            />
            <Text
              style={{
                flex: 1,
                fontFamily: fonts.jp,
                fontSize: 14.5,
                color: complete ? colors.muted : colors.text,
              }}
            >
              {group}
            </Text>
            <Text
              style={{
                fontFamily: fonts.figure,
                fontSize: 14,
                color: colors.t3,
              }}
            >
              {done} / {total}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
