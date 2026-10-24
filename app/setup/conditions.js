import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Logo from '../../components/Logo';
import ProgressHeader from '../../components/ProgressHeader';
import { useAppState } from '../../state/AppState';

const sunOptions = [
  { label: 'Full Sun', icon: require('../../assets/images/icon-sun.png'), iconSize: 18.6, left: 26 },
  { label: 'Part Shade', icon: require('../../assets/images/icon-part-shade.png'), iconSize: 17.5, left: 132 },
  { label: 'Full Shade', icon: require('../../assets/images/icon-cloud.png'), iconSize: 17, left: 239 },
];
const soilOptions = [
  { label: 'Sand', left: 29, width: 58 },
  { label: 'Clay', left: 108, width: 59 },
  { label: 'Silt', left: 189, width: 58 },
  { label: 'Loam', left: 269, width: 58 },
];
const commitmentOptions = [
  { label: 'Low', description: 'Tend to plants around once every week', left: 32 },
  { label: 'Medium', description: 'Tend to plants a few times a week', left: 137 },
  { label: 'High', description: 'Tend to plants multiple times a week or daily', left: 242 },
];

export default function ConditionsScreen() {
  return (
    <Screen>
      <ConditionsContent />
    </Screen>
  );
}

function ConditionsContent() {
  const { px, box } = useStage();
  const { sun, setSun, soil, setSoil, commitment, setCommitment } = useAppState();

  return (
    <>
      <Logo x={121} y={20} />
      <ProgressHeader step={2} />

      <Text style={[styles.heading, box(29, 92, 275), { fontSize: px(20) }]}>Daily Sunlight Exposure</Text>
      <Text style={[styles.hint, box(29, 120, 275), { fontSize: px(11) }]}>
        How much sunlight is your gardening space usually receiving?
      </Text>
      {sunOptions.map((option) => (
        <Chip
          key={option.label}
          label={option.label}
          icon={option.icon}
          iconSize={option.iconSize}
          frame={[option.left, 156, 93, 37]}
          selected={sun === option.label}
          onPress={() => setSun(option.label)}
        />
      ))}

      <Text style={[styles.heading, box(29, 224, 275), { fontSize: px(20) }]}>Soil Type</Text>
      <Text style={[styles.hint, box(29, 252, 275), { fontSize: px(11) }]}>
        To check your soil, squeeze a damp handful into a ball to see if it is gritty (sand), sticky (clay), or smooth (silt), or look to see if it is crumbly and rich (loam).
      </Text>
      {soilOptions.map((option) => (
        <Chip
          key={option.label}
          label={option.label}
          frame={[option.left, 304, option.width, 33]}
          selected={soil === option.label}
          onPress={() => setSoil(option.label)}
        />
      ))}

      <Text style={[styles.heading, box(29, 367, 275), { fontSize: px(20) }]}>Commitment</Text>
      {commitmentOptions.map((option) => (
        <Chip
          key={option.label}
          variant="card"
          label={option.label}
          description={option.description}
          frame={[option.left, 403, 92, 71]}
          selected={commitment === option.label}
          onPress={() => setCommitment(option.label)}
        />
      ))}

      <Button variant="back" frame={[27, 542, 70.7, 54]} onPress={() => router.back()} />
      <Button label="continue" frame={[112, 542, 225.3, 54]} onPress={() => router.push('/setup/pick-plants')} />
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: fonts.body,
    color: colors.ink,
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
});
