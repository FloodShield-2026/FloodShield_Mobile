import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/theme/colors';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || password.length < 6) {
      Alert.alert('Dados inválidos', 'Preencha nome, e-mail e senha com ao menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await signUp(name.trim(), email.trim(), password);
      router.replace('/(app)/home');
    } catch (error) {
      Alert.alert('Falha no cadastro', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Criar conta" subtitle="Cadastro de cidadão para alertas e ocorrências." scroll>
      <View style={styles.form}>
        <TextField label="Nome completo" value={name} onChangeText={setName} />
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
        <PrimaryButton label="Cadastrar" loading={loading} onPress={handleRegister} />
        <Link href="/(auth)/login" style={styles.link}>
          Já tenho conta
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
  link: {
    color: colors.primarySoft,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: spacing.sm,
  },
});
