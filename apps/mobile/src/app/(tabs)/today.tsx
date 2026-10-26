import {
  addDays,
  GROUP_ORDER,
  systemClock,
  todayIso,
  weekdayMonday0,
  type GroupName,
} from '@routine-keeper/core';
import { Link } from 'expo-router';
import { CaretRight, Check, GearSix, Play } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { parseMins, parseWindow, pickFeatured } from '@/lib/day';
import { formatJpDate } from '@/lib/format';
import { CelebrationOverlay } from '@/shared/components/celebration-overlay';
import { DayBar } from '@/shared/components/day-bar';
import { PHASE_ICON } from '@/shared/components/phase-icon';
import {
  useRoutines,
  useRoutineStore,
  type Task,
} from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'];

function useNowMinutes(): number {
  const read = () => {
    const d = new Date(systemClock.now());
    return d.getHours() * 60 + d.getMinutes();
  };
  const [now, setNow] = useState(read);
  useEffect(() => {
    const id = setInterval(() => {
      setNow(read());
    }, 60_000);
    return () => {
      clearInterval(id);
    };
  }, []);
  return now;
}

function greeting(nowMin: number): string {
  if (nowMin < 11 * 60) {
    return 'おはよう';
  }
  if (nowMin < 18 * 60) {
    return 'こんにちは';
  }
  return 'こんばんは';
}

export default function TodayScreen() {
  const { colors } = useAppTheme();
  const routines = useRoutines();
  const {
    tasks,
    doneCount,
    streakDays,
    rhythm,
    celebrating,
    userName,
    dismissCelebration,
  } = useRoutineStore();
  const now = useNowMinutes();
  const today = todayIso(systemClock);

  const phases = GROUP_ORDER.flatMap((group) => {
    const routine = routines[group];
    const steps = tasks.filter((t) => t.group === group);
    if (!routine || steps.length === 0) {
      return [];
    }
    return [{ group, routine, steps, ...parseWindow(routine.window) }];
  });
  const featured = pickFeatured(phases, tasks, now);
  const hero = phases.find((p) => p.group === featured);
  const rest = phases.filter((p) => p.group !== featured);

  const week = rhythm.slice(-7).map((level, i, all) => {
    const date = addDays(today, i - (all.length - 1));
    return {
      date,
      level,
      isToday: date === today,
      label: date === today ? '今日' : WEEKDAYS[weekdayMonday0(date)],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 32,
          gap: 24,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: fonts.jp,
                fontSize: 13,
                color: colors.muted,
              }}
            >
              {formatJpDate(today)}
            </Text>
            <Text
              style={{
                fontFamily: fonts.jpBold,
                fontSize: 26,
                color: colors.text,
                marginTop: 4,
              }}
            >
              {greeting(now)}、{userName}
            </Text>
          </View>
          <Link href='/settings' asChild>
            <Pressable
              accessibilityRole='button'
              accessibilityLabel='設定'
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: colors.line,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GearSix size={20} color={colors.text} />
            </Pressable>
          </Link>
        </View>

        <DayBar
          now={now}
          blocks={phases.map((p) => ({
            key: p.group,
            start: p.start,
            end: p.end,
            color: colors.phase[p.group].fill,
          }))}
        />

        {hero ? (
          <NowHero
            group={hero.group}
            window={hero.routine.window}
            steps={hero.steps}
            live={now >= hero.start && now <= hero.end}
          />
        ) : (
          <View
            style={{
              borderRadius: 24,
              padding: 20,
              backgroundColor: colors.accTint,
              gap: 6,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.jpBold,
                fontSize: 20,
                color: colors.text,
              }}
            >
              {tasks.length > 0
                ? '今日のルーティンはすべて完了'
                : '今日はおやすみの日'}
            </Text>
            <Text
              style={{ fontFamily: fonts.jp, fontSize: 14, color: colors.t2 }}
            >
              {tasks.length > 0
                ? 'ゆっくり過ごしてください。'
                : '予定されたルーティンはありません。'}
            </Text>
          </View>
        )}

        {rest.length > 0 ? (
          <View>
            <Text
              style={{
                fontFamily: fonts.jpMedium,
                fontSize: 14,
                color: colors.muted,
                marginBottom: 4,
              }}
            >
              {hero ? 'ほかのルーティン' : '今日のルーティン'}
            </Text>
            {rest.map((p, i) => {
              const PhaseIcon = PHASE_ICON[p.group];
              const pc = colors.phase[p.group];
              const done = p.steps.every((s) => s.done);
              const mins = p.steps.reduce((n, s) => n + parseMins(s.mins), 0);
              return (
                <Link
                  key={p.group}
                  href={{
                    pathname: '/play/[group]',
                    params: { group: p.group },
                  }}
                  asChild
                >
                  <Pressable
                    accessibilityRole='button'
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      minHeight: 62,
                      borderBottomWidth: i < rest.length - 1 ? 1 : 0,
                      borderBottomColor: colors.line,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: pc.tint,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PhaseIcon size={20} color={pc.ink} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: fonts.jpMedium,
                          fontSize: 15,
                          color: colors.text,
                        }}
                      >
                        {p.group}のルーティン
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.jp,
                          fontSize: 12,
                          color: colors.muted,
                        }}
                      >
                        {p.routine.window}　{p.steps.length}ステップ　約{mins}分
                      </Text>
                    </View>
                    {done ? (
                      <Text
                        style={{
                          fontFamily: fonts.jpMedium,
                          fontSize: 12,
                          color: colors.acc,
                        }}
                      >
                        完了
                      </Text>
                    ) : (
                      <CaretRight size={16} color={colors.muted} />
                    )}
                  </Pressable>
                </Link>
              );
            })}
          </View>
        ) : null}

        <View style={{ gap: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.jpMedium,
                fontSize: 14,
                color: colors.muted,
              }}
            >
              この7日のリズム
            </Text>
            <Text
              style={{
                fontFamily: fonts.jp,
                fontSize: 12,
                color: colors.muted,
              }}
            >
              半分できた日も、できた日
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {week.map((d) => (
              <View
                key={d.date}
                style={{ alignItems: 'center', gap: 4, width: 40 }}
              >
                <View
                  accessible
                  accessibilityLabel={`${d.label} ${
                    d.level === 2 ? 'できた' : d.level === 1 ? '半分' : 'なし'
                  }`}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      d.level === 2
                        ? colors.heatFull
                        : d.level === 1
                          ? colors.accTint
                          : 'transparent',
                    borderWidth: d.isToday ? 2 : d.level === 0 ? 1 : 0,
                    borderColor: d.isToday ? colors.text : colors.line,
                  }}
                >
                  {d.isToday && d.level < 2 ? (
                    <Text
                      style={{
                        fontFamily: fonts.figureBold,
                        fontSize: 11,
                        color: colors.text,
                      }}
                    >
                      {doneCount}/{tasks.length}
                    </Text>
                  ) : d.level === 2 ? (
                    <Check size={16} weight='bold' color={colors.onAcc} />
                  ) : d.level === 1 ? (
                    <Text
                      style={{
                        fontFamily: fonts.figureBold,
                        fontSize: 13,
                        color: colors.accStrong,
                      }}
                    >
                      ½
                    </Text>
                  ) : null}
                </View>
                <Text
                  style={{
                    fontFamily: fonts.jp,
                    fontSize: 11,
                    color: colors.muted,
                  }}
                >
                  {d.label}
                </Text>
              </View>
            ))}
          </View>
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

