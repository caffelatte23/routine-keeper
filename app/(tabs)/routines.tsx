import { Pressable, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Briefcase, CaretRight, MoonStars, SunHorizon } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';
import { routines, type GroupName } from '@/state/routine-store';

const ICONS: Record<GroupName, typeof SunHorizon> = {
  朝: SunHorizon,
  日中: Briefcase,
  夜: MoonStars,
};

const GROUP_ORDER: GroupName[] = ['朝', '日中', '夜'];

export default function RoutinesScreen() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 8 }}
    >
      <Text style={{ fontSize: 12, letterSpacing: 0.6, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>
        ルーティン
      </Text>
      <Text style={{ fontSize: 28, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginBottom: 12 }}>
        すべてのルーティン
      </Text>

      {GROUP_ORDER.map((group) => {
        const routine = routines[group];
        const Icon = ICONS[group];
        const stepCount = routine.steps.length;
        return (
          <Link key={group} href={{ pathname: '/routine/[id]', params: { id: group } }} asChild>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 18,
                borderRadius: 14,
                backgroundColor: colors.surface,
                boxShadow: `0 0 0 1px ${colors.line}`,
              }}
            >
              <Icon size={24} weight="fill" color={colors.acc} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text }}>
                  {group}
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, fontFamily: 'NotoSansJP_400Regular', marginTop: 2 }}>
                  {routine.start}開始 · {stepCount}ステップ
                </Text>
              </View>
              <CaretRight size={16} color={colors.dim} />
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}
