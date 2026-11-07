import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import * as shelterService from '@/services/shelterService';
import type { Shelter } from '@/types/models';
import { showAlert } from '@/utils/alert';
import { colors, spacing } from '@/theme/colors';

export default function SheltersScreen() {
  const [items, setItems] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setItems(await shelterService.listShelters());
      } catch (error) {
        showAlert('Erro', error instanceof Error ? error.message : 'Falha ao carregar abrigos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Screen title="Abrigos" subtitle="Pontos de apoio abertos para a população.">
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              <Text style={[styles.badge, item.open ? styles.open : styles.closed]}>
                {item.open ? `Aberto · ${item.availableSlots} vagas` : 'Temporariamente fechado'}
              </Text>
            </Card>
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
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  address: {
    color: colors.textMuted,
  },
  badge: {
    marginTop: 4,
    fontWeight: '700',
    fontSize: 12,
  },
  open: {
    color: colors.success,
  },
  closed: {
    color: colors.warning,
  },
});
