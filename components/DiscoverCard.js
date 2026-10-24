import { Image, View } from 'react-native';
import { colors, scheduleColors } from './theme';
import { useStage } from './Screen';
import Label from './Label';
import Outlined from './Outlined';
import Pop from './Pop';

const CARD_LEFT = 32.3;

// One plant in the Discover list. top is the card's top edge in design units.
export default function DiscoverCard({ plant, top, added, onToggle }) {
  const { box } = useStage();

  return (
    <>
      <Outlined frame={[CARD_LEFT, top, 295.3, 101.3]} radius={17} border={2} shadow={2} />

      <Label x={47} y={top + 11} size={8} color={colors.labelGrey}>{plant.category}</Label>
      <Outlined frame={[45.4, top + 24.2, 52.9, 52.6]} radius={6.5} border={2} shadow={2} fill={colors.background} />
      <Image source={plant.image} style={box(51.8, top + 30.4, 40, 40)} resizeMode="contain" />
      <Label x={47.1} y={top + 82.6} size={7} color={scheduleColors.scientificName}>{plant.scientificName}</Label>

      <Label x={112.4} y={top + 13.3} size={16.8}>{plant.name}</Label>
      <Label x={111.9} y={top + 38.8} size={9}>{plant.growTime}</Label>

      <Pop frame={[232.9, top + 8.7, 86.1, 19]} scaleTo={0.93} label={`${added ? 'Remove' : 'Add'} ${plant.name}`} onPress={onToggle}>
        <Outlined frame={[0, 0, 86.1, 19]} radius={9.5} border={2} shadow={2} fill={added ? colors.mint : colors.green} />
        <Image
          source={added ? require('../assets/images/discover/added.png') : require('../assets/images/discover/add.png')}
          style={box(9.1, 4.25, 10.5, 10.5)}
        />
        <Label x={23} y={3.9} size={8}>{added ? 'Added' : 'Add to Garden'}</Label>
      </Pop>

      <Outlined
        frame={[109.2, top + 57, 207.7, 27.7]}
        radius={13.85}
        border={0.9}
        shadow={0}
        fill={colors.background}
        borderColor={colors.stripBorder}
      />
      <View style={[box(173.4, top + 62.5, 0.9, 17.5), { backgroundColor: scheduleColors.stripDivider }]} />
      <View style={[box(247.7, top + 62.5, 0.9, 17.5), { backgroundColor: scheduleColors.stripDivider }]} />

      <Image source={require('../assets/images/icon-sun-small.png')} style={box(133.7, top + 61.6, 6, 6)} />
      <Label x={142.2} y={top + 61.4} size={5.3}>Sun</Label>
      <Label x={144} y={top + 68.6} size={8.1} align="center" width={70}>{plant.sunLabel}</Label>

      <Image source={require('../assets/images/discover/drop.png')} style={box(200.1, top + 61.6, 4.4, 6)} />
      <Label x={206.5} y={top + 61.4} size={5}>Water</Label>
      <Label x={211} y={top + 67.9} size={9} align="center" width={70}>{plant.water}</Label>

      <Image source={require('../assets/images/icon-cloud.png')} style={box(268.2, top + 62.5, 5.3, 4)} resizeMode="contain" />
      <Label x={275.5} y={top + 61.4} size={5}>Shade</Label>
      <Label x={279.6} y={top + 67.8} size={9} align="center" width={70}>{plant.shade}</Label>
    </>
  );
}
