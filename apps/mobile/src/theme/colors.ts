import { useColorScheme } from 'react-native';

import type { GroupName } from '@routine-keeper/core';

export type AppPalette = typeof darkPalette;

export interface PhaseColors {
  fill: string; // the routine's block on the day bar, its dot
  tint: string; // full-bleed background (Today hero, play mode)
  ink: string; // text/icons on `tint`
  track: string; // empty segments / ring track on `tint`
}

// "ながれ": a warm off-white ground with near-black ink. Persimmon (`acc`) only
// ever means "done". Each part of the day has its own hue, used to say *which*
// routine — never progress.
export const darkPalette = {
  canvas: '#100f0e',
  bg: '#161513',
  surface: '#201e1b',
  surface2: '#1b1a17',
  line: '#34312c',
  lineSoft: '#262420',
  text: '#eeeae2',
  t2: '#d6d1c7',
  t3: '#bab4a8',
  muted: '#a19b8e',
  faint: '#7c776e',
  dim: '#4d4943',
  acc: '#e9764a',
  accStrong: '#f6c4ae',
  accTint: '#3a2219',
  accBorder: '#6e3520',
  onAcc: '#161513',
  glow: 'rgba(233,118,74,0.30)',
  sage: '#8a857b',
  sageTint: '#23211e',
  heroFrom: '#3a2219',
  heroTo: '#161513',
  celebFrom: '#5a2e1c',
  celebTo: 'rgba(22,21,19,0.96)',
  tileFrom: '#3a2219',
  tileTo: '#201e1b',
  heatFull: '#e9764a',
  heatPart: '#5a2e1c',
  heatPartBorder: '#6e3520',
  phase: {
    朝: { fill: '#e7a84a', tint: '#33281a', ink: '#f3d29a', track: '#5a4521' },
    日中: {
      fill: '#7fa9c2',
      tint: '#1c2a33',
      ink: '#b8d5e6',
      track: '#2f4757',
    },
    夜: { fill: '#8c8cd0', tint: '#24243a', ink: '#c9c9f0', track: '#3c3c66' },
  } satisfies Record<GroupName, PhaseColors>,
};

export const lightPalette: AppPalette = {
  canvas: '#efebe4',
  bg: '#f6f3ee',
  surface: '#fbfaf7',
  surface2: '#ece7de',
  line: '#e4dfd6',
  lineSoft: '#ece7de',
  text: '#1c1b19',
  t2: '#3a3732',
  t3: '#514d46',
  muted: '#6b665e',
  faint: '#8a8478',
  dim: '#cfc9be',
  acc: '#c24e22',
  accStrong: '#7a2e12',
  accTint: '#f6d3c4',
  accBorder: '#ebb59f',
  onAcc: '#ffffff',
  glow: 'rgba(212,87,42,0.30)',
  sage: '#7f7a70',
  sageTint: '#ece7de',
  heroFrom: '#f6d3c4',
  heroTo: '#f6f3ee',
  celebFrom: '#f6d3c4',
  celebTo: 'rgba(246,243,238,0.96)',
  tileFrom: '#f6d3c4',
  tileTo: '#fbfaf7',
  heatFull: '#d4572a',
  heatPart: '#f6d3c4',
  heatPartBorder: '#ebb59f',
  phase: {
    朝: { fill: '#f2b85b', tint: '#fcebcb', ink: '#5b3f0e', track: '#edcf98' },
    日中: {
      fill: '#8fb8d0',
      tint: '#ddeaf1',
      ink: '#2f5b73',
      track: '#bcd6e4',
    },
    夜: { fill: '#4a4a80', tint: '#e1e1ef', ink: '#3b3b70', track: '#c3c3dd' },
  },
};

export function useAppTheme(): { colors: AppPalette; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  return { colors: isDark ? darkPalette : lightPalette, isDark };
}
