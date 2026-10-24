import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import Logo from '../../components/Logo';
import ProgressHeader from '../../components/ProgressHeader';

export default function ConditionsScreen() {
  return (
    <Screen>
      <ConditionsContent />
    </Screen>
  );
}

function ConditionsContent() {
  const { px, box } = useStage();

  return (
    <>
      <Logo x={121} y={20} />
      <ProgressHeader step={2} />

      <Text style={[styles.heading, box(29, 92, 275), { fontSize: px(20) }]}>Daily Sunlight Exposure</Text>
      <Text style={[styles.hint, box(29, 120, 275), { fontSize: px(11) }]}>
        How much sunlight is your gardening space usually receiving?
      </Text>
      <Chip label="Full Sun" icon={require('../../assets/images/icon-sun.png')} iconSize={18.6} frame={[26, 156, 93, 37]} />
      <Chip label="Part Shade" icon={require('../../assets/images/icon-part-shade.png')} iconSize={17.5} frame={[132, 156, 93, 37]} />
      <Chip label="Full Shade" icon={require('../../assets/images/icon-cloud.png')} iconSize={17} frame={[239, 156, 93, 37]} />

      <Text style={[styles.heading, box(29, 224, 275), { fontSize: px(20) }]}>Soil Type</Text>
      <Text style={[styles.hint, box(29, 252, 275), { fontSize: px(11) }]}>
        To check your soil, squeeze a damp handful into a ball to see if it is gritty (sand), sticky (clay), or smooth (silt), or look to see if it is crumbly and rich (loam).
      </Text>
      <Chip label="Sand" frame={[29, 304, 58, 33]} />
      <Chip label="Clay" frame={[108, 304, 59, 33]} />
      <Chip label="Silt" frame={[189, 304, 58, 33]} />
      <Chip label="Loam" frame={[269, 304, 58, 33]} />

      <Text style={[styles.heading, box(29, 367, 275), { fontSize: px(20) }]}>Commitment</Text>
      <Chip variant="card" label="Low" description="Tend to plants around once every week" frame={[32, 403, 92, 71]} />
      <Chip variant="card" label="Medium" description="Tend to plants a few times a week" frame={[137, 403, 92, 71]} />
      <Chip variant="card" label="High" description="Tend to plants multiple times a week or daily" frame={[242, 403, 92, 71]} />

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
