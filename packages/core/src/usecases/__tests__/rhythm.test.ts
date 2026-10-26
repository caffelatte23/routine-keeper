import { aCompletion, aRoutine, aStep } from '../../testing/factories';
import { computeRhythm, rhythmPercent } from '../rhythm';

describe('computeRhythm', () => {
  // 2026-01-05 is a Monday; weekdays only → Sat/Sun are rest.
  const r = aRoutine({
    id: 'r',
    activeDays: [true, true, true, true, true, false, false],
  });
  r.steps = [aStep('r', { id: 'a' }), aStep('r', { id: 'b' })];

  it('counts half-done days as kept and leaves rest days out', () => {
    const res = computeRhythm({
      routines: [r],
      completions: [
        aCompletion('a', '2026-01-05'),
        aCompletion('b', '2026-01-05'), // Mon full
        aCompletion('a', '2026-01-06'), // Tue half → kept
        // Wed–Fri missed
        aCompletion('a', '2026-01-10'), // Sat: rest, completions ignored
      ],
      from: '2026-01-05',
      to: '2026-01-11',
    });
    expect(res).toEqual({ kept: 2, active: 5, rest: 2 });
    expect(rhythmPercent(res)).toBe(40);
  });

  it('has no percentage when nothing is scheduled', () => {
    const res = computeRhythm({
      routines: [],
      completions: [],
      from: '2026-01-05',
      to: '2026-01-06',
    });
    expect(res).toEqual({ kept: 0, active: 0, rest: 2 });
    expect(rhythmPercent(res)).toBeNull();
  });

  it('returns zeros for an empty range', () => {
    expect(
      computeRhythm({
        routines: [r],
        completions: [],
        from: '2026-01-06',
        to: '2026-01-05',
      }),
    ).toEqual({ kept: 0, active: 0, rest: 0 });
  });
});
