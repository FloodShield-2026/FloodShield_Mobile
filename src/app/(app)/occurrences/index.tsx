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
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import * as occurrenceService from '@/services/occurrenceService';
import type { Occurrence } from '@/types/models';
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
    <Screen title="Ocorrências" subtitle="CRUD consumindo a API Java (mock local até o backend subir).">
      <PrimaryButton label="Nova ocorrência" onPress={() => router.push('/(app)/occurrences/new')} />
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma ocorrência ainda.</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/(app)/occurrences/${item.id}`)}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.neighborhood} · {item.waterLevelCm} cm · {item.status}
              </Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
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
