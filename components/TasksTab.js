import { Image, Text } from 'react-native';
import { colors, fonts, scheduleColors } from './theme';
import { useStage } from './Screen';
import Label from './Label';
import Outlined from './Outlined';
import Pop from './Pop';
import { useAppState } from '../state/AppState';
import { tasks } from '../data/mockData';

const FIRST_TOP = 397.1;
const PITCH = 123.05;

const taskIcons = {
  drop: { source: require('../assets/images/schedule/drop.png'), size: [14.5, 18.4] },
  scissors: { source: require('../assets/images/schedule/scissors.png'), size: [12.5, 12.5] },
  shovel: { source: require('../assets/images/schedule/shovel.png'), size: [18.4, 17.3] },
};

function dueLabel(days) {
  if (days === 0) {
    return 'Do Today';
  }
  return days === 1 ? 'Do Tomorrow' : `Do in ${days} days`;
}

// Height of the Schedule screen when this tab shows count tasks.
export function tasksTabHeight(count) {
  return FIRST_TOP + Math.max(count, 1) * PITCH + 40;
}

export function visibleTasks(doneTaskIds, showDone) {
  return tasks.filter((task) => doneTaskIds.includes(task.id) === showDone);
}

export default function TasksTab({ showDone, onToggleDone }) {
  const { box } = useStage();
  const { doneTaskIds, setDoneTaskIds } = useAppState();
  const shown = visibleTasks(doneTaskIds, showDone);

  const toggleTask = (id) => {
    setDoneTaskIds((ids) => (ids.includes(id) ? ids.filter((doneId) => doneId !== id) : [...ids, id]));
  };

  return (
    <>
      <Label x={34.6} y={358.6} size={16.4}>{showDone ? 'Completed Tasks' : 'Weekly Tasks'}</Label>
      <Pop frame={[268, 356, 66, 24]} scaleTo={0.9} label={showDone ? 'Show tasks to do' : 'Show completed tasks'} onPress={onToggleDone}>
        <Label x={7.3} y={8.1} size={9} color={scheduleColors.completedLink}>{showDone ? 'To do >' : 'Completed >'}</Label>
      </Pop>

      {shown.length === 0 && (
        <Label x={180} y={FIRST_TOP + 30} size={12} align="center" width={280} color={colors.subtitleGrey}>
          {showDone ? 'No tasks are done yet.' : 'All tasks are done!'}
        </Label>
      )}

      {shown.map((task, index) => {
        const left = index === 0 ? 32.3 : 34.5;
        const top = FIRST_TOP + index * PITCH;
        const done = doneTaskIds.includes(task.id);
        const icon = taskIcons[task.icon];
        const tipTop = 65.35 - task.tip.length * 5.025;

        // Everything in a task card is placed relative to the card, so the whole card pops when tapped.
        return (
          <Pop
            key={task.id}
            frame={[left, top, 295.4, 101.4]}
            scaleTo={0.97}
            label={`${task.title}, mark as ${done ? 'not done' : 'done'}`}
            onPress={() => toggleTask(task.id)}
          >
            <Outlined frame={[0, 0, 295.4, 101.4]} radius={17} border={2} shadow={2} />

            <Outlined frame={[12.2, 9.8, 31, 30.5]} radius={6.5} border={2} shadow={2} fill={task.iconColor} />
            <Image
              source={icon.source}
              style={box(27.7 - icon.size[0] / 2, 25 - icon.size[1] / 2, icon.size[0], icon.size[1])}
            />
            <Label
              x={task.titleAt[0]}
              y={task.titleAt[1]}
              size={16.8}
              width={200}
              color={done ? colors.mutedText : colors.black}
              style={done && { textDecorationLine: 'line-through' }}
            >
              {task.title}
            </Label>

            <Outlined frame={[265.7, 6.8, 18.8, 18.8]} radius={9.4} border={2} shadow={2} fill={done ? colors.greenMid : colors.background}>
              {done && <CheckMark />}
            </Outlined>

            <Outlined frame={[11.4, 55.4, 66.1, 18.8]} radius={9.4} border={1.5} shadow={0} fill={task.dueInDays === 0 ? '#E9D2D3' : '#E6E7D2'} />
            <Label x={44.4} y={59.3} size={7.8} align="center" width={66}>{dueLabel(task.dueInDays)}</Label>

            <Outlined
              frame={[101.6, 45.2, 172.1, 39]}
              radius={12}
              border={0.9}
              shadow={0}
              fill={scheduleColors.tipBox}
              borderColor={scheduleColors.tipBorder}
            />
            {task.tipIcon && (
              <Image source={require('../assets/images/schedule/bulb.png')} style={box(112.4, 56.1, 16.6, 23.2)} />
            )}
            {task.tip.map((line, lineIndex) => (
              <Label
                key={line}
                x={task.tipCenter}
                y={tipTop + lineIndex * 10.05}
                size={8}
                align="center"
                width={170}
                color={scheduleColors.tipText}
              >
                {line}
              </Label>
            ))}
          </Pop>
        );
      })}
    </>
  );
}

function CheckMark() {
  const { px } = useStage();
  return <Text style={{ fontFamily: fonts.bodyBold, fontSize: px(11), color: colors.black }}>{'\u2713'}</Text>;
}
