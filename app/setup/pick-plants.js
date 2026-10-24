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

export default function PickPlantsScreen() {
  return (
    <Screen>
      <PickPlantsContent />
    </Screen>
  );
}

function PickPlantsContent() {
  const { px, box } = useStage();
  const listTop = 258; // the plant list starts under the filter chips
  const barTop = 534; // the cream bar with the buttons covers the bottom of the list

  return (
    <>
      <Logo x={117} y={18} />
      <ProgressHeader step={3} y={1} />

      <Outlined frame={[29, 91, 302, 109]} radius={13} border={1.5} shadow={2}
        overlay={
          <>
            <Bloom frame={[12.3, 26.6, 53.8, 56.2]} shadow={[10, 76, 58, 12]} />
            <Text style={[styles.intro, box(80, 21, 201), { fontSize: px(11) }]}>
              {'Based on a selection of plants that can thrive in Zone 8b, here are the one’s that are best fit for you!'}
            </Text>
            <Text style={[styles.subtitle, box(80, 66, 201), { fontSize: px(10) }]}>
              {'Select the plants you’d like to add to start off your garden!'}
            </Text>
          </>
        }
      />

      <Chip variant="filter" selected label="All Matches (10)" frame={[29, 225, 93, 23]} />
      <Chip variant="filter" label="Edibles (5)" frame={[133, 225, 93, 23]} />
      <Chip variant="filter" label="Pollinators (5)" frame={[235, 225, 95, 23]} />

      <ScrollView
        style={box(0, listTop, 360, barTop - listTop)}
        contentContainerStyle={{ height: px(12 + plants.length * 122 + 20) }}
        showsVerticalScrollIndicator={false}
      >
        {plants.map((plant, index) => (
          <PlantCard key={plant.id} plant={plant} top={12 + index * 122} />
        ))}
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
  subtitle: {
    fontFamily: fonts.body,
    color: colors.subtitleGrey,
  },
  bar: {
    backgroundColor: colors.background,
  },
});
