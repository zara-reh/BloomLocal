import { useState } from 'react';
import { Image, TextInput, View } from 'react-native';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import DiscoverCard from '../../components/DiscoverCard';
import Label from '../../components/Label';
import Logo from '../../components/Logo';
import Outlined from '../../components/Outlined';
import Pop from '../../components/Pop';
import { useAppState } from '../../state/AppState';
import { plants, discoverOrder } from '../../data/mockData';

const CARD_TOPS = [170.4, 289.2, 408.1, 530, 652.3];
const CARD_PITCH = 122;
const sortOptions = ['All Plants', 'Pollinators', 'Edibles'];

function cardTop(index) {
  return index < CARD_TOPS.length ? CARD_TOPS[index] : CARD_TOPS[CARD_TOPS.length - 1] + (index - CARD_TOPS.length + 1) * CARD_PITCH;
}

// Plants that grow in the zone and match the search and sort choice.
function findPlants(zone, search, sort) {
  const featured = discoverOrder.map((id) => plants.find((plant) => plant.id === id));
  const ordered = [...featured, ...plants.filter((plant) => !discoverOrder.includes(plant.id))];
  const words = search.trim().toLowerCase();

  return ordered.filter(
    (plant) =>
      plant.zones.includes(zone) &&
      (words === '' || plant.name.toLowerCase().includes(words) || plant.scientificName.toLowerCase().includes(words)) &&
      (sort === 'All Plants' || (sort === 'Pollinators' ? plant.pollinator : plant.edible))
  );
}

export default function DiscoverScreen() {
  const { zone } = useAppState();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(sortOptions[0]);
  const shown = findPlants(zone, search, sort);

  return (
    <Screen tab keyboard scrollHeight={cardTop(Math.max(shown.length, 1)) + 50}>
      <DiscoverContent shown={shown} search={search} onSearch={setSearch} sort={sort} onSort={setSort} />
    </Screen>
  );
}

function DiscoverContent({ shown, search, onSearch, sort, onSort }) {
  const { px, box } = useStage();
  const { zone, gardenIds, togglePlant } = useAppState();

  const nextSort = () => onSort(sortOptions[(sortOptions.indexOf(sort) + 1) % sortOptions.length]);

  return (
    <>
      <Logo x={121} y={20} />
      <Image source={require('../../assets/images/home/bloom-head.png')} style={box(38, 53.3, 35, 37.1)} />

      <Outlined frame={[80.6, 57.7, 241.8, 29]} radius={14.5} border={2} shadow={2} />
      <View style={[box(82.6, 78.2, 237.8, 6.5), { borderBottomLeftRadius: px(12.5), borderBottomRightRadius: px(12.5), backgroundColor: 'rgba(0,0,0,0.06)' }]} />
      <TextInput
        value={search}
        onChangeText={onSearch}
        placeholder="Search to discover native plants to your garden"
        placeholderTextColor="#4D4D4D"
        returnKeyType="search"
        style={[box(107, 57.7, 203, 29), { fontFamily: fonts.body, fontSize: px(8), color: colors.black, outlineStyle: 'none' }]}
      />

      <Label x={35.1} y={102.6} size={26}>Discover Plants</Label>
      <Label x={37.1} y={134.3} size={12} width={220} color="#9D9483">{`Thriving locally in Zone ${zone}`}</Label>

      <Pop frame={[238.5, 108.3, 90.9, 20.7]} scaleTo={0.94} label={`Sort by, now ${sort}`} onPress={nextSort}>
        <Outlined frame={[0, 0, 90.9, 20.7]} radius={10.35} border={2} shadow={2} fill={colors.white} />
        <Label x={7.6} y={5.8} size={7.8} color="#929292" width={30}>Sort:</Label>
        <Label x={27.5} y={5.7} size={7.9} width={44}>{sort}</Label>
        <Image source={require('../../assets/images/discover/chevron.png')} style={box(70.5, 8.8, 7.4, 5)} />
      </Pop>

      {shown.length === 0 && (
        <Label x={180} y={cardTop(0) + 30} size={12} align="center" width={280} color={colors.subtitleGrey}>
          No plants match your search.
        </Label>
      )}
      {shown.map((plant, index) => (
        <DiscoverCard
          key={plant.id}
          plant={plant}
          top={cardTop(index)}
          added={gardenIds.includes(plant.id)}
          onToggle={() => togglePlant(plant.id)}
        />
      ))}
    </>
  );
}
