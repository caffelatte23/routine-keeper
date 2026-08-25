import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';

export type GroupName = '朝' | '日中' | '夜';

export type Task = {
  id: number;
  group: GroupName;
  name: string;
  time: string;
  streak: number;
  done: boolean;
};

export type RoutineStep = {
  id: number;
  name: string;
  detail: string;
  mins: string;
};

export type Routine = {
  group: GroupName;
  icon: string;
  window: string;
  start: string;
  duration: string;
  days: boolean[]; // 月火水木金土日
  steps: RoutineStep[];
};

export type ReminderSettings = {
  morning: boolean;
  evening: boolean;
  risk: boolean;
  recap: boolean;
  gentleMode: boolean;
  quietStart: string;
  quietEnd: string;
};

const initialTasks: Task[] = [
  { id: 1, group: '朝', name: 'ベッドを整える', time: '6:45', streak: 31, done: true },
  { id: 2, group: '朝', name: 'ストレッチ10分', time: '7:00', streak: 12, done: true },
  { id: 3, group: '朝', name: '日記を1ページ', time: '7:20', streak: 8, done: false },
  { id: 4, group: '日中', name: '昼食後に散歩', time: '13:15', streak: 19, done: true },
  { id: 5, group: '日中', name: '受信箱を空にする', time: '16:00', streak: 5, done: false },
  { id: 6, group: '夜', name: '本を20ページ読む', time: '21:00', streak: 12, done: false },
  { id: 7, group: '夜', name: '23時に消灯', time: '23:00', streak: 12, done: true },
];

const resetPattern: Record<number, boolean> = { 1: true, 2: true, 4: true, 7: true };

export const routines: Record<GroupName, Routine> = {
  朝: {
    group: '朝',
    icon: 'SunHorizon',
    window: '6:45 – 8:00',
    start: '6:45',
    duration: '75分',
    days: [true, true, true, true, true, false, false],
    steps: [
      { id: 1, name: 'ベッドを整える', detail: '最初にやる、基準の一歩', mins: '2分' },
      { id: 2, name: 'ストレッチ', detail: '股関節、ハムストリング、肩', mins: '10分' },
      { id: 3, name: '日記を1ページ', detail: '1ページだけ、書き直さない', mins: '15分' },
      { id: 4, name: '座ってコーヒー', detail: '机から離れて', mins: '20分' },
    ],
  },
  日中: {
    group: '日中',
    icon: 'Briefcase',
    window: '13:00 – 17:00',
    start: '13:00',
    duration: '240分',
    days: [true, true, true, true, true, false, false],
    steps: [
      { id: 1, name: '昼食後に散歩', detail: '外に出て、光を浴びる', mins: '15分' },
      { id: 2, name: '受信箱を空にする', detail: '返信は後回しでいい', mins: '20分' },
    ],
  },
  夜: {
    group: '夜',
    icon: 'MoonStars',
    window: '20:30 – 23:00',
    start: '20:30',
    duration: '150分',
    days: [true, true, true, true, true, true, true],
    steps: [
      { id: 1, name: '本を20ページ読む', detail: '窓際の椅子、スマホはキッチンへ', mins: '25分' },
      { id: 2, name: '23時に消灯', detail: '時間どおりに眠る', mins: '1分' },
    ],
  },
};

const heatPattern = [
  2, 2, 1, 2, 2, 0, 1, 2, 2, 2, 2, 1, 2, 2, 2, 0, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2,
];

const encouragements = [
  '新しい一日。いちばん軽いものから始めましょう。',
  'ひとつ完了。ここから少し楽になります。',
  '2つ目。ここで一日が動き出します。',
  '半分まで来ました。急ぐ必要はありません。',
  '4つ完了。朝はうまく回りましたね。',
  '残りは2つ、どちらも小さめです。',
  'あと1つ。どれかは分かっていますね。',
  '今日のループはすべて閉じました。',
];

type RoutineStore = {
  tasks: Task[];
  doneCount: number;
  streakDays: number;
  celebrating: boolean;
  encouragement: string;
  heatPattern: number[];
  settings: ReminderSettings;
  userName: string;
  setTaskDone: (id: number, done: boolean) => void;
  toggleTask: (id: number) => void;
  dismissCelebration: () => void;
  resetDay: () => void;
  toggleSetting: (key: keyof Pick<ReminderSettings, 'morning' | 'evening' | 'risk' | 'recap' | 'gentleMode'>) => void;
};

const RoutineContext = createContext<RoutineStore | null>(null);

export function RoutineDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [celebrating, setCelebrating] = useState(false);
  const [streakDays, setStreakDays] = useState(12);
  const [settings, setSettings] = useState<ReminderSettings>({
    morning: true,
    evening: true,
    risk: true,
    recap: false,
    gentleMode: true,
    quietStart: '23:15',
    quietEnd: '6:30',
  });

  const doneCount = tasks.filter((t) => t.done).length;

  const setTaskDone = useCallback((id: number, done: boolean) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done } : t));
      if (next.every((t) => t.done) && !prev.every((t) => t.done)) {
        setStreakDays((s) => s + 1);
        setCelebrating(true);
      }
      return next;
    });
  }, []);

  const toggleTask = useCallback(
    (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        setTaskDone(id, !task.done);
      }
    },
    [tasks, setTaskDone],
  );

  const resetDay = useCallback(() => {
    setCelebrating(false);
    setTasks((prev) => prev.map((t) => ({ ...t, done: resetPattern[t.id] ?? false })));
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebrating(false);
  }, []);

  const toggleSetting: RoutineStore['toggleSetting'] = useCallback((key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = useMemo<RoutineStore>(
    () => ({
      tasks,
      doneCount,
      streakDays,
      celebrating,
      encouragement: encouragements[doneCount],
      heatPattern,
      settings,
      userName: 'あかり',
      setTaskDone,
      toggleTask,
      dismissCelebration,
      resetDay,
      toggleSetting,
    }),
    [tasks, doneCount, streakDays, celebrating, settings, setTaskDone, toggleTask, dismissCelebration, resetDay, toggleSetting],
  );

  return <RoutineContext value={value}>{children}</RoutineContext>;
}

export function useRoutineStore(): RoutineStore {
  const ctx = use(RoutineContext);
  if (!ctx) {
    throw new Error('useRoutineStore must be used within RoutineDataProvider');
  }
  return ctx;
}
