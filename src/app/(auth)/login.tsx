import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/theme/colors';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('cidadao@floodshield.app');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace('/(app)/home');
    } catch (error) {
      Alert.alert('Falha no login', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      title="Entrar"
      subtitle="Acesse sua conta FloodShield para monitorar a rua e receber o plano de ação."
      scroll
    >
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
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
