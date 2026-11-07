import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/contexts/AuthContext';
import * as occurrenceService from '@/services/occurrenceService';
import { showAlert } from '@/utils/alert';
import { spacing } from '@/theme/colors';

export default function NewOccurrenceScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [waterLevelCm, setWaterLevelCm] = useState('30');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!user) return;
    if (!title.trim() || !description.trim() || !neighborhood.trim()) {
      showAlert('Campos obrigatórios', 'Preencha título, descrição e bairro.');
      return;
    }

    try {
      setLoading(true);
      const created = await occurrenceService.createOccurrence(user.id, {
        title: title.trim(),
        description: description.trim(),
        neighborhood: neighborhood.trim(),
        waterLevelCm: Number(waterLevelCm) || 0,
      });
      router.replace(`/(app)/occurrences/${created.id}`);
    } catch (error) {
      showAlert('Erro', error instanceof Error ? error.message : 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title="Nova ocorrência" subtitle="Registre alagamento com nível estimado da água." scroll>
      <View style={styles.form}>
        <TextField label="Título" value={title} onChangeText={setTitle} />
        <TextField label="Bairro" value={neighborhood} onChangeText={setNeighborhood} />
        <TextField
          label="Nível da água (cm)"
          keyboardType="numeric"
          value={waterLevelCm}
          onChangeText={setWaterLevelCm}
        />
        <TextField
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ minHeight: 110, textAlignVertical: 'top' }}
        />
        <PrimaryButton label="Salvar" loading={loading} onPress={handleCreate} />
        <PrimaryButton label="Voltar" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
});
