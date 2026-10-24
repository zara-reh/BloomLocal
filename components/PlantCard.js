import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';
import Outlined from './Outlined';

export default function PlantCard({ plant, top = 0, selected = false, onPress }) {
  const { px, box } = useStage();
  return (
    <Outlined
      frame={[33, top, 294, 100]}
      radius={11}
      border={1.5}
      shadow={2}
      onPress={onPress}
      popScale={0.98}
      overlay={
        <>
          <Text style={[styles.small, box(14, 10), { fontSize: px(7.9) }]}>{plant.category}</Text>
          <Text style={[styles.small, box(14, 81), { fontSize: px(7) }]}>{plant.scientificName}</Text>

          <Outlined frame={[13, 24, 52, 52]} radius={5.8} border={1.2} shadow={1.7} fill={colors.background}>
            <Image source={plant.image} style={{ width: px(42), height: px(42) }} resizeMode="contain" />
          </Outlined>

          <Text style={[styles.name, box(79, 12), { fontSize: px(17) }]}>{plant.name}</Text>
          <Text style={[styles.growTime, box(79, 38), { fontSize: px(9) }]}>{plant.growTime}</Text>

          <Outlined
          frame={[265, 9, 21, 21]}
          radius={10.5}
          border={1}
          shadow={2}
          fill={selected ? colors.greenMid : colors.background}
        >
          {selected && <Text style={[styles.check, { fontSize: px(12) }]}>{'\u2713'}</Text>}
        </Outlined>

          <View style={[box(77, 57, 206, 26), styles.strip, { borderRadius: px(21), borderWidth: Math.max(px(0.8), 1) }]}>
            <View style={[styles.divider, box(63, 4, 1, 16)]} />
            <View style={[styles.divider, box(137, 4, 1, 16)]} />
            <Image
              source={require('../assets/images/icon-sun-small.png')}
              style={box(24, 4, 6, 6)}
            />
            <Text style={[styles.stripLabel, box(0, 4, 63), { fontSize: px(5), paddingLeft: px(10) }]}>Sun</Text>
            <Text style={[styles.stripLabel, box(64, 4, 73), { fontSize: px(5) }]}>Water</Text>
            <Text style={[styles.stripLabel, box(138, 4, 68), { fontSize: px(5) }]}>Shade</Text>
            <Text style={[styles.stripValue, box(0, 11, 63), { fontSize: px(8) }]}>{plant.sunLabel}</Text>
            <Text style={[styles.stripValue, box(64, 10, 73), { fontSize: px(9) }]}>{plant.water}</Text>
            <Text style={[styles.stripValue, box(138, 10, 68), { fontSize: px(9) }]}>{plant.shade}</Text>
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontFamily: fonts.body,
    color: colors.labelGrey,
  },
  name: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  growTime: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  strip: {
    backgroundColor: colors.background,
    borderColor: colors.stripBorder,
  },
  divider: {
    backgroundColor: colors.stripBorder,
  },
  stripLabel: {
    fontFamily: fonts.body,
    color: colors.black,
    textAlign: 'center',
  },
  check: {
    fontFamily: fonts.bodyBold,
    color: colors.black,
  },
  stripValue: {
    fontFamily: fonts.body,
    color: colors.black,
    textAlign: 'center',
  },
});
