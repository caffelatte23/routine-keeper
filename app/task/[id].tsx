import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BellSimple, CaretRight, Repeat, Timer, Trash, X } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';
import { useRoutineStore } from '@/state/routine-store';
import { StatTile } from '@/components/stat-tile';
import { HeatmapGrid } from '@/components/heatmap-grid';

export default function TaskDetailScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, heatPattern } = useRoutineStore();
  const task = tasks.find((t) => String(t.id) === id) ?? tasks[0];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          hitSlop={10}
        >
          <X size={22} color={colors.t3} />
        </Pressable>
        <Pressable hitSlop={10}>
          <Trash size={20} color={colors.faint} />
        </Pressable>
      </View>

      <Text style={{ fontSize: 12, letterSpacing: 0.6, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>
        {task.group} · {task.time}
      </Text>
      <Text style={{ fontSize: 28, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 6, marginBottom: 24 }}>
        {task.name}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
        <StatTile value={String(task.streak)} label="日連続" accent />
        <StatTile value="86%" label="過去30日" />
        <StatTile value="31" label="最長記録" />
      </View>

      <Text style={{ fontSize: 13, color: colors.t3, fontFamily: 'NotoSansJP_400Regular', marginBottom: 12 }}>
        過去4週間
      </Text>
      <View style={{ marginBottom: 28 }}>
        <HeatmapGrid pattern={heatPattern} />
      </View>

      <View style={{ gap: 8, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, minHeight: 52, borderRadius: 14, backgroundColor: colors.surface, boxShadow: `0 0 0 1px ${colors.line}` }}>
          <Repeat size={20} color={colors.acc} />
          <Text style={{ flex: 1, fontSize: 15, color: colors.text, fontFamily: 'NotoSansJP_400Regular' }}>繰り返し</Text>
          <Text style={{ fontSize: 14, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>毎日</Text>
          <CaretRight size={16} color={colors.dim} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, minHeight: 52, borderRadius: 14, backgroundColor: colors.surface, boxShadow: `0 0 0 1px ${colors.line}` }}>
          <BellSimple size={20} color={colors.acc} />
          <Text style={{ flex: 1, fontSize: 15, color: colors.text, fontFamily: 'NotoSansJP_400Regular' }}>通知</Text>
          <Text style={{ fontSize: 14, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>20:45</Text>
          <CaretRight size={16} color={colors.dim} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, minHeight: 52, borderRadius: 14, backgroundColor: colors.surface, boxShadow: `0 0 0 1px ${colors.line}` }}>
          <Timer size={20} color={colors.acc} />
          <Text style={{ flex: 1, fontSize: 15, color: colors.text, fontFamily: 'NotoSansJP_400Regular' }}>目安の時間</Text>
          <Text style={{ fontSize: 14, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>25分</Text>
          <CaretRight size={16} color={colors.dim} />
        </View>
      </View>

      <View style={{ padding: 16, borderRadius: 14, backgroundColor: colors.surface2, boxShadow: `0 0 0 1px ${colors.line}` }}>
        <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'NotoSansJP_400Regular', marginBottom: 6 }}>
          自分へのメモ
        </Text>
        <Text style={{ fontSize: 14, color: colors.t2, fontFamily: 'NotoSansJP_400Regular', lineHeight: 24 }}>
          窓際の椅子に座って、スマホはキッチンに置く。この組み合わせにしてから続くようになりました。
        </Text>
      </View>
    </ScrollView>
  );
}
