import { StyleSheet, TextInput } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';
import Outlined from './Outlined';

export default function TextField({ frame, ...inputProps }) {
  const { px } = useStage();
  return (
    <Outlined frame={frame} radius={23}>
      <TextInput
        {...inputProps}
        placeholderTextColor={colors.descGrey}
        style={[styles.input, { fontSize: px(18), paddingHorizontal: px(18) }]}
      />
    </Outlined>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: '100%',
    fontFamily: fonts.body,
    color: colors.ink,
  },
});
