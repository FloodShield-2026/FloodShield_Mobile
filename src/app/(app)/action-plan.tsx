import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import * as actionPlanService from '@/services/actionPlanService';
import * as occurrenceService from '@/services/occurrenceService';
import type { ActionPlan } from '@/types/models';
import { colors, spacing } from '@/theme/colors';

export default function ActionPlanScreen() {
  const { occurrenceId } = useLocalSearchParams<{ occurrenceId?: string }>();
  const { user } = useAuth();
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const list = await occurrenceService.listOccurrences(user.id);
        const occurrence =
          list.find((item) => item.id === occurrenceId) ??
          list[0] ??
          {
            id: 'local',
            title: 'Monitoramento geral',
            description: 'Sem ocorrência selecionada',
            neighborhood: 'Zona Leste',
            waterLevelCm: 25,
            status: 'ABERTA' as const,
            createdAt: new Date().toISOString(),
            userId: user.id,
          };
        setPlan(await actionPlanService.generateActionPlan(occurrence));
      } finally {
        setLoading(false);
      }
    })();
  }, [occurrenceId, user]);

  return (
    <Screen
      title="Plano de ação"
      subtitle="Assistente integrado ao fluxo (Spring AI + RAG no backend Java)."
      scroll
    >
      {loading || !plan ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.summary}>{plan.summary}</Text>
          {plan.shelterName ? (
            <Text style={styles.shelter}>Abrigo sugerido: {plan.shelterName}</Text>
          ) : null}
          {plan.steps.map((step, index) => (
            <View key={step} style={styles.step}>
              <Text style={styles.stepIndex}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
          <Text style={styles.meta}>Gerado em {new Date(plan.generatedAt).toLocaleString('pt-BR')}</Text>
        </View>
      )}
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
    gap: spacing.md,
  },
  summary: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  shelter: {
    color: colors.primarySoft,
    fontWeight: '700',
  },
  step: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  stepIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.background,
    backgroundColor: colors.primary,
    fontWeight: '800',
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    color: colors.textMuted,
    lineHeight: 20,
  },
  meta: {
    color: colors.textDim,
    fontSize: 12,
  },
});