function NowHero({
  group,
  window,
  steps,
  live,
}: {
  group: GroupName;
  window: string;
  steps: Task[];
  live: boolean;
}) {
  const { colors } = useAppTheme();
  const pc = colors.phase[group];
  const PhaseIcon = PHASE_ICON[group];
  const done = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);
  const total = steps.reduce((n, s) => n + parseMins(s.mins), 0);
  const left = steps
    .filter((s) => !s.done)
    .reduce((n, s) => n + parseMins(s.mins), 0);

  return (
    <View
      style={{
        borderRadius: 24,
        padding: 20,
        gap: 14,
        backgroundColor: pc.tint,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <PhaseIcon size={16} color={pc.ink} />
        <Text
          style={{ fontFamily: fonts.jpMedium, fontSize: 13, color: pc.ink }}
        >
          {live ? 'いまの時間' : 'つぎのルーティン'}
        </Text>
      </View>
      <View>
        <Text
          style={{ fontFamily: fonts.jpBold, fontSize: 22, color: colors.text }}
        >
          {group}のルーティン
        </Text>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 13,
            color: pc.ink,
            marginTop: 2,
          }}
        >
          {window}　{steps.length}ステップ　約{total}分
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }} accessible={false}>
        {steps.map((s) => (
          <View
            key={s.id}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: s.done ? colors.heatFull : pc.track,
            }}
          />
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 12,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            flexShrink: 1,
            fontFamily: fonts.jp,
            fontSize: 14,
            color: colors.text,
          }}
        >
          つぎ　<Text style={{ fontFamily: fonts.jpMedium }}>{next?.name}</Text>
        </Text>
        <Text style={{ fontFamily: fonts.jp, fontSize: 13, color: pc.ink }}>
          {done}/{steps.length} 完了　のこり約{left}分
        </Text>
      </View>
      <Link href={{ pathname: '/play/[group]', params: { group } }} asChild>
        <Pressable
          accessibilityRole='button'
          style={({ pressed }) => ({
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.text,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Play size={18} weight='fill' color={colors.bg} />
          <Text
            style={{
              fontFamily: fonts.jpMedium,
              fontSize: 16,
              color: colors.bg,
            }}
          >
            {done > 0 ? '続きから始める' : '始める'}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
