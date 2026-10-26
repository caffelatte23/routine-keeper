import { systemClock, type GroupName } from '@routine-keeper/core';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, SkipForward, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { formatTimer, parseMins } from '@/lib/day';
import { useRoutines, useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const RING = 248;
const R = 110;
const CIRC = 2 * Math.PI * R;
const MOODS = ['すっきり', 'ふつう', 'いまいち'];

export default function PlayScreen() {
  const { group } = useLocalSearchParams<{ group: GroupName }>();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const routines = useRoutines();
  const { tasks, setTaskDone } = useRoutineStore();
  const steps = tasks.filter((t) => t.group === group);
  const details = routines[group]?.steps ?? [];

  const [startedAt] = useState(() => systemClock.now());
  // Steps finished/skipped in this session; the live query can lag a write.
  const [doneHere, setDoneHere] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [idx, setIdx] = useState(() => {
    const i = steps.findIndex((s) => !s.done);
    return i === -1 ? steps.length : i;
  });
  const step = steps[idx];
  const secsOf = (i: number) => {
    const s = steps[i];
    return s ? parseMins(s.mins) * 60 || 60 : 0;
  };
  const [left, setLeft] = useState(() => secsOf(idx));
  const [total, setTotal] = useState(() => secsOf(idx));
  const [paused, setPaused] = useState(false);
  const [mood, setMood] = useState<string | null>(null);

  const finished = idx >= steps.length;

  useEffect(() => {
    if (paused || finished) {
      return;
    }
    const id = setInterval(() => {
      setLeft((s) => {
        if (s === 1) {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
          ).catch(() => {});
        }
        return Math.max(s - 1, 0);
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [paused, finished, idx]);

  if (!routines[group] || steps.length === 0) {
    return null;
  }

  const pc = colors.phase[group];

  const advance = (completed: string[]) => {
    const next = steps.findIndex(
      (s, i) => i > idx && !s.done && !completed.includes(s.id),
    );
    const to = next === -1 ? steps.length : next;
    setIdx(to);
    setLeft(secsOf(to));
    setTotal(secsOf(to));
    setPaused(false);
  };

  const complete = () => {
    if (!step) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setTaskDone(step.id, true);
    const completed = [...doneHere, step.id];
    setDoneHere(completed);
    advance(completed);
  };

  const skip = () => {
    if (!step) {
      return;
    }
    setSkipped([...skipped, step.id]);
    advance(doneHere);
  };

  const nextStep = steps.find(
    (s, i) => i > idx && !s.done && !doneHere.includes(s.id),
  );
  const detail = details.find((d) => d.id === step?.id)?.detail;
  const doneTotal = steps.filter(
    (s) => s.done || doneHere.includes(s.id),
  ).length;

  const roundBtn = {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: pc.track,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  } as const;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: finished ? colors.bg : pc.tint,
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 20,
        paddingHorizontal: 20,
        gap: 20,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
          accessibilityRole='button'
          accessibilityLabel='閉じる'
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: finished ? colors.surface2 : pc.track,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} color={colors.text} />
        </Pressable>
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 14,
            color: colors.text,
          }}
        >
          {group}のルーティン
        </Text>
        <Text
          style={{
            width: 44,
            textAlign: 'right',
            fontFamily: fonts.figureBold,
            fontSize: 15,
            color: colors.text,
          }}
        >
          {finished ? '' : `${idx + 1}/${steps.length}`}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 4 }}>
        {steps.map((s, i) => {
          const isDone = s.done || doneHere.includes(s.id);
          return (
            <View
              key={s.id}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: isDone
                  ? colors.heatFull
                  : skipped.includes(s.id)
                    ? colors.faint
                    : i === idx
                      ? colors.text
                      : finished
                        ? colors.surface2
                        : pc.track,
              }}
            />
          );
        })}
      </View>

      {finished ? (
        <FinishView
          group={group}
          doneCount={doneTotal}
          stepCount={steps.length}
          minutes={Math.max(
            1,
            Math.round((systemClock.now() - startedAt) / 60_000),
          )}
          mood={mood}
          onMood={setMood}
        />
      ) : (
        <>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 28,
            }}
          >
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Text
                style={{
                  fontFamily: fonts.jpBold,
                  fontSize: 30,
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                {step?.name}
              </Text>
              {detail ? (
                <Text
                  style={{
                    fontFamily: fonts.jp,
                    fontSize: 15,
                    color: pc.ink,
                    textAlign: 'center',
                  }}
                >
                  {detail}
                </Text>
              ) : null}
            </View>
            <View
              accessible
              accessibilityRole='timer'
              accessibilityLabel={`のこり ${formatTimer(left)}`}
              style={{ width: RING, height: RING }}
            >
              <Svg width={RING} height={RING}>
                <Circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={R}
                  stroke={pc.track}
                  strokeWidth={10}
                  fill='none'
                />
                <Circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={R}
                  stroke={colors.text}
                  strokeWidth={10}
                  fill='none'
                  strokeLinecap='round'
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - left / Math.max(total, 1))}
                  transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
                />
              </Svg>
              <View
                style={{
                  position: 'absolute',
                  inset: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.figureBold,
                    fontSize: 60,
                    color: colors.text,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {formatTimer(left)}
                </Text>
                <Text
                  style={{ fontFamily: fonts.jp, fontSize: 13, color: pc.ink }}
                >
                  {left === 0
                    ? '時間です。終わったら完了を'
                    : `のこり　目安 ${step?.mins}`}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => {
                setPaused((p) => !p);
              }}
              accessibilityRole='button'
              style={{
                height: 36,
                paddingHorizontal: 16,
                borderRadius: 18,
                backgroundColor: pc.track,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.jp,
                  fontSize: 13,
                  color: colors.text,
                }}
              >
                {paused ? '再開する' : '一時停止'}
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 28,
            }}
          >
            <Pressable
              onPress={skip}
              accessibilityRole='button'
              accessibilityLabel='スキップ'
              style={roundBtn}
            >
              <SkipForward size={20} color={colors.text} />
              <Text
                style={{
                  fontFamily: fonts.jp,
                  fontSize: 11,
                  color: colors.text,
                }}
              >
                スキップ
              </Text>
            </Pressable>
            <Pressable
              onPress={complete}
              accessibilityRole='button'
              accessibilityLabel={`${step?.name} を完了`}
              style={({ pressed }) => ({
                width: 92,
                height: 92,
                borderRadius: 46,
                backgroundColor: colors.heatFull,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Check size={36} weight='bold' color='#ffffff' />
            </Pressable>
            <Pressable
              onPress={() => {
                setLeft((s) => s + 60);
                setTotal((t) => t + 60);
              }}
              accessibilityRole='button'
              accessibilityLabel='1分のばす'
              style={roundBtn}
            >
              <Text
                style={{
                  fontFamily: fonts.figureBold,
                  fontSize: 17,
                  color: colors.text,
                }}
              >
                +1
              </Text>
              <Text
                style={{
                  fontFamily: fonts.jp,
                  fontSize: 11,
                  color: colors.text,
                }}
              >
                分
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 18,
              backgroundColor: pc.track,
            }}
          >
            <Text style={{ fontFamily: fonts.jp, fontSize: 12, color: pc.ink }}>
              つぎ
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontFamily: fonts.jpMedium,
                fontSize: 15,
                color: colors.text,
              }}
            >
              {nextStep?.name ?? 'おしまい'}
            </Text>
            <Text style={{ fontFamily: fonts.jp, fontSize: 13, color: pc.ink }}>
              {nextStep?.mins ?? ''}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

