import { Image, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { APP_COMMIT_HASH, TEAM, USE_MOCK_APIS } from '@/constants/config';
import { colors, spacing } from '@/theme/colors';

export default function AboutScreen() {
  return (
    <Screen
      title="Sobre o App"
      subtitle="Tela exigida na publicação — exibe o hash do commit de referência."
      scroll
    >
      <View style={styles.card}>
        <Image source={require('../../../assets/brand/logo.png')} style={styles.logo} />
        <Text style={styles.brand}>FloodShield</Text>
        <Text style={styles.tagline}>Predict. Protect. Save Lives.</Text>
        <Text style={styles.hashLabel}>Commit de referência</Text>
        <Text selectable style={styles.hash}>
          {APP_COMMIT_HASH}
        </Text>
        <Text style={styles.meta}>
          Modo API: {USE_MOCK_APIS ? 'mock local (sem URL Java)' : 'Java/APIs remotas'}
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
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 20,
    marginBottom: spacing.sm,
  },
  brand: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  tagline: {
    color: colors.primarySoft,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  hashLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
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
