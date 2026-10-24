import { Image, Text, View } from 'react-native';
import { colors, fonts, scheduleColors } from './theme';
import { useStage } from './Screen';
import Label from './Label';
import Outlined from './Outlined';
import Pop from './Pop';
import { useAppState } from '../state/AppState';
import { plants, bloomSeasons } from '../data/mockData';
import { bloomInMonth, bloomToday } from '../data/bloom';
import { monthsAround, MONTH_NAMES } from '../data/calendar';

const CARD_TOPS = [494, 603.6, 714.7];
const PITCH = 111.1;

// Top of the card at this position in the list.
function cardTop(index) {
  return index < CARD_TOPS.length ? CARD_TOPS[index] : CARD_TOPS[CARD_TOPS.length - 1] + (index - CARD_TOPS.length + 1) * PITCH;
}

// Where each month card goes. Cards grow toward the current month in the middle.
const monthCards = [
  { frame: [11.3, 372.2, 52.4, 55.2], nameSize: 12.1, nameTop: 383.2, nameX: 37.7, subSize: 8.1, subTop: 401, subX: 38 },
  { frame: [72.4, 372.2, 64.1, 55.2], nameSize: 13.1, nameTop: 382, nameX: 104.9, subSize: 9.1, subTop: 399.8, subX: 106.3 },
  { frame: [142.3, 367.9, 74.6, 62.5], nameSize: 14.1, nameTop: 382.2, nameX: 179.6, subSize: 10.1, subTop: 400, subX: 179.6 },
  { frame: [222.1, 372.2, 64.6, 55.2], nameSize: 13.2, nameTop: 382, nameX: 255.1, subSize: 9, subTop: 399.8, subX: 254.4 },
  { frame: [295.4, 372.2, 52.4, 55.2], nameSize: 12.4, nameTop: 382.8, nameX: 321.4, subSize: 8.1, subTop: 401, subX: 321.2 },
];

const filterButtons = [
  { id: 'all', label: 'All Plants', frame: [28.9, 449.5, 94.3, 24], centerX: 75.6 },
  { id: 'bloom', label: 'In Bloom', frame: [132.7, 449.5, 93.8, 24], centerX: 180.7 },
  { id: 'budding', label: 'Budding', frame: [233.3, 449.5, 96, 24], centerX: 281.5 },
];

const statusFills = {
  'Peak Bloom': scheduleColors.badgeBloom,
  'Ending Bloom': scheduleColors.badgeBloom,
  Budding: scheduleColors.badgeBudding,
  'Out of Season': colors.grey,
};

// Plants in bloom come first (fullest bloom first), then budding ones, then the rest.
const STATUS_RANK = { 'Peak Bloom': 0, 'Ending Bloom': 0, Budding: 1, 'Out of Season': 2 };

function compareEntries(a, b) {
  const rankDifference = STATUS_RANK[a.state.status] - STATUS_RANK[b.state.status];
  if (rankDifference !== 0) {
    return rankDifference;
  }
  return a.state.status === 'Peak Bloom' || a.state.status === 'Ending Bloom'
    ? b.state.progress - a.state.progress
    : a.state.daysUntil - b.state.daysUntil;
}

// The plants in the user's garden that bud or bloom in the given month, with where each one is.
// The current month lists every plant, including the ones that are out of season right now.
function monthEntries(gardenIds, month, today) {
  return gardenIds
    .map((id) => plants.find((plant) => plant.id === id))
    .filter((plant) => plant && bloomSeasons[plant.id])
    .map((plant) => {
      const season = bloomSeasons[plant.id];
      const inMonth = bloomInMonth(season, month, today);
      if (inMonth) {
        return { plant, season, ...inMonth };
      }
      return month.current ? { plant, season, state: bloomToday(season, today), blooming: false } : null;
    })
    .filter(Boolean)
    .sort(compareEntries);
}

function matchesFilter(entry, filter) {
  const { status } = entry.state;
  if (filter === 'bloom') {
    return status === 'Peak Bloom' || status === 'Ending Bloom';
  }
  return filter === 'all' || status === 'Budding';
}

// Height of the Schedule screen when this tab shows count plants.
export function bloomTabHeight(count) {
  return cardTop(Math.max(count, 1)) + 40;
}

// monthPosition is which of the five month cards is selected, from 0 to 4.
export function visibleBloomPlants(gardenIds, filter, today, monthPosition) {
  const month = monthsAround(today)[monthPosition];
  return monthEntries(gardenIds, month, today).filter((entry) => matchesFilter(entry, filter));
}

