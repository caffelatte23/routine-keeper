import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  NotoSansJP_400Regular,
  NotoSansJP_500Medium,
} from '@expo-google-fonts/noto-sans-jp';

export const fontFamily = {
  regular: 'NotoSansJP_400Regular',
  medium: 'NotoSansJP_500Medium',
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
};

export function useAppFonts() {
  return useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    NotoSansJP_400Regular,
    NotoSansJP_500Medium,
  });
}
