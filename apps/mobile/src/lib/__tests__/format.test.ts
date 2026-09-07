import { formatJpDate } from '../format';

describe('formatJpDate', () => {
  it('formats an ISO date as a Japanese long date', () => {
    // 2026-08-25 is a Tuesday.
    expect(formatJpDate('2026-08-25')).toBe('2026年8月25日 火曜日');
  });

  it('does not zero-pad the month or day', () => {
    expect(formatJpDate('2026-01-04')).toBe('2026年1月4日 日曜日');
  });
});
