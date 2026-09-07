import {
  addDays,
  META_KEYS,
  systemClock,
  todayIso,
  weekdayMonday0,
  type GroupName,
} from '@routine-keeper/core';

import { repos } from './client';

interface SeedStep {
  name: string;
  detail: string;
  mins: string;
  time: string;
}

interface SeedRoutine {
  group: GroupName;
  icon: string;
  window: string;
  start: string;
  duration: string;
  days: boolean[]; // 月..日
  steps: SeedStep[];
}

const SEED: SeedRoutine[] = [
  {
    group: '朝',
    icon: 'SunHorizon',
    window: '6:45 – 8:00',
    start: '6:45',
    duration: '75分',
    days: [true, true, true, true, true, false, false],
    steps: [
      {
        name: 'ベッドを整える',
        detail: '最初にやる、基準の一歩',
        mins: '2分',
        time: '6:45',
      },
      {
        name: 'ストレッチ10分',
        detail: '股関節、ハムストリング、肩',
        mins: '10分',
        time: '7:00',
      },
      {
        name: '日記を1ページ',
        detail: '1ページだけ、書き直さない',
        mins: '15分',
        time: '7:20',
      },
    ],
  },
  {
    group: '日中',
    icon: 'Briefcase',
    window: '13:00 – 17:00',
    start: '13:00',
    duration: '240分',
    days: [true, true, true, true, true, false, false],
    steps: [
      {
        name: '昼食後に散歩',
        detail: '外に出て、光を浴びる',
        mins: '15分',
        time: '13:15',
      },
      {
        name: '受信箱を空にする',
        detail: '返信は後回しでいい',
        mins: '20分',
        time: '16:00',
      },
    ],
  },
  {
    group: '夜',
    icon: 'MoonStars',
    window: '20:30 – 23:00',
    start: '20:30',
    duration: '150分',
    days: [true, true, true, true, true, true, true],
    steps: [
      {
        name: '本を20ページ読む',
        detail: '窓際の椅子、スマホはキッチンへ',
        mins: '25分',
        time: '21:00',
      },
      {
        name: '23時に消灯',
        detail: '時間どおりに眠る',
        mins: '1分',
        time: '23:00',
      },
    ],
  },
];

const BACKFILL_DAYS = 28;

/** Populate a fresh database once with the demo routines and ~4 weeks of history. */
export function runSeed(): void {
  if (repos.meta.get(META_KEYS.seeded) === '1') {
    return;
  }

  const today = todayIso(systemClock);
  const steps: { id: string; routineIdx: number }[] = [];

  SEED.forEach((routine, ri) => {
    const created = repos.routines.create({
      group: routine.group,
      icon: routine.icon,
      windowLabel: routine.window,
      startTime: routine.start,
      durationLabel: routine.duration,
      activeDays: routine.days,
      sortOrder: ri,
    });
    routine.steps.forEach((step, si) => {
      const createdStep = repos.routines.addStep({
        routineId: created.id,
        name: step.name,
        detail: step.detail,
        minsLabel: step.mins,
        timeLabel: step.time,
        sortOrder: si,
      });
      steps.push({ id: createdStep.id, routineIdx: ri });
    });
  });

  // Backfill the last 4 weeks (not today) with a deterministic ~85%-done pattern
  // so the heatmap and calendar look lived-in on first launch.
  for (let daysAgo = BACKFILL_DAYS; daysAgo >= 1; daysAgo -= 1) {
    const date = addDays(today, -daysAgo);
    const wd = weekdayMonday0(date);
    steps.forEach((step, idx) => {
      if (SEED[step.routineIdx].days[wd] !== true) {
        return;
      } // not scheduled
      const missed = (daysAgo * 3 + idx * 5) % 17 === 0 || daysAgo % 9 === 0;
      if (!missed) {
        repos.completions.set(step.id, date, true);
      }
    });
  }

  repos.meta.set(META_KEYS.seeded, '1');
}
