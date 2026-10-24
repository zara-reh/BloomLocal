import { useState } from 'react';
import Screen from '../../components/Screen';
import ScheduleHeader from '../../components/ScheduleHeader';
import TasksTab, { tasksTabHeight } from '../../components/TasksTab';
import BloomTab, { bloomTabHeight, visibleBloomPlants } from '../../components/BloomTab';
import { useAppState } from '../../state/AppState';
import { useCare } from '../../state/useCare';

export default function ScheduleScreen() {
  const { gardenIds } = useAppState();
  const { tasks, done } = useCare();
  const [tab, setTab] = useState('tasks');
  const [showDone, setShowDone] = useState(false);
  const [bloomFilter, setBloomFilter] = useState('all');
  const [bloomMonth, setBloomMonth] = useState(2);

  const today = new Date();
  const tasksToday = tasks.filter((task) => task.dueInDays === 0).length;
  const shown = showDone ? done : tasks;
  const height =
    tab === 'tasks'
      ? tasksTabHeight(shown.length)
      : bloomTabHeight(visibleBloomPlants(gardenIds, bloomFilter, today, bloomMonth).length);

  return (
    <Screen tab scrollHeight={height}>
      <ScheduleHeader tab={tab} onTabChange={setTab} tasksToday={tasksToday} today={today} tasks={tasks} />
      {tab === 'tasks' ? (
        <TasksTab shown={shown} showDone={showDone} gardenEmpty={gardenIds.length === 0} onToggleDone={() => setShowDone((value) => !value)} />
      ) : (
        <BloomTab
          filter={bloomFilter}
          onFilterChange={setBloomFilter}
          today={today}
          monthPosition={bloomMonth}
          onMonthChange={setBloomMonth}
        />
      )}
    </Screen>
  );
}
