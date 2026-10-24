import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Logo from '../../components/Logo';
import Outlined from '../../components/Outlined';
import GardenCard from '../../components/GardenCard';
import Label from '../../components/Label';
import { useAppState } from '../../state/AppState';
import { useWeather } from '../../state/useWeather';
import { plants, ecoStats, getCareStatus } from '../../data/mockData';

const weatherIcons = {
  cloud: require('../../assets/images/home/weather-cloud.png'),
  sun: require('../../assets/images/home/weather-sun.png'),
  partly: require('../../assets/images/home/weather-partly.png'),
  rain: require('../../assets/images/home/weather-rain.png'),
  snow: require('../../assets/images/home/weather-snow.png'),
  storm: require('../../assets/images/home/weather-storm.png'),
};

const GRID_TOP = 453;
const ROW_HEIGHT = 196;

export default function HomeScreen() {
  const { gardenIds } = useAppState();
  const rows = Math.max(Math.ceil(gardenIds.length / 2), 1);

  return (
    <Screen tab scrollHeight={GRID_TOP + rows * ROW_HEIGHT}>
      <HomeContent />
    </Screen>
  );
}

function HomeContent() {
  const { px, box } = useStage();
  const { name, zip, zone, gardenIds, location } = useAppState();
  const { status, weather } = useWeather(location);

  let weatherTitle = 'Loading weather...';
  let weatherDetails = '';
  if (weather) {
    weatherTitle = `${weather.condition} \u2022 ${weather.temperature}`;
    weatherDetails = weather.details;
  } else if (status === 'error') {
    weatherTitle = 'Weather unavailable';
    weatherDetails = 'Check your internet connection.';
  }

  const garden = gardenIds.map((id) => plants.find((plant) => plant.id === id));
  const needsWater = garden.filter((plant) => {
    const status = getCareStatus(plant.id);
    return status.type === 'water' && status.urgent;
  }).length;
  const needsPruning = garden.filter((plant) => {
    const status = getCareStatus(plant.id);
    return status.type === 'prune' && status.urgent;
  }).length;

  const ecoCards = [
    { left: 25, circle: require('../../assets/images/home/circle-oxygen.png'), icon: require('../../assets/images/home/eco-oxygen.png'), iconBox: [43, 15, 14, 14], value: ecoStats.oxygen, label: 'O₂ Produced', labelSize: 8 },
    { left: 131, circle: require('../../assets/images/home/circle-carbon.png'), icon: require('../../assets/images/home/eco-carbon.png'), iconBox: [43, 15, 14, 14], value: ecoStats.carbon, label: 'CO₂ Absorbed', labelSize: 8 },
    { left: 236, circle: require('../../assets/images/home/circle-pollinator.png'), icon: require('../../assets/images/home/eco-pollinator.png'), iconBox: [42, 14, 15, 15], value: ecoStats.pollinatorScore, label: 'Pollinator Support Score\n(out of 100)', labelSize: 8 },
  ];

  return (
    <>
      <Image source={require('../../assets/images/home/bloom-head.png')} style={box(41, 50, 40.5, 42.1)} />
      <Text numberOfLines={1} style={[styles.welcome, box(101, 57, 224, 31), { fontSize: px(26) }]}>
        {`Welcome, ${name}`}
      </Text>
      <Logo x={234} y={10} />

      <Outlined
        frame={[26, 99, 308, 141]}
        radius={17}
        border={2}
        shadow={2}
        overlay={
          <>
            <Text style={[styles.small, box(60, 9, 200), { fontSize: px(10) }]}>{`${zip} \u00b7 Zone ${zone}`}</Text>
            <Image source={weatherIcons[weather ? weather.icon : 'cloud']} style={box(32, 14, 54, 41)} resizeMode="contain" />
            <Label x={160} y={23} size={weatherTitle.length > 16 ? 15 : 18} align="center" width={200} color={colors.mutedText}>
              {weatherTitle}
            </Label>
            <Label x={190} y={48} size={10} align="center" width={260} color={colors.mutedText}>
              {weatherDetails}
            </Label>
            <View style={[styles.divider, box(24, 73, 261, 1)]} />

            <Outlined frame={[29, 85, 114, 39]} radius={20} border={2} shadow={2} fill={colors.background}>
              <AlertMessage icon={require('../../assets/images/home/drop-alert.png')} iconSize={[20, 20]}>
                {needsWater === 0
                  ? 'All plants are watered!'
                  : `${needsWater} ${needsWater === 1 ? 'plant needs' : 'plants need'} watering!`}
              </AlertMessage>
            </Outlined>
            <Outlined frame={[162, 85, 114, 39]} radius={20} border={2} shadow={2} fill={colors.mintSoft}>
              <AlertMessage icon={require('../../assets/images/home/prune-alert.png')} iconSize={[7, 23.7]}>
                {needsPruning === 0
                  ? 'Nothing needs pruning!'
                  : `${needsPruning} ${needsPruning === 1 ? 'plant needs' : 'plants need'} pruning!`}
              </AlertMessage>
            </Outlined>
          </>
        }
      />

      <Text style={[styles.heading, box(27, 256, 262), { fontSize: px(20) }]}>Eco Impact Dashboard</Text>
      {ecoCards.map((card) => (
        <Outlined
          key={card.label}
          frame={[card.left, 290, 99, 90]}
          radius={12}
          border={2}
          shadow={2}
          overlay={
            <>
              <Image source={card.circle} style={box(34, 6, 32, 32)} />
              <Image source={card.icon} style={box(...card.iconBox)} />
              <Text style={[styles.statValue, box(0, 42, 99), { fontSize: px(20) }]}>{card.value}</Text>
              <Text style={[styles.statLabel, box(0, 67, 99), { fontSize: px(card.labelSize) }]}>{card.label}</Text>
            </>
          }
        />
      ))}

      <Text style={[styles.heading, styles.centered, box(26, 398, 100), { fontSize: px(20) }]}>My Garden</Text>
      <Text style={[styles.small, box(27, 423), { fontSize: px(8) }]}>
        {`${garden.length} planted species`}
      </Text>
      <Outlined
        frame={[247, 397, 93, 34]}
        radius={17}
        border={2}
        shadow={2}
        fill={colors.green}
        onPress={() => router.navigate('/discover')}
      >
        <View style={styles.newPlant}>
          <Text style={[styles.plus, { fontSize: px(18) }]}>+</Text>
          <Text style={[styles.newPlantLabel, { fontSize: px(11) }]}>New Plant</Text>
        </View>
      </Outlined>

      {garden.length === 0 && (
        <Text style={[styles.empty, box(36, GRID_TOP + 20, 288), { fontSize: px(14) }]}>
          Your garden is empty. Tap New Plant to find something to grow.
        </Text>
      )}
      {garden.map((plant, index) => (
        <GardenCard
          key={plant.id}
          plant={plant}
          left={index % 2 === 0 ? 36 : 196}
          top={GRID_TOP + Math.floor(index / 2) * ROW_HEIGHT}
        />
      ))}
    </>
  );
}

// An icon and a short message, centered together inside an alert pill.
function AlertMessage({ icon, iconSize, children }) {
  const { px } = useStage();
  return (
    <View style={styles.alertRow}>
      <Image source={icon} style={{ width: px(iconSize[0]), height: px(iconSize[1]), marginRight: px(9) }} resizeMode="contain" />
      <Text style={[styles.alert, { fontSize: px(8), width: px(58) }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcome: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  small: {
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: colors.mutedText,
  },
  alert: {
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
  },
  heading: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  centered: {
    textAlign: 'center',
  },
  statValue: {
    fontFamily: fonts.body,
    color: colors.black,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
  },
  newPlant: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plus: {
    fontFamily: fonts.body,
    color: colors.black,
    marginRight: 6,
  },
  newPlantLabel: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  empty: {
    fontFamily: fonts.body,
    color: colors.subtitleGrey,
    textAlign: 'center',
  },
});
