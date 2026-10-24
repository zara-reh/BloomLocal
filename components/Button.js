import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';
import Outlined from './Outlined';

const fills = {
  green: colors.greenLight, // main "continue" button
  cream: colors.background, // "begin"
  back: colors.white, // round back arrow
};

// frame is [left, top, width, height]
export default function Button({ label, variant = 'green', frame, onPress, textSize = 19.3 }) {
  const { px } = useStage();
  const isBack = variant === 'back';

  return (
    <Outlined frame={frame} radius={frame[3] / 2} fill={fills[variant]} onPress={onPress || (() => {})}>
      <Text
        style={[
          styles.text,
          isBack ? { fontFamily: fonts.bodyBold, fontSize: px(27.3) } : { fontSize: px(textSize) },
        ]}
      >
        {isBack ? '←' : label}
      </Text>
    </Outlined>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.body,
    color: colors.greenText,
  },
});
