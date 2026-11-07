import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing } from '@/theme/colors';

const FEATURES = [
  'Monitoramento em tempo real',
  'Alertas inteligentes',
  'Pontos de abrigo',
  'Plano de ação com IA',
  'Check-in seguro / preciso de ajuda',
];

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen
      title={`Olá, ${user?.name.split(' ')[0] ?? 'cidadão'}`}
      subtitle="FloodShield acompanha o nível da rua e te guia antes da água chegar na porta."
      scroll
    >
      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>STATUS DA REGIÃO</Text>
        <Text style={styles.cardTitle}>Atenção moderada</Text>
        <Text style={styles.cardCopy}>
          Chuva forte prevista. Monitore ocorrências próximas e deixe o kit pronto.
        </Text>
      </View>

      <View style={styles.list}>
        {FEATURES.map((item) => (
          <View key={item} style={styles.pill}>
            <Text style={styles.pillText}>{item}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton label="Registrar alagamento" onPress={() => router.push('/(app)/occurrences/new')} />
      <PrimaryButton
        label="Ver plano de ação"
        variant="ghost"
        onPress={() => router.push('/(app)/action-plan')}
      />
      <PrimaryButton label="Sair" variant="ghost" onPress={() => signOut()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardEyebrow: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  cardTitle: {
    color: colors.warning,
    fontSize: 24,
    fontWeight: '800',
  },
  cardCopy: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  list: {
    gap: spacing.sm,
  },
  pill: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    color: colors.text,
    fontWeight: '600',
  },
});
