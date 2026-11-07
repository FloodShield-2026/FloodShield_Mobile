import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, spacing } from '@/theme/colors';

export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(12, 28, 46, 0.86)',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
