import { addDays, weekdayMonday0 } from '../../domain';
import {
  aCompletion,
  aRoutine,
  aStep,
  EVERY_DAY,
  WEEKDAYS,
} from '../../testing/factories';
import { computeGlobalStreak, computeStepStreak } from '../streak';

const TODAY = '2026-01-15';

describe('computeStepStreak', () => {
  it('counts consecutive completed days ending today', () => {
    const dates = [addDays(TODAY, -2), addDays(TODAY, -1), TODAY];
    const completions = dates.map((d) => aCompletion('s1', d));
    expect(computeStepStreak('s1', EVERY_DAY, completions, TODAY)).toBe(3);
  });

  it('gives today a grace pass when not done yet', () => {
    const completions = [addDays(TODAY, -2), addDays(TODAY, -1)].map((d) =>
      aCompletion('s1', d),
    );
    expect(computeStepStreak('s1', EVERY_DAY, completions, TODAY)).toBe(2);
  });

  it('breaks on a missed scheduled day before today', () => {
    const completions = [addDays(TODAY, -3), addDays(TODAY, -1), TODAY].map(
      (d) => aCompletion('s1', d),
    );
    expect(computeStepStreak('s1', EVERY_DAY, completions, TODAY)).toBe(2);
  });

  it('is zero with no completions', () => {
    expect(computeStepStreak('s1', EVERY_DAY, [], TODAY)).toBe(0);
  });

  it('ignores unscheduled weekdays', () => {
    // complete only the scheduled (Mon–Fri) days across a 14-day window
    const window = Array.from({ length: 14 }, (_, i) =>
      addDays(TODAY, -13 + i),
    );
    const completions = window
      .filter((d) => weekdayMonday0(d) < 5)
      .map((d) => aCompletion('s1', d));
    const streak = computeStepStreak('s1', WEEKDAYS, completions, TODAY);
    const scheduledInWindow = window.filter(
      (d) => weekdayMonday0(d) < 5,
    ).length;
    expect(streak).toBe(scheduledInWindow);
  });
});

describe('computeGlobalStreak', () => {
  const r = aRoutine({ id: 'r1', activeDays: [...EVERY_DAY] });
  r.steps = [aStep('r1', { id: 'a' }), aStep('r1', { id: 'b' })];

  it('counts days where every scheduled step is done', () => {
    const days = [addDays(TODAY, -1), TODAY];
    const completions = days.flatMap((d) => [
      aCompletion('a', d),
      aCompletion('b', d),
    ]);
    expect(computeGlobalStreak([r], completions, TODAY)).toBe(2);
  });

  it('does not count a partially-done day, but today gets grace', () => {
    const completions = [
      aCompletion('a', addDays(TODAY, -1)),
      aCompletion('b', addDays(TODAY, -1)),
      aCompletion('a', TODAY), // b missing today
    ];
    expect(computeGlobalStreak([r], completions, TODAY)).toBe(1);
  });

  it('breaks on a partially-done earlier day', () => {
    const completions = [
      aCompletion('a', addDays(TODAY, -2)),
      aCompletion('b', addDays(TODAY, -2)),
      aCompletion('a', addDays(TODAY, -1)), // b missing → break here
      aCompletion('a', TODAY),
      aCompletion('b', TODAY),
    ];
    expect(computeGlobalStreak([r], completions, TODAY)).toBe(1);
  });
});
