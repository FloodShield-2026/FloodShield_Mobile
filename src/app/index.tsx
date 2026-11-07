import { Redirect, router } from 'expo-router';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { BrandBackground } from '@/components/BrandBackground';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/theme/colors';

export default function WelcomeScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <BrandBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </BrandBackground>
    );
  }

  if (user) {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <BrandBackground dim={false}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Image source={require('../../assets/brand/logo.png')} style={styles.logo} />
          <Text style={styles.brand}>FloodShield</Text>
          <Text style={styles.tagline}>PREDICT. PROTECT. SAVE LIVES.</Text>
          <Text style={styles.copy}>
            A marca d&apos;água da rua no seu celular: nível de risco, plano de ação e caminho até o
            abrigo antes da enchente chegar na porta.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Entrar" onPress={() => router.push('/(auth)/login')} />
          <PrimaryButton
            label="Criar conta"
            variant="ghost"
            onPress={() => router.push('/(auth)/register')}
          />
        </View>
      </View>
    </BrandBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 72,
    paddingBottom: spacing.xl,
  },
  hero: {
    gap: spacing.md,
    alignItems: 'center',
  },
  logo: {
    width: 132,
    height: 132,
    borderRadius: 28,
  },
  brand: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    color: colors.primarySoft,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  copy: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  actions: {
    gap: spacing.sm,
  },
});
