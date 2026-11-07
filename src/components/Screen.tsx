import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { BrandBackground } from '@/components/BrandBackground';
import { spacing } from '@/theme/colors';

type Props = ViewProps & {
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  showBrand?: boolean;
  children: React.ReactNode;
};

export function Screen({
  title,
  subtitle,
  scroll,
  showBrand = true,
  children,
  style,
  ...rest
}: Props) {
  const body = (
    <View style={[styles.body, style]} {...rest}>
      {showBrand ? <AppHeader title={title} subtitle={subtitle} /> : null}
      {children}
    </View>
  );

  return (
    <BrandBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </SafeAreaView>
    </BrandBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
});
