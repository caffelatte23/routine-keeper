import {
  addDays,
  buildHeatmap,
  buildMonthStatus,
  buildTodayTasks,
  completion as completionTable,
  computeGlobalStreak,
  DEFAULT_SETTINGS,
  decideToggle,
  META_KEYS,
  meta as metaTable,
  routine as routineTable,
  routineStep as stepTable,
  scheduledStepIds,
  systemClock,
  toCompletion,
  todayIso,
  toRoutine,
  toStep,
  type Completion,
  type GroupName,
  type MonthResult,
  type ReminderSettings,
  type RoutineRow,
  type RoutineStepRow,
  type RoutineWithSteps,
} from '@routine-keeper/core';
import { and, eq, gte } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { db, repos } from '@/db/client';
import { migrations } from '@/db/migrations';
import { runSeed } from '@/db/seed';

const HISTORY_DAYS = 60;
const HEATMAP_DAYS = 28;

const ENCOURAGEMENTS = [
  '新しい一日。いちばん軽いものから始めましょう。',
  'ひとつ完了。ここから少し楽になります。',
  '2つ目。ここで一日が動き出します。',
  '半分まで来ました。急ぐ必要はありません。',
  '4つ完了。朝はうまく回りましたね。',
  '残りは少しだけ、どれも小さめです。',
  'あと1つ。どれかは分かっていますね。',
  '今日のループはすべて閉じました。',
];

// ---- compat shapes: the screens still speak the old mock vocabulary ----

export type { GroupName, ReminderSettings } from '@routine-keeper/core';

export interface Task {
  id: string;
  group: GroupName;
  name: string;
  time: string;
  streak: number;
  done: boolean;
}

export interface RoutineStep {
  id: string;
  name: string;
  detail: string;
  mins: string;
}

export interface RoutineView {
  group: GroupName;
  icon: string;
  window: string;
  start: string;
  duration: string;
  days: boolean[];
  steps: RoutineStep[];
}

export interface StepDetail {
  name: string;
  group: GroupName;
  time: string;
  streak: number;
  heat: number[];
}

interface RoutineStore {
  tasks: Task[];
  doneCount: number;
  streakDays: number;
  celebrating: boolean;
  encouragement: string;
  heatPattern: number[];
  settings: ReminderSettings;
  userName: string;
  onboarded: boolean;
  routinesByGroup: Record<string, RoutineView>;
  setTaskDone: (id: string, done: boolean) => void;
  toggleTask: (id: string) => void;
  dismissCelebration: () => void;
  toggleSetting: (
    key: keyof Pick<
      ReminderSettings,
      'morning' | 'evening' | 'risk' | 'recap' | 'gentleMode'
    >,
  ) => void;
  completeOnboarding: (groups: GroupName[]) => void;
  stepDetail: (id: string | undefined) => StepDetail | undefined;
  monthStatus: (year: number, month1: number) => MonthResult;
}

const RoutineContext = createContext<RoutineStore | null>(null);

