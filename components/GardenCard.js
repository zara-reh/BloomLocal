import { Image, StyleSheet, Text } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';
import Outlined from './Outlined';
import { useCare } from '../state/useCare';

const waterNames = { Low: 'Low', Moderate: 'Mod', High: 'Heavy' };

// One plant in My Garden. left and top are in design units.
export default function GardenCard({ plant, left, top }) {
  const { px, box } = useStage();
  const status = useCare().statuses[plant.id];

  return (
    <Outlined
      frame={[left, top, 131, 171.5]}
      radius={11}
      border={2.7}
      shadow={2}
      overlay={
        <>
          <Text style={[styles.name, box(0, 13, 131), { fontSize: px(14.5) }]}>{plant.name}</Text>
          <Image source={plant.image} style={box(33, 36, 66, 66)} resizeMode="contain" />

          <Outlined frame={[15, 105, 48, 14]} radius={5.4} border={1.35} shadow={0.7} fill={colors.yellow}>
            <Text style={[styles.badge, { fontSize: px(7) }]}>{plant.sunLabel}</Text>
          </Outlined>
          <Outlined frame={[68, 105, 48, 14]} radius={5.4} border={1.35} shadow={0.7} fill={colors.blue}>
            <Text style={[styles.badge, { fontSize: px(7) }]}>{`${waterNames[plant.water]} Water`}</Text>
          </Outlined>

          <Outlined
            frame={[22, 129, 87, 27]}
            radius={13.5}
            border={1.9}
            shadow={1.4}
            fill={status.urgent ? colors.mint : colors.grey}
            overlay={
              status.type === 'water' && (
                <Image source={require('../assets/images/home/drop-small.png')} style={box(12, 6.5, 14, 14)} />
              )
            }
          >
            <Text
              style={[
                styles.status,
                { fontSize: px(status.urgent ? 8 : 7), width: px(52), marginLeft: status.type === 'water' ? px(16) : 0 },
              ]}
            >
              {status.text}
            </Text>
          </Outlined>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  name: {
    fontFamily: fonts.body,
    color: colors.ink,
    textAlign: 'center',
  },
  badge: {
    fontFamily: fonts.body,
    color: colors.black,
  },
  status: {
    fontFamily: fonts.body,
    color: colors.black,
    textAlign: 'center',
  },
});
