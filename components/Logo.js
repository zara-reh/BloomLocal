import { Text, View } from 'react-native';
import { colors, fonts } from './theme';
import { useStage } from './Screen';

export default function Logo({ x = 121, y = 20 }) {
  const { px, box } = useStage();
  return (
    <View style={[box(x, y, 140, 36.4), { justifyContent: 'center' }]}>
      <Text style={{ fontFamily: fonts.logo, fontSize: px(21.8) }}>
        <Text style={{ color: colors.greenLight }}>Bloom</Text>
        <Text style={{ color: colors.green }}>Local</Text>
      </Text>
    </View>
  );
}
