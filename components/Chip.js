import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';
import Outlined from './Outlined';

// variant "choice": button with a shadow (sunlight and soil)
// variant "filter": thin button with no shadow
// variant "card":   small card with a title and description (commitment)
export default function Chip({ label, description, icon, iconSize = 18, selected = false, variant = 'choice', frame, onPress }) {
  const { px } = useStage();
  const fill = selected ? colors.greenMid : colors.white;

  if (variant === 'card') {
    return (
      <Outlined
        frame={frame}
        radius={12}
        border={2}
        shadow={1.77}
        fill={fill}
        onPress={onPress || (() => {})}
        overlay={
          <>
            <Text style={[styles.cardTitle, { fontSize: px(14), top: px(8) }]}>{label}</Text>
            <Text style={[styles.cardText, { fontSize: px(10), top: px(26), left: px(6), right: px(6) }]}>
              {description}
            </Text>
          </>
        }
      />
    );
  }

  const isFilter = variant === 'filter';
  return (
    <Outlined
      frame={frame}
      radius={frame[3] / 2}
      border={isFilter ? 1 : 2}
      shadow={isFilter ? 0 : 1.77}
      fill={fill}
      onPress={onPress || (() => {})}
    >
      <View style={styles.row}>
        {icon && <Image source={icon} style={{ width: px(iconSize), height: px(iconSize), marginRight: px(5) }} resizeMode="contain" />}
        <Text style={[styles.label, { fontSize: px(isFilter ? 10 : 11) }]}>{label}</Text>
      </View>
    </Outlined>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.body,
    color: colors.ink,
  },
  cardTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.body,
    color: colors.ink,
  },
  cardText: {
    position: 'absolute',
    textAlign: 'center',
    fontFamily: fonts.body,
    color: colors.descGrey,
  },
});