export default function BloomTab({ filter, onFilterChange, today, monthPosition, onMonthChange }) {
  const { px, box } = useStage();
  const { gardenIds } = useAppState();
  const months = monthsAround(today);
  const selectedMonth = months[monthPosition];
  const entries = monthEntries(gardenIds, selectedMonth, today);
  const shown = entries.filter((entry) => matchesFilter(entry, filter));

  let emptyMessage = ['Nothing in your garden fits', 'this filter in this month.'];
  if (!gardenIds.some((id) => bloomSeasons[id])) {
    emptyMessage = ['Add plants to your garden', 'to track when they bloom.'];
  } else if (entries.length === 0) {
    emptyMessage = ['Nothing in your garden blooms or buds', `in ${MONTH_NAMES[selectedMonth.index]}.`];
  }

  return (
    <>
      {months.map((month, index) => {
        const layout = monthCards[index];
        const selected = index === monthPosition;
        const count = monthEntries(gardenIds, month, today).filter((entry) => entry.blooming).length;
        const textColor = selected ? colors.black : scheduleColors.monthText;
        return (
          <Pop key={month.index} frame={layout.frame} scaleTo={0.93} label={`Show ${MONTH_NAMES[month.index]}`} onPress={() => onMonthChange(index)}>
            <Outlined
              frame={[0, 0, layout.frame[2], layout.frame[3]]}
              radius={9}
              border={2}
              shadow={2}
              fill={selected ? scheduleColors.monthNow : scheduleColors.monthFill}
              borderColor={selected ? colors.black : scheduleColors.monthBorder}
              shadowColor={selected ? colors.black : scheduleColors.monthBorder}
            />
            <Label x={layout.nameX - layout.frame[0]} y={layout.nameTop - layout.frame[1]} size={layout.nameSize} align="center" width={70} color={textColor}>
              {month.name}
            </Label>
            <Label x={layout.subX - layout.frame[0]} y={layout.subTop - layout.frame[1]} size={layout.subSize} align="center" width={70} color={textColor}>
              {`${count} in Bloom`}
            </Label>
          </Pop>
        );
      })}

      {/* The NOW tag sits on top of the current month's card, with its text centered inside. */}
      <View
        style={[
          box(157.6, 361.6, 46, 13.4),
          { borderRadius: px(6.7), backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <Text style={{ fontFamily: fonts.body, fontSize: px(9), letterSpacing: px(0.6), color: colors.white }}>NOW</Text>
      </View>

      {filterButtons.map((button) => {
        const selected = filter === button.id;
        const count = entries.filter((entry) => matchesFilter(entry, button.id)).length;
        return (
          <Pop key={button.id} frame={button.frame} scaleTo={0.93} label={button.label} onPress={() => onFilterChange(button.id)}>
            <Outlined
              frame={[0, 0, button.frame[2], button.frame[3]]}
              radius={12}
              border={1.5}
              shadow={0}
              fill={selected ? colors.black : colors.background}
            />
            <Label x={button.centerX - button.frame[0]} y={5.3} size={10} align="center" width={90} color={selected ? colors.white : colors.black}>
              {`${button.label} (${count})`}
            </Label>
          </Pop>
        );
      })}

      {shown.length === 0 && (
        <>
          <Label x={180} y={CARD_TOPS[0] + 30} size={12} align="center" width={280} color={colors.subtitleGrey}>
            {emptyMessage[0]}
          </Label>
          <Label x={180} y={CARD_TOPS[0] + 46} size={12} align="center" width={280} color={colors.subtitleGrey}>
            {emptyMessage[1]}
          </Label>
        </>
      )}

      {shown.map(({ plant, season, state }, index) => {
        const top = cardTop(index);
        return (
          <View key={plant.id}>
            <Outlined frame={[32.3, top, 295.4, 92.7]} radius={17} border={2} shadow={2} />

            <Outlined frame={[45.4, top + 8.3, 43.2, 42.5]} radius={6} border={2} shadow={2} fill={colors.background} />
            <Image source={plant.image} style={box(51.5, top + 14.1, 31, 31)} resizeMode="contain" />

            <Label x={99} y={top + 13.2} size={17}>{season.name || plant.name}</Label>
            <Label x={99.9} y={top + 32.9} size={7} color={scheduleColors.scientificName}>{plant.scientificName}</Label>

            <Outlined frame={[223.9, top + 14.8, 86, 18.9]} radius={9.45} border={2} shadow={2} fill={statusFills[state.status]} />
            <Label x={266.4} y={top + 18.2} size={10} align="center" width={84}>{state.status}</Label>

            <Outlined frame={[45.4, top + 61.5, 176.3, 8.7]} radius={4.35} border={1.5} shadow={0} fill={colors.background} />
            {state.progress > 0 && (
              <View
                style={[
                  box(48, top + 63.7, 171.1 * state.progress, 3.9),
                  { borderRadius: 2, backgroundColor: scheduleColors.progress },
                ]}
              />
            )}
            <Label x={state.status === 'Budding' ? 227 : 229.2} y={top + 61.1} width={95} size={7.8} color={scheduleColors.note}>
              {state.note}
            </Label>
          </View>
        );
      })}
    </>
  );
}
