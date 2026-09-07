import { decideToggle } from '../toggle';

const BASE = {
  stepId: 's3',
  date: '2026-01-15',
  today: '2026-01-15',
  scheduledTodayStepIds: ['s1', 's2', 's3'],
  lastCelebratedDate: undefined as string | undefined,
};

describe('decideToggle', () => {
  it('returns the write instruction verbatim', () => {
    const d = decideToggle({ ...BASE, done: true, doneTodayStepIds: ['s1'] });
    expect(d.write).toEqual({ stepId: 's3', date: '2026-01-15', done: true });
  });

  it('celebrates when the toggle completes the last scheduled step', () => {
    const d = decideToggle({
      ...BASE,
      done: true,
      doneTodayStepIds: ['s1', 's2'],
    });
    expect(d.celebrate).toBe(true);
  });

  it('does not celebrate while steps remain', () => {
    const d = decideToggle({ ...BASE, done: true, doneTodayStepIds: ['s1'] });
    expect(d.celebrate).toBe(false);
  });

  it('does not celebrate on un-toggle', () => {
    const d = decideToggle({
      ...BASE,
      done: false,
      doneTodayStepIds: ['s1', 's2', 's3'],
    });
    expect(d.celebrate).toBe(false);
  });

  it('celebrates only once per day', () => {
    const d = decideToggle({
      ...BASE,
      done: true,
      doneTodayStepIds: ['s1', 's2'],
      lastCelebratedDate: '2026-01-15',
    });
    expect(d.celebrate).toBe(false);
  });

  it('does not celebrate for a backfilled past date', () => {
    const d = decideToggle({
      ...BASE,
      date: '2026-01-10',
      done: true,
      doneTodayStepIds: ['s1', 's2'],
    });
    expect(d.celebrate).toBe(false);
  });
});
