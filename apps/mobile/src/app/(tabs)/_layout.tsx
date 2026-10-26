import { Tabs } from 'expo-router';
import { ChartBar, Repeat, Sun } from 'phosphor-react-native';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.muted,
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
        name='review'
        options={{
          title: 'ふりかえり',
          tabBarIcon: ({ color, focused }) => (
            <ChartBar
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
