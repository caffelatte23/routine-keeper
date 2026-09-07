import { weekdayMonday0 } from '../../domain';
import {
  aCompletion,
  aRoutine,
  aStep,
  EVERY_DAY,
  WEEKDAYS,
} from '../../testing/factories';
import { buildHeatmap } from '../heatmap';

// 2026-01-04 is a Sunday; the 7-day window back to 2025-12-29 (Monday).
const SUNDAY = '2026-01-04';

describe('buildHeatmap', () => {
  it('sanity-checks fixture weekdays', () => {
    expect(weekdayMonday0(SUNDAY)).toBe(6);
    expect(weekdayMonday0('2025-12-29')).toBe(0);
  });

  it('marks rest days 0 and fully-done days 2', () => {
    const r = aRoutine({ id: 'r', activeDays: [...WEEKDAYS] });
    r.steps = [aStep('r', { id: 's1' })];
    const weekdayDates = [
      '2025-12-29',
      '2025-12-30',
      '2025-12-31',
      '2026-01-01',
      '2026-01-02',
    ];
    const completions = weekdayDates.map((d) => aCompletion('s1', d));

    expect(
      buildHeatmap({ routines: [r], completions, endDate: SUNDAY, days: 7 }),
    ).toEqual([2, 2, 2, 2, 2, 0, 0]);
  });

  it('marks a partially-done day 1', () => {
    const r = aRoutine({ id: 'r', activeDays: [...EVERY_DAY] });
    r.steps = [aStep('r', { id: 'a' }), aStep('r', { id: 'b' })];
    const completions = [aCompletion('a', SUNDAY)]; // b missing

    const out = buildHeatmap({
      routines: [r],
      completions,
      endDate: SUNDAY,
      days: 1,
    });
    expect(out).toEqual([1]);
  });

  it('is all zeros with no completions', () => {
    const r = aRoutine({ id: 'r', activeDays: [...EVERY_DAY] });
    r.steps = [aStep('r', { id: 'a' })];
    expect(
      buildHeatmap({
        routines: [r],
        completions: [],
        endDate: SUNDAY,
        days: 5,
      }),
    ).toEqual([0, 0, 0, 0, 0]);
  });
});
