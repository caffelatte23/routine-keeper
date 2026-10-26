import {
  NotoSansJP_400Regular,
  NotoSansJP_500Medium,
  NotoSansJP_700Bold,
} from '@expo-google-fonts/noto-sans-jp';
import { Outfit_400Regular, Outfit_500Medium } from '@expo-google-fonts/outfit';
import { useFonts } from 'expo-font';

// UI copy is Noto Sans JP. `figure` is Outfit — a geometric sans used only for
// Latin numerals (times, counts, the play-mode timer).
export const fonts = {
  jp: 'NotoSansJP_400Regular',
  jpMedium: 'NotoSansJP_500Medium',
  jpBold: 'NotoSansJP_700Bold',
  figure: 'Outfit_400Regular',
  figureBold: 'Outfit_500Medium',
} as const;

export function useAppFonts() {
  return useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_500Medium,
    NotoSansJP_700Bold,
    Outfit_400Regular,
    Outfit_500Medium,
  });
}
