import { ImageBackground, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

type Props = {
  children: React.ReactNode;
  dim?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BrandBackground({ children, style, dim = true }: Props) {
  return (
    <ImageBackground
      source={require('../../assets/brand/hero.png')}
      style={styles.root}
      resizeMode="cover"
    >
      <LinearGradient
        colors={
          dim
            ? ['rgba(5,14,28,0.55)', 'rgba(5,14,28,0.82)', 'rgba(5,14,28,0.94)']
            : ['rgba(5,14,28,0.25)', 'rgba(5,14,28,0.55)', colors.background]
        }
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, style]}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
