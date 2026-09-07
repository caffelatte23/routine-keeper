import type { IsoDate } from './date';

export type GroupName = '朝' | '日中' | '夜';

export const GROUP_ORDER: readonly GroupName[] = ['朝', '日中', '夜'];

/** A section of the day the user is trying to shape. */
export interface Routine {
  id: string;
  group: GroupName;
  icon: string;
  windowLabel: string; // '6:45 – 8:00'
  startTime: string; // '6:45'
  durationLabel: string; // '75分'
  activeDays: boolean[]; // length 7, 月..日
  sortOrder: number;
}

/** One concrete action inside a routine. */
export interface RoutineStep {
  id: string;
  routineId: string;
  name: string;
  detail: string;
  minsLabel: string; // estimated duration, '10分'
  timeLabel: string | null; // scheduled time '7:00'; falls back to the routine's startTime
  sortOrder: number;
  notify: boolean;
  notifyAt: string | null; // 'HH:mm'
}

/** A step marked done on a given local date. Absence (or a tombstone) means "not done". */
export interface Completion {
  id: string;
  stepId: string;
  date: IsoDate;
  completedAt: number; // epoch ms
}

export interface RoutineWithSteps extends Routine {
  steps: RoutineStep[];
}

export interface ReminderSettings {
  morning: boolean;
  evening: boolean;
  risk: boolean;
  recap: boolean;
  gentleMode: boolean;
  quietStart: string;
  quietEnd: string;
}

export const DEFAULT_SETTINGS: ReminderSettings = {
  morning: true,
  evening: true,
  risk: true,
  recap: false,
  gentleMode: true,
  quietStart: '23:15',
  quietEnd: '6:30',
};

/** Known keys in the `meta` KV table. */
export const META_KEYS = {
  seeded: 'seeded',
  userName: 'profile.userName',
  onboardingComplete: 'onboarding.complete',
  enabledGroups: 'onboarding.enabledGroups',
  lastCelebratedDate: 'celebration.lastDate',
  settings: 'settings',
} as const;

/** View model for the Today screen (mirrors the old mock `Task`). */
export interface TodayTask {
  step: RoutineStep;
  group: GroupName;
  time: string;
  streak: number;
  done: boolean;
}

export type DayStatus = 'full' | 'partial' | 'missed' | 'none';
