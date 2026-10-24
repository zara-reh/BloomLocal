import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';

const BAR_LEFTS = [0, 75, 151, 226];

// x and y nudge the header, since the Figma frames differ by a pixel or two.
export default function ProgressHeader({ step, x = 30, y = 0 }) {
  const { px, box } = useStage();
  return (
    <>
      <Text style={[styles.label, box(x + 1, 46 + y), { fontSize: px(9) }]}>{`Setup ${step}/4`}</Text>
      {BAR_LEFTS.map((offset, index) => (
        <View
          key={offset}
          style={[
            box(x + offset, 60.5 + y, 75, 5),
            styles.bar,
            { borderRadius: px(2.5), borderWidth: Math.max(px(1), 1) },
            index < step && styles.barFilled,
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    color: colors.mutedText,
  },
  bar: {
    borderColor: colors.mutedText,
  },
  barFilled: {
    backgroundColor: colors.mutedText,
  },
});
