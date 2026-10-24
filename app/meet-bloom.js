import { Image, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../components/theme';
import Screen, { useStage } from '../components/Screen';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Bloom from '../components/Bloom';
import Outlined from '../components/Outlined';

export default function MeetBloomScreen() {
  return (
    <Screen>
      <MeetBloomContent />
    </Screen>
  );
}

function MeetBloomContent() {
  const { px, box } = useStage();

  return (
    <>
      <Logo x={117} y={20} />

      <Bloom frame={[32, 185.5, 71.4, 74.5]} shadow={[29, 254, 78, 10]} />

      <Image source={require('../assets/images/bubble-tail-outline.png')} style={box(124.4, 193.8, 33.8, 27.3)} />
      <Outlined frame={[113, 89, 214, 111]} radius={11} border={2} shadow={2}
        overlay={
          <>
            <Text style={[styles.bubbleText, box(13, 12, 188), { fontSize: px(12) }]}>
              {'Hello, I’m Bloom! I’ll help you turn your yard into a thriving refuge for local pollinators! Together, we’ll match the best native plants to your unique space so your garden can flourish!'}
            </Text>
          </>
        }
      />
      <Image source={require('../assets/images/bubble-tail-fill.png')} style={box(125.9, 195.5, 29, 23)} />

      <Outlined frame={[16, 324, 327, 147]} radius={17} border={2} shadow={2}
        overlay={
          <>
            <Text style={[styles.funFact, box(12, 20, 304), { fontSize: px(15) }]}>
              {'Did you know '}
              <Text style={styles.funFactBold}>native plants product up to 35x more food for pollinators</Text>
              {' than standard lawn grass? This is critical because suburban habitat loss has drastically reduced local bee and butterfly populations that rely on native plants to survive.'}
            </Text>
          </>
        }
      />

      <Outlined frame={[114, 303, 132.6, 27.6]} radius={13.8} border={1.5} shadow={1.5} fill={colors.background}>
        <Text style={[styles.pill, { fontSize: px(15.2) }]}>Fun Fact</Text>
      </Outlined>

      <Button label="continue" frame={[47, 540, 260, 56]} textSize={20} onPress={() => router.push('/setup/name-zip')} />
    </>
  );
}

const styles = StyleSheet.create({
  bubbleText: {
    fontFamily: fonts.body,
    color: colors.ink,
    textAlign: 'center',
  },
  funFact: {
    fontFamily: fonts.body,
    color: colors.ink,
    textAlign: 'center',
  },
  funFactBold: {
    fontFamily: fonts.bodyMedium,
    color: colors.greenText,
  },
  pill: {
    fontFamily: fonts.body,
    color: colors.greenText,
    textAlign: 'center',
  },
});
