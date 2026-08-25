import { Pressable, ScrollView, Text, View } from 'react-native';
import { HandHeart } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';
import { useRoutineStore } from '@/state/routine-store';
import { ToggleRow } from '@/components/toggle-row';

const TOGGLE_META = [
  { key: 'morning', name: '朝の合図', detail: '6:40に1回、ルーティンが始まる前に' },
  { key: 'evening', name: '夜の切り替え', detail: '20:45にそっと通知します' },
  { key: 'risk', name: '連続記録の警告', detail: '5日以上の記録が途切れそうなときだけ' },
  { key: 'recap', name: '週のふりかえり', detail: '日曜の夕方に短く' },
] as const;

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { settings, toggleSetting } = useRoutineStore();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
    >
      <Text style={{ fontSize: 12, letterSpacing: 0.6, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>
        設定
      </Text>
      <Text style={{ fontSize: 28, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 6, marginBottom: 26 }}>
        リマインダー
      </Text>

      <View style={{ gap: 8, marginBottom: 28 }}>
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
      </View>

      <Text style={{ fontSize: 13, color: colors.t3, fontFamily: 'NotoSansJP_400Regular', marginBottom: 10 }}>
        おやすみ時間
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 26 }}>
        <View style={{ flex: 1, padding: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.surface, boxShadow: `0 0 0 1px ${colors.line}` }}>
          <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>開始</Text>
          <Text style={{ fontSize: 20, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 2 }}>
            {settings.quietStart}
          </Text>
        </View>
        <View style={{ flex: 1, padding: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.surface, boxShadow: `0 0 0 1px ${colors.line}` }}>
          <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'NotoSansJP_400Regular' }}>終了</Text>
          <Text style={{ fontSize: 20, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text, marginTop: 2 }}>
            {settings.quietEnd}
          </Text>
        </View>
      </View>

      <View style={{ padding: 18, borderRadius: 14, backgroundColor: colors.tileFrom, boxShadow: `0 0 0 1px ${colors.accBorder}` }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <HandHeart size={20} weight="fill" color={colors.acc} />
          <Text style={{ fontSize: 15, fontWeight: '500', fontFamily: 'NotoSansJP_500Medium', color: colors.text }}>
            やさしいモード
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: colors.t2, fontFamily: 'NotoSansJP_400Regular', lineHeight: 24, marginBottom: 14 }}>
          通知はルーティンごとに1回だけ、2回目は送りません。できなかった日は静かに記録し、連続記録には1日の猶予があります。
        </Text>
        <Pressable
          onPress={() => {
            toggleSetting('gentleMode');
          }}
          style={{ minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.acc, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, fontFamily: 'NotoSansJP_500Medium', color: colors.acc }}>
            やさしいモード：{settings.gentleMode ? 'オン' : 'オフ'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
