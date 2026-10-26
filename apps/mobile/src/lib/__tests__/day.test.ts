import {
  dayFraction,
  daysSummary,
  formatTimer,
  parseMins,
  parseWindow,
  pickFeatured,
} from '../day';

describe('parseWindow', () => {
  it('reads the seed window label', () => {
    expect(parseWindow('6:45 – 8:00')).toEqual({ start: 405, end: 480 });
  });

  it('falls back to a one-hour block without an end', () => {
    expect(parseWindow('12:00')).toEqual({ start: 720, end: 780 });
  });
});

describe('pickFeatured', () => {
  const windows = [
    { group: '朝' as const, start: 405, end: 480 },
    { group: '日中' as const, start: 720, end: 780 },
    { group: '夜' as const, start: 1290, end: 1380 },
  ];
  const tasks = (doneGroups: string[]) =>
    windows.map((w) => ({
      group: w.group,
      done: doneGroups.includes(w.group),
    }));

  it('surfaces the current routine', () => {
    expect(pickFeatured(windows, tasks([]), 420)).toBe('朝');
  });

  it('moves on to the next routine once one is done', () => {
    expect(pickFeatured(windows, tasks(['朝']), 420)).toBe('日中');
  });

  it('keeps an unfinished routine after its window ends if nothing later is open', () => {
    expect(pickFeatured(windows, tasks(['日中', '夜']), 1400)).toBe('朝');
  });

  it('returns null when everything is done', () => {
    expect(pickFeatured(windows, tasks(['朝', '日中', '夜']), 600)).toBeNull();
  });
});

describe('small formatters', () => {
  it('parses minute labels', () => {
    expect(parseMins('10分')).toBe(10);
    expect(parseMins('')).toBe(0);
  });

  it('formats a countdown', () => {
    expect(formatTimer(134)).toBe('2:14');
    expect(formatTimer(-3)).toBe('0:00');
  });

  it('clamps the day bar to 6:00–24:00', () => {
    expect(dayFraction(0)).toBe(0);
    expect(dayFraction(900)).toBe(0.5);
    expect(dayFraction(1500)).toBe(1);
  });
});

describe('daysSummary', () => {
  const week = (s: string) => s.split('').map((c) => c === '1');

  it('names the common patterns', () => {
    expect(daysSummary(week('1111111'))).toBe('毎日');
    expect(daysSummary(week('1111100'))).toBe('平日');
    expect(daysSummary(week('0000000'))).toBe('おやすみ中');
  });

  it('lists the days otherwise', () => {
    expect(daysSummary(week('1010100'))).toBe('月水金');
  });
});
