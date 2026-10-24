import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import ProgressHeader from '../../components/ProgressHeader';
import Bloom from '../../components/Bloom';
import Outlined from '../../components/Outlined';

export default function ReadyScreen() {
  return (
    <Screen>
      <ReadyContent />
    </Screen>
  );
}

function ReadyContent() {
  const { px, box } = useStage();

  return (
    <>
      <Logo x={117} y={18} />
      <ProgressHeader step={4} y={1} />

      <Outlined frame={[29, 91, 302, 109]} radius={13} border={1.5} shadow={2}
        overlay={
          <>
            <Text style={[styles.title, box(0, 30, 302), { fontSize: px(20) }]}>{'Let’s start planting!'}</Text>
            <Text style={[styles.subtitle, box(0, 61, 302), { fontSize: px(14) }]}>Your garden awaits.</Text>
          </>
        }
      />

      <Bloom frame={[129.3, 261.2, 102.9, 107.5]} shadow={[125, 355.8, 111, 23]} />

      <Button variant="back" frame={[25, 552, 70.7, 54]} onPress={() => router.back()} />
      <Button label="finish setup" frame={[110, 552, 225.3, 54]} />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.body,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.subtitleGrey,
    textAlign: 'center',
  },
});
