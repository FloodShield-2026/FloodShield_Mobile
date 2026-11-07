import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import * as occurrenceService from '@/services/occurrenceService';
import type { Occurrence } from '@/types/models';
import { colors, spacing } from '@/theme/colors';

export default function OccurrenceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<Occurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user || !id) return;
      try {
        const found = await occurrenceService.getOccurrence(String(id), user.id);
        setItem(found ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  async function handleSave() {
    if (!user || !item) return;
    try {
      setSaving(true);
      const updated = await occurrenceService.updateOccurrence(user.id, item.id, item);
      setItem(updated);
      Alert.alert('Salvo', 'Ocorrência atualizada.');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Falha ao atualizar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || !item) return;
    Alert.alert('Excluir', 'Deseja remover esta ocorrência?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await occurrenceService.deleteOccurrence(user.id, item.id);
          router.replace('/(app)/occurrences');
        },
      },
    ]);
  }

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen title="Não encontrada">
        <PrimaryButton label="Voltar" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen title="Detalhe" subtitle="Edite, exclua ou gere o plano de ação." scroll>
      <View style={styles.form}>
        <TextField
          label="Título"
          value={item.title}
          onChangeText={(title) => setItem({ ...item, title })}
        />
        <TextField
          label="Bairro"
          value={item.neighborhood}
          onChangeText={(neighborhood) => setItem({ ...item, neighborhood })}
        />
        <TextField
          label="Nível (cm)"
          keyboardType="numeric"
          value={String(item.waterLevelCm)}
          onChangeText={(value) => setItem({ ...item, waterLevelCm: Number(value) || 0 })}
        />
        <TextField
          label="Descrição"
          value={item.description}
          onChangeText={(description) => setItem({ ...item, description })}
          multiline
          style={{ minHeight: 110, textAlignVertical: 'top' }}
        />
        <Text style={styles.meta}>Status: {item.status}</Text>
        <PrimaryButton label="Salvar alterações" loading={saving} onPress={handleSave} />
        <PrimaryButton
          label="Gerar plano de ação"
          variant="ghost"
          onPress={() =>
            router.push({
              pathname: '/(app)/action-plan',
              params: { occurrenceId: item.id },
            })
          }
        />
        <PrimaryButton label="Excluir" variant="danger" onPress={handleDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  meta: {
    color: colors.textMuted,
  },
});
