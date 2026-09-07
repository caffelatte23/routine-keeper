import { useColorScheme } from 'react-native';

export type AppPalette = typeof darkPalette;

export const darkPalette = {
  canvas: '#101220',
  bg: '#161826',
  surface: '#232532',
  surface2: '#1b1d2b',
  line: '#3f424d',
  lineSoft: '#292b31',
  text: '#e9e9ed',
  t2: '#cfd3e5',
  t3: '#b2b6ca',
  muted: '#9397ab',
  faint: '#75798c',
  dim: '#595d6c',
  acc: '#e0b64f',
  accStrong: '#f2dda6',
  accTint: '#2e2718',
  accBorder: '#7a621f',
  onAcc: '#161826',
  glow: 'rgba(224,182,79,0.32)',
  heroFrom: '#2e2718',
  heroTo: '#161826',
  celebFrom: '#55461c',
  celebTo: 'rgba(22,24,38,0.96)',
  tileFrom: '#2e2718',
  tileTo: '#232532',
  heatFull: '#e0b64f',
  heatPart: '#55461c',
  heatPartBorder: '#7a621f',
};

export const lightPalette: AppPalette = {
  canvas: '#e9eaf1',
  bg: '#f7f7fb',
  surface: '#ffffff',
  surface2: '#f0f1f6',
  line: '#dcdee7',
  lineSoft: '#e6e7ee',
  text: '#1d1f2b',
  t2: '#3a3d4d',
  t3: '#4d505f',
  muted: '#6a6d7d',
  faint: '#83869a',
  dim: '#a9acba',
  acc: '#a97d10',
  accStrong: '#6b4e07',
  accTint: '#fbf2da',
  accBorder: '#e2c887',
  onAcc: '#ffffff',
  glow: 'rgba(169,125,16,0.22)',
  heroFrom: '#fbf2da',
  heroTo: '#f7f7fb',
  celebFrom: '#f7e9c6',
  celebTo: 'rgba(247,247,251,0.96)',
  tileFrom: '#fbf2da',
  tileTo: '#ffffff',
  heatFull: '#c8941a',
  heatPart: '#f2e0b0',
  heatPartBorder: '#e2c887',
};

export function useAppTheme(): { colors: AppPalette; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme !== 'light';
  return { colors: isDark ? darkPalette : lightPalette, isDark };
}
