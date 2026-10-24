import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { colors, fonts, scheduleColors } from './theme';
import { useStage } from './Screen';
import Label from './Label';
import Logo from './Logo';
import Outlined from './Outlined';
import Pop from './Pop';
import { daysBetween, monthTitle, seasonName, weekOf } from '../data/calendar';

const DAY_CENTERS = [56.5, 98.6, 138.8, 180.0, 221.0, 262.5, 302.4];
const DOT_COLORS = {
  gray: scheduleColors.dotGray,
  green: scheduleColors.dotGreen,
};

// Title, month calendar, and the Tasks / Bloom Tracker switch at the top of the Schedule screen.
// The small dot under a date: green when a task is due that day, gray when nothing is.
function dotsFor(day, today, tasks) {
  const offset = daysBetween(today, day);
  const due = tasks.some((task) => task.dueInDays === offset);
  return [due ? 'green' : 'gray'];
}

export default function ScheduleHeader({ tab, onTabChange, tasksToday, today, tasks }) {
  const { px, box } = useStage();
  const tasksTab = [35.6, 314.4, 142.6, 23.9];
  const bloomTab = [184.8, 314.4, 142.6, 23.9];

  // The green segment slides between the two tabs.
  const slide = useRef(new Animated.Value(tab === 'tasks' ? 0 : 1)).current;
  useEffect(() => {
    Animated.timing(slide, {
      toValue: tab === 'tasks' ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [tab]);

  return (
    <>
      <Logo x={121} y={20} />
      <Image source={require('../assets/images/home/bloom-head.png')} style={box(37.1, 53.7, 32.7, 34.1)} />
      <Label x={81} y={55.7} size={26}>Garden Schedule</Label>

      <Outlined frame={[25, 98.2, 310, 190.9]} radius={17} border={2} shadow={2} />
      <Image source={require('../assets/images/schedule/calendar.png')} style={box(49.7, 115.6, 13.5, 14.8)} />
      <Label x={72.1} y={111.1} size={18}>{monthTitle(today)}</Label>
      <Outlined frame={[233, 110, 72.9, 23.7]} radius={11.85} border={2} shadow={2} fill={colors.green} />
      <Label x={269.9} y={115.2} size={11} align="center" width={72} color={colors.ink}>{seasonName(today)}</Label>
      <View style={[box(43.2, 143.1, 274, 1), { backgroundColor: scheduleColors.divider }]} />

      {weekOf(today).map((day, index) => {
        const cx = DAY_CENTERS[index];
        const dots = dotsFor(day.day, today, tasks);
        return (
          <View key={index}>
            {day.today && (
              <Outlined frame={[cx - 20.9, 152.3, 40.6, 66.1]} radius={20.3} border={2} shadow={2} fill={scheduleColors.selectedDay} />
            )}
            <Label x={cx} y={158} size={15} align="center" width={44} color={colors.mutedText}>{day.letter}</Label>
            <Label x={cx} y={181.4} size={16} align="center" width={44} color={colors.mutedText}>{String(day.dayOfMonth)}</Label>
            {dots.map((dot, dotIndex) => (
              <View
                key={dot}
                style={[
                  box(cx - 1.95, 207.05, 3.9, 3.9),
                  { borderRadius: 2, backgroundColor: DOT_COLORS[dot] },
                ]}
              />
            ))}
          </View>
        );
      })}

      <Outlined frame={[48.4, 230.4, 263.1, 41.2]} radius={13} border={2} shadow={2} fill={colors.green}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../assets/images/schedule/bang.png')} style={{ width: px(5.4), height: px(15.3), marginRight: px(9) }} />
          <Text style={{ fontFamily: fonts.body, fontSize: px(13), color: colors.black }}>
            {`${tasksToday} ${tasksToday === 1 ? 'task' : 'tasks'} today`}
          </Text>
        </View>
      </Outlined>

      <Outlined frame={[25.3, 307.2, 309.4, 38.6]} radius={19.3} border={2} shadow={2} fill={colors.background} />
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [0, px(bloomTab[0] - tasksTab[0])] }) }],
        }}
      >
        <Outlined frame={tasksTab} radius={11.95} border={1.5} shadow={2} fill={colors.green} />
      </Animated.View>
      <Label x={106.9} y={320} size={9.7} align="center" width={130} color={tab === 'tasks' ? scheduleColors.toggleActive : scheduleColors.toggleInactive}>
        Tasks
      </Label>
      <Label x={260.1} y={320} size={10.7} align="center" width={130} color={tab === 'bloom' ? scheduleColors.toggleActive : scheduleColors.toggleInactive}>
        Bloom Tracker
      </Label>
      <Pop frame={tasksTab} scaleTo={0.95} label="Tasks" onPress={() => onTabChange('tasks')} />
      <Pop frame={bloomTab} scaleTo={0.95} label="Bloom Tracker" onPress={() => onTabChange('bloom')} />
    </>
  );
}
