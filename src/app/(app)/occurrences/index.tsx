import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import * as occurrenceService from '@/services/occurrenceService';
import type { Occurrence } from '@/types/models';
import { showAlert } from '@/utils/alert';
import { colors, spacing } from '@/theme/colors';

export default function OccurrencesScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setItems(await occurrenceService.listOccurrences(user.id));
    } catch (error) {
      showAlert('Erro', error instanceof Error ? error.message : 'Falha ao carregar ocorrências.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <Screen
      title="Ocorrências"
      subtitle="CRUD completo: criar, listar, editar e excluir registros de alagamento."
    >
      <PrimaryButton label="Nova ocorrência" onPress={() => router.push('/(app)/occurrences/new')} />
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Card>
              <Text style={styles.empty}>Nenhuma ocorrência ainda. Registre o primeiro alagamento.</Text>
            </Card>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={() => router.push(`/(app)/occurrences/${item.id}`)}
            >
              <Card>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.neighborhood} · {item.waterLevelCm} cm · {item.status}
                </Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {item.description}
                </Text>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
  },
  desc: {
    color: colors.textMuted,
  },
});
