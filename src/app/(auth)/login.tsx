import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandBackground } from '@/components/BrandBackground';
import { BrandMark } from '@/components/BrandMark';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { showAlert } from '@/utils/alert';
import { colors, spacing } from '@/theme/colors';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('cidadao@floodshield.app');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      showAlert('Campos obrigatórios', 'Informe e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace('/(app)/home');
    } catch (error) {
      showAlert('Falha no login', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <BrandBackground dim={false}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <BrandMark size="lg" showWordmark />
          <Text style={styles.subtitle}>Entre para monitorar sua região e receber alertas.</Text>

          <View style={styles.form}>
            <TextField
              label="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              label="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <PrimaryButton label="Entrar" loading={loading} onPress={handleLogin} />
            <Text style={styles.hint}>Demo: cidadao@floodshield.app / 123456</Text>
            <Link href="/(auth)/register" style={styles.link}>
              Ainda não tem conta? Cadastre-se
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </BrandBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  form: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: colors.primarySoft,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: spacing.sm,
  },
});
