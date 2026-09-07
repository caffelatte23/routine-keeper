import { addDays, weekdayMonday0 } from '../../domain';
import {
  aCompletion,
  aRoutine,
  aStep,
  EVERY_DAY,
} from '../../testing/factories';
import { buildTodayTasks } from '../today';

// A Saturday: 2026-01-03 (weekdayMonday0 === 5).
const SATURDAY = '2026-01-03';
const WEEKDAY = '2026-01-15';

function routineWith(id: string, activeDays: boolean[], stepIds: string[]) {
  const r = aRoutine({ id, activeDays });
  r.steps = stepIds.map((sid, i) => aStep(id, { id: sid, sortOrder: i }));
  return r;
}

describe('buildTodayTasks', () => {
  it('sanity-checks the fixture weekday', () => {
    expect(weekdayMonday0(SATURDAY)).toBe(5);
  });

  it('includes only steps whose routine is scheduled today', () => {
    const daily = routineWith('daily', [...EVERY_DAY], ['d1', 'd2']);
    const weekdaysOnly = routineWith(
      'wk',
      [true, true, true, true, true, false, false],
      ['w1'],
    );

    const tasks = buildTodayTasks({
      routines: [daily, weekdaysOnly],
      completions: [],
      date: SATURDAY,
    });

    expect(tasks.map((t) => t.step.id)).toEqual(['d1', 'd2']);
  });

  it("marks done from that day's completions and carries the streak", () => {
    const daily = routineWith('daily', [...EVERY_DAY], ['d1', 'd2']);
    const completions = [
      aCompletion('d1', WEEKDAY),
      aCompletion('d1', addDays(WEEKDAY, -1)),
    ];

    const tasks = buildTodayTasks({
      routines: [daily],
      completions,
      date: WEEKDAY,
    });

    const d1 = tasks.find((t) => t.step.id === 'd1');
    const d2 = tasks.find((t) => t.step.id === 'd2');
    expect(d1).toMatchObject({ done: true, streak: 2 });
    expect(d2).toMatchObject({ done: false, streak: 0 });
  });

  it('falls back to the routine start time when the step has none', () => {
    const r = aRoutine({ id: 'r', startTime: '6:45' });
    r.steps = [
      aStep('r', { id: 'withTime', timeLabel: '7:20' }),
      aStep('r', { id: 'noTime', timeLabel: null }),
    ];
    const tasks = buildTodayTasks({
      routines: [r],
      completions: [],
      date: WEEKDAY,
    });
    expect(tasks.find((t) => t.step.id === 'withTime')?.time).toBe('7:20');
    expect(tasks.find((t) => t.step.id === 'noTime')?.time).toBe('6:45');
  });
});
