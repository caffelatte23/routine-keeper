import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { Check, Flame } from 'phosphor-react-native';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useAppTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';

import type { Task } from '@/shared/stores/routine-store';

const SWIPE_THRESHOLD = 80;
const MAX_DRAG = 150;

function project(velocity: number, decelerationRate = 0.998) {
  'worklet';
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export function TaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
}) {
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
          x.set(
            Math.max(0, Math.min(MAX_DRAG, context.get() + e.translationX)),
          );
        })
        .onEnd((e) => {
          const projected = x.get() + project(e.velocityX);
          if (projected > SWIPE_THRESHOLD) {
            x.set(
              withSpring(0, {
                duration: 250,
                dampingRatio: 1,
                velocity: e.velocityX,
              }),
            );
            scheduleOnRN(commit);
          } else {
            x.set(
              withSpring(0, {
                duration: 300,
                dampingRatio: 0.8,
                velocity: e.velocityX,
              }),
            );
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
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            inset: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 6,
            backgroundColor: colors.accTint,
          },
          trackStyle,
        ]}
      >
        <Check size={18} weight='bold' color={colors.accStrong} />
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
              paddingVertical: 15,
              paddingHorizontal: 2,
              minHeight: 62,
              backgroundColor: colors.bg,
            },
            rowStyle,
          ]}
        >
          <Pressable
            onPress={() => {
              onToggle(task.id, !task.done);
            }}
            accessibilityRole='checkbox'
            accessibilityState={{ checked: task.done }}
            accessibilityLabel={task.name}
            hitSlop={12}
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              borderWidth: task.done ? 2 : 1.5,
              borderColor: task.done ? colors.acc : colors.dim,
              backgroundColor: task.done ? colors.accTint : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {task.done ? (
              <Check size={13} weight='bold' color={colors.acc} />
            ) : null}
          </Pressable>

          <Link
            href={{ pathname: '/task/[id]', params: { id: String(task.id) } }}
            asChild
          >
            <Pressable style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fonts.jpMedium,
                  fontSize: 15.5,
                  color: task.done ? colors.faint : colors.text,
                  textDecorationLine: task.done ? 'line-through' : 'none',
                }}
              >
                {task.name}
              </Text>
              {task.streak >= 2 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 3,
                  }}
                >
                  <Flame size={12} weight='fill' color={colors.faint} />
                  <Text
                    style={{
                      fontFamily: fonts.figure,
                      fontSize: 12,
                      color: colors.faint,
                    }}
                  >
                    {task.streak}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          </Link>

          <Text
            style={{ fontFamily: fonts.jp, fontSize: 13, color: colors.t3 }}
          >
            {task.time}
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
