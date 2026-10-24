import { createContext, useContext, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, DESIGN_WIDTH, DESIGN_HEIGHT } from './theme';

// Screens are drawn on a 360 x 640 stage that is scaled to fit the phone.
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

// keyboard:     scroll the screen out of the way of the keyboard
// tab:          the screen sits above the tab bar, which already covers the bottom inset
// scrollHeight: design height of a tall screen; it is scaled by width and scrolls
export default function Screen({ children, keyboard = false, tab = false, scrollHeight }) {
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState(null);

  const width = size ? size.width : window.width;
  const height = size ? size.height : window.height;
  const paddingTop = insets.top;
  const paddingBottom = tab ? 0 : insets.bottom;

  const scrolls = scrollHeight !== undefined;
  const stageHeight = scrolls ? scrollHeight : DESIGN_HEIGHT;
  const scale = scrolls
    ? width / DESIGN_WIDTH
    : Math.min(width / DESIGN_WIDTH, (height - paddingTop - paddingBottom) / DESIGN_HEIGHT);

  const stage = (
    <ScaleProvider value={scale}>
      <View style={{ width: DESIGN_WIDTH * scale, height: stageHeight * scale }}>{children}</View>
    </ScaleProvider>
  );

  let content;
  if (keyboard || scrolls) {
    content = (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: scrolls ? 'flex-start' : 'center',
          paddingTop,
          paddingBottom,
        }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={keyboard}
      >
        {stage}
      </ScrollView>
    );
  } else {
    content = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop, paddingBottom }}>
        {stage}
      </View>
    );
  }

  return (
    <View style={styles.screen} onLayout={(event) => setSize(event.nativeEvent.layout)}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