function FinishView({
  group,
  doneCount,
  stepCount,
  minutes,
  mood,
  onMood,
}: {
  group: GroupName;
  doneCount: number;
  stepCount: number;
  minutes: number;
  mood: string | null;
  onMood: (m: string) => void;
}) {
  const { colors } = useAppTheme();
  const stat = (value: string, label: string) => (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontFamily: fonts.figureBold,
          fontSize: 28,
          color: colors.text,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontFamily: fonts.jp, fontSize: 13, color: colors.muted }}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, gap: 36, paddingTop: 40 }}>
      <View style={{ alignItems: 'center', gap: 16 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: colors.heatFull,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check size={44} weight='bold' color='#ffffff' />
        </View>
        <Text
          style={{
            fontFamily: fonts.jpBold,
            fontSize: 24,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          {group}のルーティン、おしまい
        </Text>
        <View style={{ flexDirection: 'row', gap: 32 }}>
          {stat(`${doneCount}/${stepCount}`, 'ステップ')}
          {stat(String(minutes), '分')}
        </View>
      </View>

      {/* ponytail: mood is session-only; persist it once ふりかえり reads it. */}
      <View style={{ gap: 12 }}>
        <Text
          style={{
            fontFamily: fonts.jpMedium,
            fontSize: 15,
            color: colors.text,
          }}
        >
          いまの気分は？
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {MOODS.map((m) => {
            const on = mood === m;
            return (
              <Pressable
                key={m}
                onPress={() => {
                  onMood(m);
                }}
                accessibilityRole='radio'
                accessibilityState={{ selected: on }}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: on ? 2 : 1,
                  borderColor: on ? colors.text : colors.line,
                  backgroundColor: on ? colors.accTint : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: on ? fonts.jpMedium : fonts.jp,
                    fontSize: 15,
                    color: colors.text,
                  }}
                >
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ flex: 1 }} />
      <Pressable
        onPress={() => {
          router.back();
        }}
        accessibilityRole='button'
        style={{
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.text,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{ fontFamily: fonts.jpMedium, fontSize: 16, color: colors.bg }}
        >
          今日の画面へ
        </Text>
      </Pressable>
    </View>
  );
}
