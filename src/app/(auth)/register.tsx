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

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || password.length < 6) {
      showAlert('Dados inválidos', 'Preencha nome, e-mail e senha com ao menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await signUp(name.trim(), email.trim(), password);
      router.replace('/(app)/home');
    } catch (error) {
      showAlert('Falha no cadastro', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <BrandBackground dim={false}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <BrandMark size="md" showWordmark />
          <Text style={styles.subtitle}>Crie sua conta de cidadão no FloodShield.</Text>

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
  },
  form: {
    width: '100%',
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
