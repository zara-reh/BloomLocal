import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import ProgressHeader from '../../components/ProgressHeader';
import Bloom from '../../components/Bloom';
import TextField from '../../components/TextField';
import { useAppState } from '../../state/AppState';
import { lookupZone, FALLBACK_ZONE } from '../../data/zone';

export default function NameZipScreen() {
  return (
    <Screen keyboard>
      <NameZipContent />
    </Screen>
  );
}

function NameZipContent() {
  const { px, box } = useStage();
  const { name, setName, zip, setZip, zone, setZone } = useAppState();
  // 'idle', 'loading', 'found', or 'fallback' (the zip could not be looked up)
  const [lookup, setLookup] = useState('idle');

  useEffect(() => {
    if (zip.length !== 5) {
      setZone(null);
      setLookup('idle');
      return;
    }

    let ignore = false;
    setLookup('loading');
    lookupZone(zip).then((result) => {
      if (ignore) {
        return;
      }
      setZone(result.zone);
      setLookup(result.found ? 'found' : 'fallback');
    });
    return () => {
      ignore = true;
    };
  }, [zip]);

  const canContinue = name.trim().length > 0 && (lookup === 'found' || lookup === 'fallback');

  return (
    <>
      <Logo x={121} y={20} />
      <ProgressHeader step={1} x={34} />

      <Bloom frame={[131.7, 93.3, 95.9, 100.1]} />

      <Text style={[styles.label, box(44, 213, 275), { fontSize: px(20) }]}>Enter your name:</Text>
      <TextField
        frame={[41, 250, 274, 48]}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <Text style={[styles.label, box(46, 321, 275), { fontSize: px(20) }]}>Enter your zip code:</Text>
      <TextField
        frame={[43, 358, 274, 48]}
        value={zip}
        onChangeText={(text) => setZip(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        maxLength={5}
      />

      <Text style={[styles.center, box(49, 427, 261), { fontSize: px(17) }]}>
        This is so we can give you the best plants for your zone!
      </Text>

      <Text style={[styles.center, styles.message, box(33, 483, 293), { fontSize: px(17) }]}>
        {zip.length > 0 && zip.length < 5 && 'Please enter all 5 digits of your zip code.'}
        {lookup === 'loading' && 'Looking up your garden zone...'}
        {lookup === 'found' && (
          <>
            {'We found your garden zone!\n'}
            <Text style={styles.zone}>Zone {zone}</Text>
          </>
        )}
        {lookup === 'fallback' &&
          `We could not find that zip code, so we will start you in Zone ${FALLBACK_ZONE}.`}
      </Text>

      <Button variant="back" frame={[23, 542, 70.7, 54]} onPress={() => router.back()} />
      <Button
        label="continue"
        frame={[108, 542, 225.3, 54]}
        disabled={!canContinue}
        onPress={() => router.push('/setup/conditions')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    color: colors.ink,
  },
  center: {
    fontFamily: fonts.body,
    color: colors.ink,
    textAlign: 'center',
  },
  message: {
    color: colors.zoneText,
  },
  zone: {
    fontFamily: fonts.bodyMedium,
  },
});
