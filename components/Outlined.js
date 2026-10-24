import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from './theme';
import { useStage } from './Screen';


export default function Outlined({
  frame,
  radius,
  border = 3,
  shadow = 2,
  fill = colors.white,
  onPress,
  disabled = false,
  children,
  overlay,
}) {
  const { px, box } = useStage();
  const [left, top, width, height] = frame;
  const outerRadius = px(radius);
  const borderWidth = px(border);

  const body = (
    <View style={[styles.outline, { borderRadius: outerRadius, padding: borderWidth }]}>
      <View
        style={[
          styles.fill,
          { borderRadius: Math.max(outerRadius - borderWidth, 0), backgroundColor: fill },
        ]}
      >
        {children}
      </View>
    </View>
  );

  return (
    <View style={[box(left, top, width, height), disabled && styles.disabled]}>
      {shadow > 0 && (
        <View style={[styles.shadow, { borderRadius: outerRadius, top: px(shadow) }]} />
      )}
      {onPress ? (
        <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={styles.fillBox}>
          {body}
        </Pressable>
      ) : (
        body
      )}
      {overlay && (
        <View style={StyleSheet.absoluteFill} pointerEvents={onPress ? 'none' : 'box-none'}>
          {overlay}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: colors.black,
  },
  fillBox: {
    flex: 1,
  },
  outline: {
    flex: 1,
    backgroundColor: colors.black,
  },
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
