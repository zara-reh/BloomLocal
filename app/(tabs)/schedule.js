import { useState } from 'react';
import Screen from '../../components/Screen';
import ScheduleHeader from '../../components/ScheduleHeader';
import TasksTab, { tasksTabHeight, visibleTasks } from '../../components/TasksTab';
import BloomTab, { bloomTabHeight, visibleBloomPlants } from '../../components/BloomTab';
import { useAppState } from '../../state/AppState';
import { tasks } from '../../data/mockData';

export default function ScheduleScreen() {
  const { doneTaskIds, gardenIds } = useAppState();
  const [tab, setTab] = useState('tasks');
  const [showDone, setShowDone] = useState(false);
  const [bloomFilter, setBloomFilter] = useState('all');
  const [bloomMonth, setBloomMonth] = useState(2);

  const today = new Date();
  const tasksToday = tasks.filter((task) => task.dueInDays === 0 && !doneTaskIds.includes(task.id)).length;
  const height =
    tab === 'tasks'
      ? tasksTabHeight(visibleTasks(doneTaskIds, showDone).length)
      : bloomTabHeight(visibleBloomPlants(gardenIds, bloomFilter, today, bloomMonth).length);

  return (
    <Screen tab scrollHeight={height}>
      <ScheduleHeader tab={tab} onTabChange={setTab} tasksToday={tasksToday} today={today} doneTaskIds={doneTaskIds} />
      {tab === 'tasks' ? (
        <TasksTab showDone={showDone} onToggleDone={() => setShowDone((value) => !value)} />
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
