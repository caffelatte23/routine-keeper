import { router, useLocalSearchParams } from 'expo-router';
import { CaretRight, Trash, X } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { HeatmapGrid } from '@/shared/components/heatmap-grid';
import { StatTile } from '@/shared/components/stat-tile';
import { useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const INFO_ROWS = [
  { label: '繰り返し', value: '毎日' },
  { label: '通知', value: '20:45' },
  { label: '目安の時間', value: '25分' },
];

export default function TaskDetailScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stepDetail } = useRoutineStore();
  const detail = stepDetail(id);

  if (!detail) {
    return null;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 44,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
          hitSlop={12}
        >
          <X size={22} color={colors.t3} />
        </Pressable>
        <Pressable hitSlop={12}>
          <Trash size={19} color={colors.faint} />
        </Pressable>
      </View>

      <Text
        style={{ fontFamily: fonts.jp, fontSize: 12.5, color: colors.muted }}
      >
        {detail.group}
        {'   '}
        {detail.time}
      </Text>
      <Text
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 27,
          color: colors.text,
          marginTop: 6,
          marginBottom: 26,
        }}
      >
        {detail.name}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 30,
        }}
      >
        <StatTile value={String(detail.streak)} label='日つづけて' accent />
        <View
          style={{
            width: 1,
            alignSelf: 'stretch',
            backgroundColor: colors.line,
            marginHorizontal: 14,
          }}
        />
        <StatTile value='86%' label='過去30日' />
        <View
          style={{
            width: 1,
            alignSelf: 'stretch',
            backgroundColor: colors.line,
            marginHorizontal: 14,
          }}
        />
        <StatTile value='31' label='最長記録' />
      </View>

      <Text
        style={{
          fontFamily: fonts.jp,
          fontSize: 13,
          color: colors.t3,
          marginBottom: 14,
        }}
      >
        過去4週間
      </Text>
      <HeatmapGrid pattern={detail.heat} />

      <View style={{ marginTop: 30, marginBottom: 26 }}>
        {INFO_ROWS.map((row) => (
          <View
            key={row.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontFamily: fonts.jp,
                fontSize: 15,
                color: colors.text,
              }}
            >
              {row.label}
            </Text>
            <Text
              style={{
                fontFamily: fonts.jp,
                fontSize: 14,
                color: colors.t3,
                marginRight: 8,
              }}
            >
              {row.value}
            </Text>
            <CaretRight size={15} color={colors.dim} />
          </View>
        ))}
      </View>

      <View
        style={{
          padding: 18,
          borderRadius: 16,
          backgroundColor: colors.surface,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 12,
            color: colors.muted,
            marginBottom: 8,
          }}
        >
          自分へのメモ
        </Text>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 14,
            lineHeight: 24,
            color: colors.t2,
          }}
        >
          窓際の椅子に座って、スマホはキッチンに置く。この組み合わせにしてから続くようになりました。
        </Text>
      </View>
    </ScrollView>
  );
}
