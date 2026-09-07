import { weekdayMonday0 } from '../../domain';
import {
  aCompletion,
  aRoutine,
  aStep,
  EVERY_DAY,
  WEEKDAYS,
} from '../../testing/factories';
import { buildMonthStatus } from '../month';

describe('buildMonthStatus', () => {
  it('reports firstWeekday for the 1st', () => {
    // 2026-01-01 is a Thursday → Monday0 index 3.
    const res = buildMonthStatus({
      routines: [],
      completions: [],
      year: 2026,
      month1: 1,
      today: '2026-01-31',
    });
    expect(res.firstWeekday).toBe(3);
    expect(weekdayMonday0('2026-01-01')).toBe(3);
    expect(res.statuses).toHaveLength(31);
  });

  it('classifies full / partial / missed / none', () => {
    const r = aRoutine({ id: 'r', activeDays: [...EVERY_DAY] });
    r.steps = [aStep('r', { id: 'a' }), aStep('r', { id: 'b' })];
    const completions = [
      aCompletion('a', '2026-01-01'),
      aCompletion('b', '2026-01-01'), // day 1 full
      aCompletion('a', '2026-01-02'), // day 2 partial
      // day 3 missed
    ];

    const res = buildMonthStatus({
      routines: [r],
      completions,
      year: 2026,
      month1: 1,
      today: '2026-01-05',
    });

    expect(res.statuses.slice(0, 6)).toEqual([
      'full',
      'partial',
      'missed',
      'missed',
      'missed',
      'none', // day 6 is in the future relative to 2026-01-05
    ]);
    expect(res.fullDays).toBe(1);
  });

  it('treats rest days as none, not missed', () => {
    const r = aRoutine({ id: 'r', activeDays: [...WEEKDAYS] });
    r.steps = [aStep('r', { id: 'a' })];
    // 2026-01-03 Sat, 2026-01-04 Sun
    const res = buildMonthStatus({
      routines: [r],
      completions: [],
      year: 2026,
      month1: 1,
      today: '2026-01-10',
    });
    expect(res.statuses[2]).toBe('none'); // Sat
    expect(res.statuses[3]).toBe('none'); // Sun
    expect(res.statuses[0]).toBe('missed'); // Thu, scheduled, nothing done
  });
});
