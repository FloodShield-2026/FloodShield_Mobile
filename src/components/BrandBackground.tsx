import { Image, Platform, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
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
          ...(Platform.OS === 'web' ? { height, position: 'fixed' as const, inset: 0 } : { flex: 1 }),
        },
      ]}
    >
      <Image
        source={require('../../assets/brand/hero.png')}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={
          dim
            ? ['rgba(5,14,28,0.45)', 'rgba(5,14,28,0.72)', 'rgba(5,14,28,0.88)']
            : ['rgba(5,14,28,0.15)', 'rgba(5,14,28,0.4)', 'rgba(5,14,28,0.7)']
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
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
});
