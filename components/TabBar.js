import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, DESIGN_WIDTH } from './theme';
import { usePop } from './Pop';

// Sizes are in design units: the bar is 360 wide and 72 tall.
const BAR_HEIGHT = 72;
const OUTLINE = 1.5;
// The label pictures have a 2 unit transparent margin so the letters are not clipped.
const tabImages = {
  home: {
    icon: require('../assets/images/tabs/icon-home.png'),
    iconSize: [18, 19],
    label: require('../assets/images/tabs/label-home.png'),
    labelSize: [25, 8],
  },
  schedule: {
    icon: require('../assets/images/tabs/icon-schedule.png'),
    iconSize: [18, 19],
    label: require('../assets/images/tabs/label-schedule.png'),
    labelSize: [40, 8],
  },
  discover: {
    icon: require('../assets/images/tabs/icon-discover.png'),
    iconSize: [18, 17],
    label: require('../assets/images/tabs/label-discover.png'),
    labelSize: [38, 8],
  },
  settings: {
    icon: require('../assets/images/tabs/icon-settings.png'),
    iconSize: [19, 19],
    label: require('../assets/images/tabs/label-settings.png'),
    labelSize: [35, 10],
  },
};

export default function TabBar({ state, emitter, navigateToTab }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = width / DESIGN_WIDTH;
  const px = (n) => n * scale;
  const tabWidth = width / state.routes.length;

  // The green pill glides to the selected tab, with no bounce.
  const slide = useRef(new Animated.Value(state.index * tabWidth)).current;
  useEffect(() => {
    Animated.timing(slide, {
      toValue: state.index * tabWidth,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  // The outline is a black shape with the white bar inside it, so the white cannot leak at the corners.
  return (
    <View style={styles.background}>
      <View
        style={[
          styles.outline,
          {
            height: px(BAR_HEIGHT) + insets.bottom,
            borderTopLeftRadius: px(40),
            borderTopRightRadius: px(40),
            padding: px(OUTLINE),
            paddingBottom: 0,
          },
        ]}
      >
        <View
          style={[
            styles.bar,
            { borderTopLeftRadius: px(40 - OUTLINE), borderTopRightRadius: px(40 - OUTLINE) },
          ]}
        >
          <Animated.Image
            source={require('../assets/images/tabs/tab-select.png')}
            style={[
              styles.image,
              {
                left: (tabWidth - px(73)) / 2,
                top: px(8),
                width: px(73),
                height: px(53),
                transform: [{ translateX: slide }],
              },
            ]}
          />
          {state.routes.map((route, index) => {
            const focused = state.index === index;

            const onPress = () => {
              const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                navigateToTab(route.key);
              }
            };

            return (
              <TabButton
                key={route.key}
                name={route.name}
                focused={focused}
                onPress={onPress}
                tabWidth={tabWidth}
                px={px}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

// One tab: the icon and label pop a little when pressed.
function TabButton({ name, focused, onPress, tabWidth, px }) {
  const images = tabImages[name];
  const [iconWidth, iconHeight] = images.iconSize;
  const [labelWidth, labelHeight] = images.labelSize;
  const { scale, pressIn, pressOut } = usePop(0.88);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={name}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={{ width: tabWidth, height: px(BAR_HEIGHT - OUTLINE) }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale }] }]}>
        <Image
          source={images.icon}
          style={[
            styles.image,
            {
              left: (tabWidth - px(iconWidth)) / 2,
              top: px(19 + (19 - iconHeight) / 2),
              width: px(iconWidth),
              height: px(iconHeight),
            },
          ]}
        />
        <Image
          source={images.label}
          style={[
            styles.image,
            {
              left: (tabWidth - px(labelWidth + 4)) / 2,
              top: px(43 - 2),
              width: px(labelWidth + 4),
              height: px(labelHeight + 4),
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.background,
  },
  outline: {
    backgroundColor: colors.black,
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
  },
  image: {
    position: 'absolute',
  },
});
