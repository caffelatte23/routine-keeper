import { Tabs } from 'expo-router';
import { CalendarBlank, GearSix, Repeat, Sun } from 'phosphor-react-native';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.acc,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopWidth: 1,
          borderTopColor: colors.line,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: fonts.jp },
      }}
    >
      <Tabs.Screen
        name='today'
        options={{
          title: '今日',
          tabBarIcon: ({ color, focused }) => (
            <Sun
              size={22}
              weight={focused ? 'fill' : 'regular'}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='routines'
        options={{
          title: 'ルーティン',
          tabBarIcon: ({ color, focused }) => (
            <Repeat
              size={22}
              weight={focused ? 'fill' : 'regular'}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='calendar'
        options={{
          title: 'カレンダー',
          tabBarIcon: ({ color, focused }) => (
            <CalendarBlank
              size={22}
              weight={focused ? 'fill' : 'regular'}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) => (
            <GearSix
              size={22}
              weight={focused ? 'fill' : 'regular'}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}
