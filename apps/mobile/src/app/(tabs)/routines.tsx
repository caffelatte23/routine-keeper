import { GROUP_ORDER } from '@routine-keeper/core';
import { Link } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { daysSummary, parseMins } from '@/lib/day';
import { PHASE_ICON } from '@/shared/components/phase-icon';
import { useRoutines } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export default function RoutinesScreen() {
  const { colors } = useAppTheme();
  const routines = useRoutines();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentInsetAdjustmentBehavior='never'
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 32,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.jpBold,
            fontSize: 26,
            lineHeight: 32,
            color: colors.text,
            marginBottom: 12,
          }}
        >
          ルーティン
        </Text>

        {GROUP_ORDER.map((group) => {
          const routine = routines[group];
          if (!routine) {
            return null;
          }
          const Icon = PHASE_ICON[group];
          const pc = colors.phase[group];
          const mins = routine.steps.reduce((n, s) => n + parseMins(s.mins), 0);
          return (
            <Link
              key={group}
              href={{ pathname: '/routine/[id]', params: { id: group } }}
              asChild
            >
              <Pressable
                accessibilityRole='button'
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  minHeight: 76,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.line,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: pc.tint,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} color={pc.ink} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: fonts.jpMedium,
                      fontSize: 16,
                      lineHeight: 22,
                      color: colors.text,
                    }}
                  >
                    {group}のルーティン
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.jp,
                      fontSize: 12.5,
                      lineHeight: 18,
                      color: colors.muted,
                    }}
                  >
                    {routine.window}　{daysSummary(routine.days)}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.jp,
                      fontSize: 12.5,
                      lineHeight: 18,
                      color: colors.muted,
                    }}
                  >
                    {routine.steps.length}ステップ　約{mins}分
                  </Text>
                </View>
                <CaretRight size={16} color={colors.muted} />
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </View>
  );
}
