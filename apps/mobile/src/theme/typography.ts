import {
  NotoSansJP_400Regular,
  NotoSansJP_500Medium,
} from '@expo-google-fonts/noto-sans-jp';
import { useFonts } from 'expo-font';

// One family: Noto Sans JP. `figure` is an alias used for numbers (streaks,
// counts, dates) so they can be given their own treatment later without
// touching call sites.
export const fonts = {
  jp: 'NotoSansJP_400Regular',
  jpMedium: 'NotoSansJP_500Medium',
  figure: 'NotoSansJP_500Medium',
  figureBold: 'NotoSansJP_500Medium',
} as const;

export function useAppFonts() {
  return useFonts({ NotoSansJP_400Regular, NotoSansJP_500Medium });
}
