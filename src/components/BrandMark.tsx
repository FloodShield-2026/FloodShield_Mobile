import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZES = {
  sm: 36,
  md: 72,
  lg: 112,
} as const;

export function BrandMark({ size = 'md', showWordmark = false, style }: Props) {
  const dimension = SIZES[size];

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={require('../../assets/brand/logo.png')}
        style={{ width: dimension, height: dimension, borderRadius: dimension * 0.22 }}
        resizeMode="contain"
      />
      {showWordmark ? (
        <Text style={[styles.wordmark, size === 'lg' && styles.wordmarkLg]}>
          <Text style={styles.flood}>Flood</Text>
          <Text style={styles.shield}>Shield</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  wordmarkLg: {
    fontSize: 34,
  },
  flood: {
    color: colors.text,
  },
  shield: {
    color: colors.primarySoft,
  },
});
