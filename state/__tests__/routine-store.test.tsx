import { act, renderHook } from '@testing-library/react-native';
import { RoutineDataProvider, useRoutineStore } from '@/state/routine-store';

function setup() {
  return renderHook(() => useRoutineStore(), {
    wrapper: RoutineDataProvider,
  });
}

describe('useRoutineStore', () => {
  it('throws when used outside RoutineDataProvider', async () => {
    await expect(renderHook(() => useRoutineStore())).rejects.toThrow(
      'useRoutineStore must be used within RoutineDataProvider',
    );
  });

  it('starts with the seeded tasks done count and no celebration', async () => {
    const { result } = await setup();

    expect(result.current.doneCount).toBe(4);
    expect(result.current.celebrating).toBe(false);
    expect(result.current.streakDays).toBe(12);
  });

  it('celebrates and bumps the streak only when every task becomes done', async () => {
    const { result } = await setup();
    const remaining = result.current.tasks.filter((t) => !t.done).map((t) => t.id);

    await act(() => {
      remaining.slice(0, -1).forEach((id) => {
        result.current.setTaskDone(id, true);
      });
    });
    expect(result.current.celebrating).toBe(false);
    expect(result.current.streakDays).toBe(12);

    await act(() => {
      result.current.setTaskDone(remaining[remaining.length - 1], true);
    });
    expect(result.current.doneCount).toBe(7);
    expect(result.current.celebrating).toBe(true);
    expect(result.current.streakDays).toBe(13);
  });

  it('toggleTask flips a task between done and not done', async () => {
    const { result } = await setup();
    const task = result.current.tasks.find((t) => t.id === 3)!;
    expect(task.done).toBe(false);

    await act(() => {
      result.current.toggleTask(3);
    });
    expect(result.current.tasks.find((t) => t.id === 3)!.done).toBe(true);

    await act(() => {
      result.current.toggleTask(3);
    });
    expect(result.current.tasks.find((t) => t.id === 3)!.done).toBe(false);
  });

  it('resetDay restores the seeded pattern and clears the celebration', async () => {
    const { result } = await setup();

    await act(() => {
      result.current.tasks.forEach((t) => {
        result.current.setTaskDone(t.id, true);
      });
    });
    expect(result.current.celebrating).toBe(true);

    await act(() => {
      result.current.resetDay();
    });
    expect(result.current.celebrating).toBe(false);
    expect(result.current.doneCount).toBe(4);
  });

  it('toggleSetting flips the given reminder setting', async () => {
    const { result } = await setup();
    expect(result.current.settings.recap).toBe(false);

    await act(() => {
      result.current.toggleSetting('recap');
    });
    expect(result.current.settings.recap).toBe(true);
  });
});
