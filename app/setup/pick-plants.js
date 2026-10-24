import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Logo from '../../components/Logo';
import ProgressHeader from '../../components/ProgressHeader';
import Bloom from '../../components/Bloom';
import Outlined from '../../components/Outlined';
import PlantCard from '../../components/PlantCard';
import { plants } from '../../data/mockData';
import { matchPlants } from '../../data/matchPlants';
import { useAppState } from '../../state/AppState';

export default function PickPlantsScreen() {
  return (
    <Screen>
      <PickPlantsContent />
    </Screen>
  );
}

function PickPlantsContent() {
  const { px, box } = useStage();
  const { zone, sun, soil, commitment, gardenIds, togglePlant } = useAppState();
  const [filter, setFilter] = useState('all');
  const listTop = 258; // the plant list starts under the filter chips
  const barTop = 534; // the cream bar with the buttons covers the bottom of the list

  const matches = matchPlants(plants, { zone, sun, soil, commitment });
  const filters = [
    { id: 'all', label: 'All Matches', list: matches, frame: [29, 225, 93, 23] },
    { id: 'edibles', label: 'Edibles', list: matches.filter((plant) => plant.edible), frame: [133, 225, 93, 23] },
    { id: 'pollinators', label: 'Pollinators', list: matches.filter((plant) => plant.pollinator), frame: [235, 225, 95, 23] },
  ];
  const shown = filters.find((option) => option.id === filter).list;

  return (
    <>
      <Logo x={117} y={18} />
      <ProgressHeader step={3} y={1} />

      <Outlined frame={[29, 91, 302, 109]} radius={13} border={1.5} shadow={2}
        overlay={
          <>
            <Bloom frame={[12.3, 26.6, 53.8, 56.2]} shadow={[10, 76, 58, 12]} />
            <Text style={[styles.intro, box(80, 21, 201), { fontSize: px(11) }]}>
              {`Based on a selection of plants that can thrive in Zone ${zone}, here are the one’s that are best fit for you!`}
            </Text>
            <Text style={[styles.subtitle, box(80, 66, 201), { fontSize: px(10) }]}>
              {'Select the plants you’d like to add to start off your garden!'}
            </Text>
          </>
        }
      />

      {filters.map((option) => (
        <Chip
          key={option.id}
          variant="filter"
          label={`${option.label} (${option.list.length})`}
          frame={option.frame}
          selected={filter === option.id}
          onPress={() => setFilter(option.id)}
        />
      ))}

      <ScrollView
        style={box(0, listTop, 360, barTop - listTop)}
        contentContainerStyle={{ height: px(12 + shown.length * 122 + 20) }}
        showsVerticalScrollIndicator={false}
      >
        {shown.map((plant, index) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            top={12 + index * 122}
            selected={gardenIds.includes(plant.id)}
            onPress={() => togglePlant(plant.id)}
          />
        ))}
        {shown.length === 0 && (
          <Text style={[styles.empty, box(33, 40, 294), { fontSize: px(14) }]}>
            None of your matches fit this filter.
          </Text>
        )}
      </ScrollView>

      <View style={[box(0, barTop, 360, 106), styles.bar]} />
      <Button variant="back" frame={[25, 552, 70.7, 54]} onPress={() => router.back()} />
      <Button label="continue" frame={[110, 552, 225.3, 54]} onPress={() => router.push('/setup/ready')} />
    </>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  empty: {
    fontFamily: fonts.body,
    color: colors.subtitleGrey,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.subtitleGrey,
  },
  bar: {
    backgroundColor: colors.background,
  },
});
