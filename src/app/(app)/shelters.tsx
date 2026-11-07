import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import * as shelterService from '@/services/shelterService';
import type { Shelter } from '@/types/models';
import { showAlert } from '@/utils/alert';
import { colors, spacing } from '@/theme/colors';

export default function SheltersScreen() {
  const [neighborhood, setNeighborhood] = useState('Penha');
  const [activeQuery, setActiveQuery] = useState('Penha');
  const [items, setItems] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const load = useCallback(async (bairro?: string) => {
    const query = bairro?.trim() ? { neighborhood: bairro.trim() } : undefined;
    setItems(await shelterService.listShelters(query));
    setActiveQuery(bairro?.trim() ?? '');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await load('Penha');
      } catch (error) {
        showAlert('Erro', error instanceof Error ? error.message : 'Falha ao carregar abrigos.');
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  async function handleSearch() {
    if (!neighborhood.trim()) {
      showAlert('Bairro', 'Digite um bairro da Zona Leste para localizar abrigos próximos.');
      return;
    }
    try {
      setSearching(true);
      await load(neighborhood);
    } catch (error) {
      showAlert('Erro', error instanceof Error ? error.message : 'Falha ao buscar abrigos.');
    } finally {
      setSearching(false);
    }
  }

  async function handleClear() {
    setNeighborhood('');
    try {
      setSearching(true);
      await load();
    } catch (error) {
      showAlert('Erro', error instanceof Error ? error.message : 'Falha ao listar abrigos.');
    } finally {
      setSearching(false);
    }
  }

  return (
    <Screen
      title="Abrigos"
      subtitle="Digite o bairro e a API ordena os pontos de apoio mais próximos."
    >
      <View style={styles.searchBox}>
        <TextField
          label="Seu bairro"
          placeholder="Ex.: Penha, Itaquera, Tatuapé"
          value={neighborhood}
          onChangeText={setNeighborhood}
          autoCapitalize="words"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <PrimaryButton label="Buscar próximos" loading={searching} onPress={handleSearch} />
        <PrimaryButton label="Ver todos" variant="ghost" onPress={handleClear} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum abrigo encontrado para esse bairro.</Text>
          }
          ListHeaderComponent={
            activeQuery ? (
              <Text style={styles.hint}>
                Resultado para “{activeQuery}”: bairros iguais primeiro, depois os mais perto.
              </Text>
            ) : undefined
          }
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                {item.matchedNeighborhood ? <Text style={styles.match}>No bairro</Text> : null}
              </View>
              <Text style={styles.address}>
                {item.address}
                {item.neighborhood ? ` — ${item.neighborhood}` : ''}
              </Text>
              <Text style={[styles.badge, item.open ? styles.open : styles.closed]}>
                {item.open ? `Aberto · ${item.availableSlots} vagas` : 'Temporariamente fechado'}
                {item.distanceKm != null ? ` · ~${item.distanceKm.toFixed(1)} km` : ''}
              </Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    gap: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  empty: {
    color: colors.textDim,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    alignItems: 'center',
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  match: {
    color: colors.background,
    backgroundColor: colors.accent,
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: '800',
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
