import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import * as shelterService from '@/services/shelterService';
import type { Shelter } from '@/types/models';
import { colors, spacing } from '@/theme/colors';

export default function SheltersScreen() {
  const [items, setItems] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setItems(await shelterService.listShelters());
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
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              <Text style={[styles.badge, item.open ? styles.open : styles.closed]}>
                {item.open ? `Aberto · ${item.availableSlots} vagas` : 'Temporariamente fechado'}
              </Text>
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
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
