import {
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

type Props = {
  children: React.ReactNode;
  dim?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BrandBackground({ children, style, dim = true }: Props) {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={[
        styles.root,
        {
          width,
          minHeight: height,
          ...(Platform.OS === 'web'
            ? { height, position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0 }
            : { flex: 1 }),
        },
      ]}
    >
      <Image
        source={require('../../assets/brand/background.png')}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={
          dim
            ? ['rgba(3,10,22,0.35)', 'rgba(3,10,22,0.62)', 'rgba(3,10,22,0.88)']
            : ['rgba(3,10,22,0.12)', 'rgba(3,10,22,0.38)', 'rgba(3,10,22,0.72)']
        }
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    overflow: Platform.OS === 'web' ? 'scroll' : 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    zIndex: 1,
  },
});

