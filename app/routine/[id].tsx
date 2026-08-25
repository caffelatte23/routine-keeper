import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';
import { routines, type GroupName } from '@/state/routine-store';
import { DayChips } from '@/components/day-chip';
import { StepRow } from '@/components/step-row';

export default function RoutineEditorScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = routines[id as GroupName] ?? routines['朝'];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <Pressable onPress={() => {
            router.back();
          }} hitSlop={10}>
          <ArrowLeft size={22} color={colors.t3} />
        </Pressable>
        <Pressable onPress={() => {
            router.back();
          }} hitSlop={10}>
          <Text style={{ fontSize: 14, color: colors.acc, fontFamily: 'NotoSansJP_400Regular' }}>保存</Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 12, letterSpacing: 0.6, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>
        ルーティン
      </Text>
      <Text style={{ fontSize: 28, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 6, marginBottom: 22 }}>
        {routine.group}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 22 }}>
        <View style={{ flex: 1, padding: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.surface, boxShadow: `0 0 0 1px ${colors.line}` }}>
          <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>開始</Text>
          <Text style={{ fontSize: 20, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 2 }}>
            {routine.start}
          </Text>
        </View>
        <View style={{ flex: 1, padding: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.surface, boxShadow: `0 0 0 1px ${colors.line}` }}>
          <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>所要</Text>
          <Text style={{ fontSize: 20, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 2 }}>
            {routine.duration}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 13, color: colors.t3, fontFamily: 'NotoSansJP_400Regular', marginBottom: 10 }}>
        繰り返す曜日
      </Text>
      <View style={{ marginBottom: 28 }}>
        <DayChips days={routine.days} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ fontSize: 13, color: colors.t3, fontFamily: 'NotoSansJP_400Regular' }}>ステップ</Text>
        <Text style={{ fontSize: 12, color: colors.faint, fontFamily: 'NotoSansJP_400Regular' }}>長押しで並べ替え</Text>
      </View>
      <View style={{ gap: 8, marginBottom: 18 }}>
        {routine.steps.map((step) => (
          <StepRow key={step.id} step={step} />
        ))}
      </View>

      <Pressable
        style={{
          minHeight: 52,
          borderRadius: 14,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: colors.dim,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 15, color: colors.t3, fontFamily: 'NotoSansJP_400Regular' }}>＋ ステップを追加</Text>
      </Pressable>
      <Text style={{ fontSize: 13, color: colors.faint, fontFamily: 'NotoSansJP_400Regular', marginTop: 16, lineHeight: 22 }}>
        4ステップで{routine.group}は十分です。これより長いと、木曜日には続かなくなりがちです。
      </Text>
    </ScrollView>
  );
}
