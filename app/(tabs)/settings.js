import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../../components/theme';
import Screen, { useStage } from '../../components/Screen';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import TextField from '../../components/TextField';
import ZoneMessage from '../../components/ZoneMessage';
import { useAppState } from '../../state/AppState';
import { useZoneLookup } from '../../state/useZoneLookup';

export default function SettingsScreen() {
  return (
    <Screen tab keyboard>
      <SettingsContent />
    </Screen>
  );
}

function SettingsContent() {
  const { px, box } = useStage();
  const { name, setName, zip, setZip, setZone, setLocation, resetApp } = useAppState();
  const [draftName, setDraftName] = useState(name);
  const [draftZip, setDraftZip] = useState(zip);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const { status, zone, location } = useZoneLookup(draftZip);

  const lookedUp = status === 'found' || status === 'fallback';
  const changed = draftName.trim() !== name || draftZip !== zip;
  const canSave = draftName.trim().length > 0 && lookedUp && changed;

  const save = () => {
    setName(draftName.trim());
    setZip(draftZip);
    setZone(zone);
    setLocation(location);
  };

  const restart = () => {
    if (confirmRestart) {
      resetApp();
      router.replace('/');
    } else {
      setConfirmRestart(true);
    }
  };

  return (
    <>
      <Logo x={121} y={20} />
      <Text style={[styles.title, box(29, 66), { fontSize: px(26) }]}>Settings</Text>

      <Text style={[styles.label, box(44, 118, 275), { fontSize: px(20) }]}>Your name:</Text>
      <TextField frame={[41, 152, 274, 48]} value={draftName} onChangeText={setDraftName} autoCapitalize="words" />

      <Text style={[styles.label, box(46, 217, 275), { fontSize: px(20) }]}>Your zip code:</Text>
      <TextField
        frame={[43, 251, 274, 48]}
        value={draftZip}
        onChangeText={(text) => setDraftZip(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        maxLength={5}
      />

      <ZoneMessage zip={draftZip} status={status} zone={zone} style={box(33, 317, 293)} />

      <Button
        label={changed ? 'Save changes' : 'Saved'}
        frame={[43, 395, 274, 54]}
        disabled={!canSave}
        onPress={save}
      />
      <Button
        label={confirmRestart ? 'Tap again to clear everything' : 'Restart setup'}
        variant="cream"
        frame={[43, 470, 274, 54]}
        textSize={confirmRestart ? 15 : 19.3}
        onPress={restart}
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  label: {
    fontFamily: fonts.body,
    color: colors.ink,
  },
});
