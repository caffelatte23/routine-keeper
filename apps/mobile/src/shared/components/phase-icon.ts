import {
  Briefcase,
  MoonStars,
  SunHorizon,
  type Icon,
} from 'phosphor-react-native';

import type { GroupName } from '@routine-keeper/core';

export const PHASE_ICON: Record<GroupName, Icon> = {
  朝: SunHorizon,
  日中: Briefcase,
  夜: MoonStars,
};
