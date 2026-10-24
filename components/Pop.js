import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useStage } from './Screen';

// The press animation: shrink a little when touched, then spring back with a small bounce.
// It only changes a transform, so it runs on the native thread and never re-renders anything.
export function usePop(scaleTo = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.timing(scale, { toValue: scaleTo, duration: 80, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, friction: 5, tension: 320, useNativeDriver: true }).start();
  return { scale, pressIn, pressOut };
}

// A pressable area that pops. frame is [left, top, width, height] in design units; whatever is
// inside is placed relative to the top left corner of the frame and pops along with it.
export default function Pop({ frame, onPress, scaleTo, disabled = false, label, children }) {
  const { box } = useStage();
  const { scale, pressIn, pressOut } = usePop(scaleTo);

  return (
    <Animated.View style={[box(...frame), disabled && styles.disabled, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
