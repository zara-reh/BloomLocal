import { StyleSheet, View } from 'react-native';
import { colors } from './theme';
import { useStage } from './Screen';
import Pop from './Pop';

// Black outline, hard black shadow, and a colored fill. The outline is a solid black
// shape with the fill inside it, so the fill never leaks out at the rounded edge.
// frame is [left, top, width, height] in design units.
//   children: centered inside the fill
//   overlay:  placed on top of the box, measured from its top left corner
// With onPress the whole shape pops when it is pressed. popScale is how far it shrinks.
export default function Outlined({ frame, onPress, disabled = false, popScale, ...shapeProps }) {
  if (!onPress) {
    return <Shape frame={frame} {...shapeProps} />;
  }

  return (
    <Pop frame={frame} onPress={onPress} disabled={disabled} scaleTo={popScale}>
      <Shape frame={[0, 0, frame[2], frame[3]]} {...shapeProps} />
    </Pop>
  );
}

function Shape({
  frame,
  radius,
  border = 3,
  shadow = 2,
  fill = colors.white,
  borderColor = colors.black,
  shadowColor = colors.black,
  children,
  overlay,
}) {
  const { px, box } = useStage();
  const [left, top, width, height] = frame;
  const outerRadius = px(radius);
  const borderWidth = px(border);

  return (
    <View style={box(left, top, width, height)}>
      {shadow > 0 && (
        <View style={[styles.shadow, { borderRadius: outerRadius, top: px(shadow), backgroundColor: shadowColor }]} />
      )}
      <View style={[styles.outline, { borderRadius: outerRadius, padding: borderWidth, backgroundColor: borderColor }]}>
        <View
          style={[
            styles.fill,
            { borderRadius: Math.max(outerRadius - borderWidth, 0), backgroundColor: fill },
          ]}
        >
          {children}
        </View>
      </View>
      {overlay && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {overlay}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
  },
  outline: {
    flex: 1,
  },
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
