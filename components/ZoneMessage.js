import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';
import { FALLBACK_ZONE } from '../data/zone';

// The message under the zip code field. style places it on the screen.
export default function ZoneMessage({ zip, status, zone, style }) {
  const { px } = useStage();

  let message = null;
  if (zip.length > 0 && zip.length < 5) {
    message = 'Please enter all 5 digits of your zip code.';
  } else if (status === 'loading') {
    message = 'Looking up your garden zone...';
  } else if (status === 'found') {
    message = (
      <>
        {'We found your garden zone!\n'}
        <Text style={styles.zone}>Zone {zone}</Text>
      </>
    );
  } else if (status === 'fallback') {
    message = `We could not find that zip code, so we will start you in Zone ${FALLBACK_ZONE}.`;
  }

  return <Text style={[styles.text, { fontSize: px(17) }, style]}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.body,
    color: colors.zoneText,
    textAlign: 'center',
  },
  zone: {
    fontFamily: fonts.bodyMedium,
  },
});
