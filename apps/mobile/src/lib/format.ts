import type { IsoDate } from '@routine-keeper/core';

const WEEKDAYS_JP = ['日', '月', '火', '水', '木', '金', '土'];

/** '2026-08-25' -> '2026年8月25日 火曜日' */
export function formatJpDate(date: IsoDate): string {
  const d = new Date(`${date}T00:00:00`);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${WEEKDAYS_JP[d.getDay()]}曜日`;
}
