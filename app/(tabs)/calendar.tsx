import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CaretLeft, CaretRight, CheckCircle, CircleDashed, Flame } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';
import { MonthGrid, type MonthCell } from '@/components/month-grid';

const TODAY_DAY = 25;
const PARTIAL_DAYS = new Set([3, 9, 14, 17, 22, 24]);
const MISSED_DAYS = new Set([6, 13, 20]);

function buildMonthCells(): MonthCell[] {
  const cells: MonthCell[] = [];
  for (let i = 0; i < 5; i++) {
    cells.push({ day: '', isToday: false, future: false, status: 'none' });
  }
  for (let d = 1; d <= 31; d++) {
    const future = d > TODAY_DAY;
    const status = future ? 'none' : MISSED_DAYS.has(d) ? 'missed' : PARTIAL_DAYS.has(d) ? 'partial' : 'full';
    cells.push({ day: String(d), isToday: d === TODAY_DAY, future, status });
  }
  return cells;
}

export default function CalendarScreen() {
  const { colors } = useAppTheme();
  const cells = useMemo(() => buildMonthCells(), []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <View>
          <Text style={{ fontSize: 12, letterSpacing: 0.6, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>
            2026年
          </Text>
          <Text style={{ fontSize: 28, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 6 }}>
            8月
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
        <Flame size={28} weight="fill" color={colors.acc} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text }}>
            今月は18日すべて完了
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, fontFamily: 'NotoSansJP_400Regular', marginTop: 2 }}>
            8月としては最高の記録です。
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 13, color: colors.t3, fontFamily: 'NotoSansJP_400Regular', marginBottom: 10 }}>
        8月25日 火曜日
      </Text>
      <View style={{ gap: 8 }}>
        <View
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
          <CheckCircle size={20} weight="fill" color={colors.acc} />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              color: colors.muted,
              fontFamily: 'NotoSansJP_400Regular',
              textDecorationLine: 'line-through',
            }}
          >
            朝 — 3件中3件
          </Text>
        </View>
        <View
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
          <CircleDashed size={20} color={colors.acc} />
          <Text style={{ flex: 1, fontSize: 14, color: colors.text, fontFamily: 'NotoSansJP_400Regular' }}>
            夜 — 2件中1件
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
