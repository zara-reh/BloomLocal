import { Image } from 'react-native';
import { useStage } from './Screen';

export default function Bloom({ frame, shadow }) {
  const { box } = useStage();
  return (
    <>
      {shadow && <Image source={require('../assets/images/bloom-shadow.png')} style={box(...shadow)} />}
      <Image source={require('../assets/images/bloom.png')} style={box(...frame)} />
    </>
  );
}
