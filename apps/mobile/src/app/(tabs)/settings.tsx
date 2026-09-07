import { HandHeart } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ToggleRow } from '@/shared/components/toggle-row';
import { useRoutineStore } from '@/shared/stores/routine-store';
import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

const TOGGLE_META = [
  {
    key: 'morning',
    name: '朝の合図',
    detail: '6:40に1回、ルーティンが始まる前に',
  },
  { key: 'evening', name: '夜の切り替え', detail: '20:45にそっと通知します' },
  {
    key: 'risk',
    name: '連続記録の警告',
    detail: '5日以上の記録が途切れそうなときだけ',
  },
  { key: 'recap', name: '週のふりかえり', detail: '日曜の夕方に短く' },
] as const;

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { settings, toggleSetting } = useRoutineStore();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{
        paddingHorizontal: 22,
        paddingTop: 14,
        paddingBottom: 28,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 28,
          color: colors.text,
          marginBottom: 24,
        }}
      >
        設定
      </Text>

      <Text
        style={{
          fontFamily: fonts.jpMedium,
          fontSize: 14,
          color: colors.t2,
          marginBottom: 2,
        }}
      >
        リマインダー
      </Text>
      {TOGGLE_META.map((m) => (
        <ToggleRow
          key={m.key}
          name={m.name}
          detail={m.detail}
          on={settings[m.key]}
          onToggle={() => {
            toggleSetting(m.key);
          }}
        />
      ))}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 18,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}
      >
        <Text
          style={{ fontFamily: fonts.jp, fontSize: 15, color: colors.text }}
        >
          おやすみ時間
        </Text>
        <Text
          style={{ fontFamily: fonts.figure, fontSize: 16, color: colors.t2 }}
        >
          {settings.quietStart}
          <Text style={{ color: colors.faint }}>{'  –  '}</Text>
          {settings.quietEnd}
        </Text>
      </View>

      <View
        style={{
          marginTop: 26,
          padding: 20,
          borderRadius: 18,
          backgroundColor: colors.accTint,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <HandHeart size={19} weight='fill' color={colors.acc} />
          <Text
            style={{
              fontFamily: fonts.jpMedium,
              fontSize: 15,
              color: colors.text,
              flex: 1,
            }}
          >
            やさしいモード
          </Text>
          <Pressable
            onPress={() => {
              toggleSetting('gentleMode');
            }}
            hitSlop={10}
          >
            <Text
              style={{
                fontFamily: fonts.jpMedium,
                fontSize: 14,
                color: colors.acc,
              }}
            >
              {settings.gentleMode ? 'オン' : 'オフ'}
            </Text>
          </Pressable>
        </View>
        <Text
          style={{
            fontFamily: fonts.jp,
            fontSize: 13,
            lineHeight: 23,
            color: colors.t2,
          }}
        >
          通知はルーティンごとに1回だけ、2回目は送りません。できなかった日は静かに記録し、連続記録には1日の猶予があります。
        </Text>
      </View>
    </ScrollView>
  );
}
