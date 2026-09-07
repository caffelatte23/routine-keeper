import { systemClock, todayIso, type GroupName } from '@routine-keeper/core';
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  CircleDashed,
  Flame,
} from 'phosphor-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatJpDate } from '@/lib/format';
import { MonthGrid, type MonthCell } from '@/shared/components/month-grid';
import { useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';

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
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 26,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 12,
              letterSpacing: 0.6,
              color: colors.muted,
              fontFamily: 'NotoSansJP_400Regular',
            }}
          >
            {year}年
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '500',
              fontFamily: 'NotoSansJP_500Medium',
              color: colors.text,
              marginTop: 6,
            }}
          >
            {month1}月
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 0 1px ${colors.line}`,
            }}
          >
            <CaretLeft size={16} color={colors.t3} />
          </Pressable>
          <Pressable
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 0 1px ${colors.line}`,
            }}
          >
            <CaretRight size={16} color={colors.t3} />
          </Pressable>
        </View>
      </View>

      <View style={{ marginBottom: 26 }}>
        <MonthGrid cells={cells} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          padding: 18,
          borderRadius: 14,
          backgroundColor: colors.surface,
          boxShadow: `0 0 0 1px ${colors.line}`,
          marginBottom: 20,
        }}
      >
        <Flame size={28} weight='fill' color={colors.acc} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              fontFamily: 'NotoSansJP_500Medium',
              color: colors.text,
            }}
          >
            今月は{fullDays}日すべて完了
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.muted,
              fontFamily: 'NotoSansJP_400Regular',
              marginTop: 2,
            }}
          >
            小さく積み重ねていきましょう。
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 13,
          color: colors.t3,
          fontFamily: 'NotoSansJP_400Regular',
          marginBottom: 10,
        }}
      >
        {formatJpDate(today)}
      </Text>
      <View style={{ gap: 8 }}>
        {byGroup.map(({ group, total, done }) => {
          const complete = done >= total;
          return (
            <View
              key={group}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                minHeight: 50,
                borderRadius: 14,
                backgroundColor: colors.surface,
                boxShadow: `0 0 0 1px ${colors.line}`,
              }}
            >
              {complete ? (
                <CheckCircle size={20} weight='fill' color={colors.acc} />
              ) : (
                <CircleDashed size={20} color={colors.acc} />
              )}
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: complete ? colors.muted : colors.text,
                  fontFamily: 'NotoSansJP_400Regular',
                  textDecorationLine: complete ? 'line-through' : 'none',
                }}
              >
                {group} — {total}件中{done}件
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