function assemble(
  routineRows: RoutineRow[],
  stepRows: RoutineStepRow[],
): RoutineWithSteps[] {
  const steps = stepRows.map(toStep);
  return routineRows
    .map(toRoutine)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r) => ({
      ...r,
      steps: steps
        .filter((s) => s.routineId === r.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
}

export function RoutineDataProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (success) {
      runSeed();
    }
  }, [success]);

  const today = todayIso(systemClock);
  const historyStart = addDays(today, -HISTORY_DAYS);

  const routineRows = useLiveQuery(
    db.select().from(routineTable).where(eq(routineTable.deleted, 0)),
  );
  const stepRows = useLiveQuery(
    db.select().from(stepTable).where(eq(stepTable.deleted, 0)),
  );
  const completionRows = useLiveQuery(
    db
      .select()
      .from(completionTable)
      .where(
        and(
          eq(completionTable.deleted, 0),
          gte(completionTable.date, historyStart),
        ),
      ),
  );
  const metaRows = useLiveQuery(
    db.select().from(metaTable).where(eq(metaTable.deleted, 0)),
  );

  const routines = useMemo(
    () => assemble(routineRows.data ?? [], stepRows.data ?? []),
    [routineRows.data, stepRows.data],
  );
  const completions = useMemo<Completion[]>(
    () => (completionRows.data ?? []).map(toCompletion),
    [completionRows.data],
  );
  const metaMap = useMemo(() => {
    const out: Record<string, string> = {};
    for (const row of metaRows.data ?? []) {
      out[row.key] = row.value;
    }
    return out;
  }, [metaRows.data]);

  const settings = useMemo<ReminderSettings>(() => {
    const raw = metaMap[META_KEYS.settings];
    return raw
      ? {
          ...DEFAULT_SETTINGS,
          ...(JSON.parse(raw) as Partial<ReminderSettings>),
        }
      : DEFAULT_SETTINGS;
  }, [metaMap]);

  const tasks = useMemo<Task[]>(
    () =>
      buildTodayTasks({ routines, completions, date: today }).map((t) => ({
        id: t.step.id,
        group: t.group,
        name: t.step.name,
        time: t.time,
        streak: t.streak,
        done: t.done,
      })),
    [routines, completions, today],
  );

  const doneCount = tasks.filter((t) => t.done).length;

  const setTaskDone = useCallback(
    (id: string, done: boolean) => {
      const decision = decideToggle({
        stepId: id,
        date: today,
        done,
        scheduledTodayStepIds: scheduledStepIds(routines, today),
        doneTodayStepIds: tasks.filter((t) => t.done).map((t) => t.id),
        today,
        lastCelebratedDate: metaMap[META_KEYS.lastCelebratedDate],
      });
      repos.completions.set(
        decision.write.stepId,
        decision.write.date,
        decision.write.done,
      );
      if (decision.celebrate) {
        repos.meta.set(META_KEYS.lastCelebratedDate, today);
        setCelebrating(true);
      }
    },
    [routines, tasks, metaMap, today],
  );

  const toggleTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        setTaskDone(id, !task.done);
      }
    },
    [tasks, setTaskDone],
  );

  const toggleSetting = useCallback<RoutineStore['toggleSetting']>(
    (key) => {
      repos.meta.setJson(META_KEYS.settings, {
        ...settings,
        [key]: !settings[key],
      });
    },
    [settings],
  );

  const completeOnboarding = useCallback<RoutineStore['completeOnboarding']>(
    (groups) => {
      repos.meta.set(META_KEYS.onboardingComplete, '1');
      repos.meta.setJson(META_KEYS.enabledGroups, groups);
    },
    [],
  );

  const routinesByGroup = useMemo<Record<string, RoutineView>>(() => {
    const out: Record<string, RoutineView> = {};
    for (const r of routines) {
      out[r.group] = {
        group: r.group,
        icon: r.icon,
        window: r.windowLabel,
        start: r.startTime,
        duration: r.durationLabel,
        days: r.activeDays,
        steps: r.steps.map((s) => ({
          id: s.id,
          name: s.name,
          detail: s.detail,
          mins: s.minsLabel,
        })),
      };
    }
    return out;
  }, [routines]);

  const stepDetail = useCallback<RoutineStore['stepDetail']>(
    (id) => {
      if (!id) {
        return undefined;
      }
      for (const r of routines) {
        const step = r.steps.find((s) => s.id === id);
        if (!step) {
          continue;
        }
        const single: RoutineWithSteps = { ...r, steps: [step] };
        return {
          name: step.name,
          group: r.group,
          time: step.timeLabel ?? r.startTime,
          streak:
            buildTodayTasks({
              routines: [single],
              completions,
              date: today,
            }).find((t) => t.step.id === id)?.streak ?? 0,
          heat: buildHeatmap({
            routines: [single],
            completions,
            endDate: today,
            days: HEATMAP_DAYS,
          }),
        };
      }
      return undefined;
    },
    [routines, completions, today],
  );

  const monthStatus = useCallback<RoutineStore['monthStatus']>(
    (year, month1) =>
      buildMonthStatus({ routines, completions, year, month1, today }),
    [routines, completions, today],
  );

  const value = useMemo<RoutineStore>(
    () => ({
      tasks,
      doneCount,
      streakDays: computeGlobalStreak(routines, completions, today),
      celebrating,
      encouragement:
        ENCOURAGEMENTS[Math.min(doneCount, ENCOURAGEMENTS.length - 1)],
      heatPattern: buildHeatmap({
        routines,
        completions,
        endDate: today,
        days: HEATMAP_DAYS,
      }),
      settings,
      userName: metaMap[META_KEYS.userName] ?? 'あかり',
      onboarded: metaMap[META_KEYS.onboardingComplete] === '1',
      routinesByGroup,
      setTaskDone,
      toggleTask,
      dismissCelebration: () => {
        setCelebrating(false);
      },
      toggleSetting,
      completeOnboarding,
      stepDetail,
      monthStatus,
    }),
    [
      tasks,
      doneCount,
      routines,
      completions,
      today,
      celebrating,
      settings,
      metaMap,
      routinesByGroup,
      setTaskDone,
      toggleTask,
      toggleSetting,
      completeOnboarding,
      stepDetail,
      monthStatus,
    ],
  );

  if (error) {
    console.error('[routine-keeper] migration failed', error);
  }
  if (!success) {
    return null;
  } // keep the splash screen up

  return <RoutineContext value={value}>{children}</RoutineContext>;
}

export function useRoutineStore(): RoutineStore {
  const ctx = use(RoutineContext);
  if (!ctx) {
    throw new Error('useRoutineStore must be used within RoutineDataProvider');
  }
  return ctx;
}

export function useRoutines(): Record<string, RoutineView> {
  return useRoutineStore().routinesByGroup;
}
