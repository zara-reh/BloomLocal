import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import ProgressHeader from '../../components/ProgressHeader';
import Bloom from '../../components/Bloom';
import TextField from '../../components/TextField';

export default function NameZipScreen() {
  return (
    <Screen keyboard>
      <NameZipContent />
    </Screen>
  );
}

function NameZipContent() {
  const { px, box } = useStage();
  const [name, setName] = useState('');
  const [zip, setZip] = useState('');

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
      {zip.length === 5 && (
        <Text style={[styles.center, styles.zone, box(33, 483, 293), { fontSize: px(17) }]}>
          We found your garden zone!
        </Text>
      )}

      <Button variant="back" frame={[23, 542, 70.7, 54]} onPress={() => router.back()} />
      <Button label="continue" frame={[108, 542, 225.3, 54]} onPress={() => router.push('/setup/conditions')} />
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
  zone: {
    color: colors.zoneText,
  },
});
