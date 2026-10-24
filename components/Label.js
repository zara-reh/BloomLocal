import { Text } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';

// A single line of text placed by its top edge. x is the left edge, or the middle when
// align is "center", or the right edge when align is "right". All in design units.
export default function Label({ x, y, size, color = colors.black, align = 'left', width = 200, font = fonts.body, style, children }) {
  const { px, box } = useStage();
  let left = x;
  if (align === 'center') {
    left = x - width / 2;
  } else if (align === 'right') {
    left = x - width;
  }

  return (
    <Text
      pointerEvents="none"
      numberOfLines={1}
      style={[box(left, y, width), { fontFamily: font, fontSize: px(size), color, textAlign: align }, style]}
    >
      {children}
    </Text>
  );
}
