import { createContext, useContext } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, DESIGN_WIDTH, DESIGN_HEIGHT } from './theme';

// Screens are drawn on a 360 x 640 so it fits phone
const ScaleContext = createContext(1);
export const ScaleProvider = ScaleContext.Provider;

export function useStage() {
  const scale = useContext(ScaleContext);
  // px(n): a design size in screen points
  const px = (n) => n * scale;
  // box(left, top, width, height): absolute position in design units
  const box = (left, top, width, height) => ({
    position: 'absolute',
    left: px(left),
    top: px(top),
    ...(width !== undefined && { width: px(width) }),
    ...(height !== undefined && { height: px(height) }),
  });
  return { px, box };
}

// keyboard: scroll the screen out of the way of the keyboard
export default function Screen({ children, keyboard = false }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width / DESIGN_WIDTH, (height - insets.top - insets.bottom) / DESIGN_HEIGHT);

  const stage = (
    <ScaleProvider value={scale}>
      <View style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}>{children}</View>
    </ScaleProvider>
  );

  if (keyboard) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {stage}
      </ScrollView>
    );
  }
  return (
    <View
      style={[
        styles.screen,
        { alignItems: 'center', justifyContent: 'center', paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {stage}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
