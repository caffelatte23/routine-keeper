import {
  GROUP_ORDER,
  rhythmPercent,
  systemClock,
  todayIso,
  type DayStatus,
} from '@routine-keeper/core';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme, type AppPalette } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'];
// Completions are only loaded for the last 60 days, so one month back is the
// furthest the numbers stay honest.
const MIN_OFFSET = -1;

type CellKind = DayStatus | 'rest' | 'future';

function cellStyle(kind: CellKind, colors: AppPalette) {
  switch (kind) {
    case 'full':
      return {
        bg: colors.heatFull,
        border: 'transparent',
        fg: colors.onAcc,
        dashed: false,
      };
    case 'partial':
      return {
        bg: colors.accTint,
        border: 'transparent',
        fg: colors.accStrong,
        dashed: false,
      };
    case 'rest':
      return {
        bg: 'transparent',
        border: colors.faint,
        fg: colors.muted,
        dashed: true,
      };
    case 'future':
      return {
        bg: 'transparent',
        border: 'transparent',
        fg: colors.faint,
        dashed: false,
      };
    default:
      return {
        bg: 'transparent',
        border: colors.line,
        fg: colors.muted,
        dashed: false,
      };
  }
}

const KIND_LABEL: Record<CellKind, string> = {
  full: 'できた',
  partial: '一部',
  missed: 'なし',
  none: 'なし',
  rest: '休み',
  future: '',
};

export default function ReviewScreen() {
  const { colors } = useAppTheme();
  const { monthStatus, monthRhythm } = useRoutineStore();
  const [offset, setOffset] = useState(0);
  const insets = useSafeAreaInsets();

  const today = todayIso(systemClock);
  const base = new Date(
    Number(today.slice(0, 4)),
    Number(today.slice(5, 7)) - 1 + offset,
    1,
  );
  const year = base.getFullYear();
  const month1 = base.getMonth() + 1;
  const isThisMonth = offset === 0;
  const todayDay = Number(today.slice(8, 10));

  const { firstWeekday, statuses } = monthStatus(year, month1);
  const { all, byGroup, restDays } = monthRhythm(year, month1);
  const pct = rhythmPercent(all);

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...statuses.map((status, i) => {
      const day = i + 1;
      const kind: CellKind =
        isThisMonth && day > todayDay
          ? 'future'
          : restDays.includes(day)
            ? 'rest'
            : status;
      return { day, kind, isToday: isThisMonth && day === todayDay };
    }),
  ];

  const navBtn = (dir: -1 | 1, disabled: boolean, label: string) => {
    const Caret = dir < 0 ? CaretLeft : CaretRight;
    return (
      <Pressable
        onPress={() => {
          setOffset((o) => o + dir);
        }}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        style={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Caret size={18} color={disabled ? colors.dim : colors.text} />
      </Pressable>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: insets.top + 14,
        paddingBottom: 32,
        gap: 24,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{ fontFamily: fonts.jpBold, fontSize: 26, color: colors.text }}
        >
          ふりかえり
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {navBtn(-1, offset <= MIN_OFFSET, '前の月')}
          <Text
            style={{
              fontFamily: fonts.figureBold,
              fontSize: 16,
              color: colors.text,
            }}
          >
            {year}.{month1}
          </Text>
          {navBtn(1, offset >= 0, '次の月')}
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14 }}>
        <Text
          accessibilityLabel={
            pct === null ? 'リズム なし' : `リズム ${pct}パーセント`
          }
          style={{
            fontFamily: fonts.figureBold,
            fontSize: 64,
            lineHeight: 66,
            color: colors.text,
          }}
        >
          {pct ?? '–'}
          <Text style={{ fontSize: 28 }}>{pct === null ? '' : '%'}</Text>
        </Text>
        <View style={{ flex: 1, paddingBottom: 6 }}>
          <Text
            style={{
              fontFamily: fonts.jp,
              fontSize: 13,
              lineHeight: 20,
              color: colors.muted,
            }}
          >
            リズムが保てた日
          </Text>
          <Text
            style={{
              fontFamily: fonts.jp,
              fontSize: 13,
              lineHeight: 20,
              color: colors.muted,
            }}
          >
            休みを除く{all.active}日中{' '}
            <Text style={{ fontFamily: fonts.jpMedium, color: colors.text }}>
              {all.kept}日
            </Text>
            {all.rest > 0 ? `　休み${all.rest}日` : ''}
          </Text>
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row' }}>
          {WEEKDAYS.map((w) => (
            <Text
              key={w}
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: fonts.jp,
                fontSize: 11,
                color: colors.muted,
              }}
            >
              {w}
            </Text>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {cells.map((c, i) => {
            if (!c) {
              return (
                <View
                  key={`b${i}`}
                  style={{ width: `${100 / 7}%`, height: 46 }}
                />
              );
            }
            const s = cellStyle(c.kind, colors);
            return (
              <View
                key={c.day}
                style={{ width: `${100 / 7}%`, height: 46, padding: 3 }}
              >
                <View
                  accessible
                  accessibilityLabel={`${month1}月${c.day}日 ${KIND_LABEL[c.kind]}`}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: s.bg,
                    borderWidth: c.isToday ? 2 : 1.5,
                    borderStyle: s.dashed ? 'dashed' : 'solid',
                    borderColor: c.isToday ? colors.text : s.border,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.figure,
                      fontSize: 13,
                      color: s.fg,
                    }}
                  >
                    {c.day}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
          {(['full', 'partial', 'rest'] as const).map((k) => {
            const s = cellStyle(k, colors);
            return (
              <View
                key={k}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: s.bg,
                    borderWidth: s.dashed ? 1.5 : 0,
                    borderStyle: 'dashed',
                    borderColor: s.border,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.jp,
                    fontSize: 11,
                    color: colors.muted,
                  }}
                >
                  {KIND_LABEL[k]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 14,
            color: colors.muted,
          }}
        >
          ルーティン別
        </Text>
        {GROUP_ORDER.map((group) => {
          const r = byGroup[group];
          const p = r ? rhythmPercent(r) : null;
          if (p === null) {
            return null;
          }
          return (
            <View
              key={group}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View
                style={{
                  width: 64,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.phase[group].fill,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.jp,
                    fontSize: 14,
                    color: colors.text,
                  }}
                >
                  {group}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.surface2,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${p}%`,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.text,
                  }}
                />
              </View>
              <Text
                style={{
                  width: 44,
                  textAlign: 'right',
                  fontFamily: fonts.figureBold,
                  fontSize: 14,
                  color: colors.text,
                }}
              >
                {p}%
              </Text>
            </View>
          );
        })}
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 12,
            lineHeight: 19,
            color: colors.muted,
          }}
        >
          半分できた日も、保てた日としてかぞえます。予定のない日は休みで、数字には入りません。
        </Text>
      </View>
    </ScrollView>
  );
}
