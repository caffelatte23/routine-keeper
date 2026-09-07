import {
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  NotoSansJP_400Regular,
  NotoSansJP_500Medium,
} from '@expo-google-fonts/noto-sans-jp';
import { useFonts } from 'expo-font';

// Japanese text is set in Noto Sans JP. The numbers that matter — the day's
// count, streaks, records — are set in Fraunces, like figures written by hand
// into a journal. Times and small labels stay in Noto.
export const fonts = {
  jp: 'NotoSansJP_400Regular',
  jpMedium: 'NotoSansJP_500Medium',
  figure: 'Fraunces_500Medium',
  figureBold: 'Fraunces_600SemiBold',
} as const;

export function useAppFonts() {
  return useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_500Medium,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
  });
}
