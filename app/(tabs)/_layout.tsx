import { Tabs } from 'expo-router';
import { CalendarBlank, GearSix, Repeat, Sun } from 'phosphor-react-native';
import { useAppTheme } from '@/theme/colors';

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.acc,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: {
          backgroundColor: colors.surface2,
          borderTopWidth: 1,
          borderTopColor: colors.line,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'NotoSansJP_400Regular' },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: '今日',
          tabBarIcon: ({ color, focused }) => <Sun size={22} weight={focused ? 'fill' : 'regular'} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: 'ルーティン',
          tabBarIcon: ({ color, focused }) => <Repeat size={22} weight={focused ? 'fill' : 'regular'} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'カレンダー',
          tabBarIcon: ({ color, focused }) => (
            <CalendarBlank size={22} weight={focused ? 'fill' : 'regular'} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) => <GearSix size={22} weight={focused ? 'fill' : 'regular'} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
