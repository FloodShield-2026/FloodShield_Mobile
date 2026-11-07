import { StyleSheet, Text, View } from 'react-native';
import { BrandMark } from '@/components/BrandMark';
import { Screen } from '@/components/Screen';
import { APP_COMMIT_HASH, JAVA_API_URL, TEAM, USE_MOCK_APIS } from '@/constants/config';
import { colors, spacing } from '@/theme/colors';

export default function AboutScreen() {
  return (
    <Screen
      title="Sobre o App"
      subtitle="Tela exigida na publicação — exibe o hash do commit de referência."
      scroll
    >
      <View style={styles.card}>
        <BrandMark size="md" showWordmark />
        <Text style={styles.hashLabel}>Commit de referência</Text>
        <Text selectable style={styles.hash}>
          {APP_COMMIT_HASH}
        </Text>
        <Text style={styles.meta}>
          Modo API:{' '}
          {USE_MOCK_APIS ? 'mock local (sem URL Java)' : `Java conectada · ${JAVA_API_URL}`}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Equipe</Text>
        {TEAM.map((member) => (
          <Text key={member.rm} style={styles.member}>
            {member.name} — RM {member.rm}
          </Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(18, 38, 58, 0.82)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  hashLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: spacing.sm,
  },
  hash: {
    color: colors.warning,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  meta: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  section: {
    alignSelf: 'stretch',
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  member: {
    alignSelf: 'stretch',
    color: colors.textMuted,
    marginBottom: 4,
  },
});
