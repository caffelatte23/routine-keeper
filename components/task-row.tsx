import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import * as Haptics from 'expo-haptics';
import { Check, DotsThreeVertical } from 'phosphor-react-native';
import { Link } from 'expo-router';
import { useAppTheme } from '@/theme/colors';
import type { Task } from '@/state/routine-store';

const SWIPE_THRESHOLD = 80;
const MAX_DRAG = 150;

function project(velocity: number, decelerationRate = 0.998) {
  'worklet';
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number, done: boolean) => void }) {
  const { colors } = useAppTheme();
  const x = useSharedValue(0);
  const context = useSharedValue(0);

  const commit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onToggle(task.id, true);
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onStart(() => {
          context.set(x.get());
        })
        .onUpdate((e) => {
          x.set(Math.max(0, Math.min(MAX_DRAG, context.get() + e.translationX)));
        })
        .onEnd((e) => {
          const projected = x.get() + project(e.velocityX);
          if (projected > SWIPE_THRESHOLD) {
            x.set(withSpring(0, { duration: 250, dampingRatio: 1, velocity: e.velocityX }));
            scheduleOnRN(commit);
          } else {
            x.set(withSpring(0, { duration: 300, dampingRatio: 0.8, velocity: e.velocityX }));
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [task.id],
  );

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() }],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, x.get() / SWIPE_THRESHOLD),
  }));

  return (
    <View style={{ borderRadius: 14, overflow: 'hidden', backgroundColor: colors.accTint }}>
      <Animated.View
        style={[
          { position: 'absolute', inset: 0, flexDirection: 'row', alignItems: 'center', paddingLeft: 18 },
          trackStyle,
        ]}
      >
        <Check size={20} weight="fill" color={colors.accStrong} />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              padding: 16,
              minHeight: 56,
              borderRadius: 14,
              backgroundColor: colors.surface,
              boxShadow: `0 0 0 1px ${colors.line}`,
            },
            rowStyle,
          ]}
        >
          <Pressable
            onPress={() => {
              onToggle(task.id, !task.done);
            }}
            hitSlop={10}
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: task.done ? colors.acc : colors.dim,
              backgroundColor: task.done ? colors.acc : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {task.done ? <Check size={14} weight="fill" color={colors.onAcc} /> : null}
          </Pressable>
          <Link href={{ pathname: '/task/[id]', params: { id: String(task.id) } }} asChild>
            <Pressable style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  fontFamily: 'NotoSansJP_500Medium',
                  color: task.done ? colors.faint : colors.text,
                  textDecorationLine: task.done ? 'line-through' : 'none',
                }}
              >
                {task.name}
              </Text>
              <Text style={{ fontSize: 12, color: colors.faint, fontFamily: 'NotoSansJP_400Regular', marginTop: 2 }}>
                {task.time} · {task.streak}日連続
              </Text>
            </Pressable>
          </Link>
          <DotsThreeVertical size={18} color={colors.dim} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
