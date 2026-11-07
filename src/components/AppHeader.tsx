import { StyleSheet, Text, View } from 'react-native';
import { BrandMark } from '@/components/BrandMark';
import { colors, spacing } from '@/theme/colors';

type Props = {
  title?: string;
  subtitle?: string;
};

export function AppHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.brandRow}>
        <BrandMark size="sm" />
        <View style={styles.brandText}>
          <Text style={styles.brandName}>
            <Text style={styles.flood}>Flood</Text>
            <Text style={styles.shield}>Shield</Text>
          </Text>
          <Text style={styles.slogan}>Predict. Protect. Save Lives.</Text>
        </View>
      </View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  brandText: {
    flex: 1,
    gap: 2,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
  },
  flood: {
    color: colors.text,
  },
  shield: {
    color: colors.primarySoft,
  },
  slogan: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
