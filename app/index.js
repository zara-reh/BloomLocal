import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts, DESIGN_WIDTH, DESIGN_HEIGHT } from '../components/theme';
import { ScaleProvider } from '../components/Screen';
import Button from '../components/Button';

// Laid out on a 360 x 640 stage, scaled to fit the phone and sitting a little above the bottom.
const LIFT = 18;
export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  return (
    <View style={[styles.screen, { paddingBottom: LIFT * scale }]}>
      <View style={[styles.ground, { height: LIFT * scale + 1 }]} />
      <ScaleProvider value={scale}>
        <View style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}>
          <Image
            source={require('../assets/images/bloom-welcome-bg.png')}
            style={styles.background}
            resizeMode="stretch"
          />

          <Text style={[styles.welcome, { left: 54 * scale, top: 152 * scale, fontSize: 20 * scale }]}>
            Welcome to...
          </Text>

          <Text style={[styles.logo, { left: 54 * scale, top: 174 * scale, fontSize: 48 * scale }]}>
            <Text style={styles.logoBloom}>Bloom</Text>
            <Text style={styles.logoLocal}>Local</Text>
          </Text>

          <Button
            label="begin"
            variant="cream"
            frame={[50, 537, 260, 56]}
            textSize={20}
            onPress={() => router.push('/meet-bloom')}
          />
        </View>
      </ScaleProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.brown,
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  welcome: {
    position: 'absolute',
    fontFamily: fonts.body,
    color: colors.ink,
  },
  logo: {
    position: 'absolute',
    fontFamily: fonts.logo,
  },
  logoBloom: {
    color: colors.greenLight,
  },
  logoLocal: {
    color: colors.green,
  },
});
