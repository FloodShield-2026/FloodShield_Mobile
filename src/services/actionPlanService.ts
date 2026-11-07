import { USE_MOCK_APIS } from '@/constants/config';
import { javaApi } from '@/services/apiClient';
import { mapActionPlan } from '@/services/mappers';
import { mockShelters } from '@/services/mockData';
import type { ActionPlan, Occurrence } from '@/types/models';

export async function generateActionPlan(occurrence: Occurrence): Promise<ActionPlan> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.post('/ai/plano-acao', {
      occurrenceId: Number(occurrence.id),
      waterLevelCm: occurrence.waterLevelCm,
      neighborhood: occurrence.neighborhood,
    });
    return mapActionPlan(data);
  }

  const openShelter = mockShelters.find((s) => s.open);
  const critical = occurrence.waterLevelCm >= 40;

  return {
    occurrenceId: occurrence.id,
    summary: critical
      ? 'Nível crítico na sua região. Priorize sair com segurança e se dirigir ao abrigo indicado.'
      : 'Monitore a rua e prepare documentos e kit básico. Evite áreas alagadas.',
    steps: critical
      ? [
          'Desligue a energia se a água estiver entrando em casa.',
          'Leve documentos, remédios e um carregador.',
          `Dirija-se ao abrigo: ${openShelter?.name ?? 'ponto de apoio mais próximo'}.`,
          'Avise familiares e registre o check-in no app.',
        ]
      : [
          'Suba itens essenciais para lugares altos.',
          'Evite atravessar a rua com correnteza.',
          'Acompanhe novos alertas no FloodShield.',
          'Se a água passar de 40 cm, abra um pedido de ajuda.',
        ],
    shelterName: openShelter?.name,
    generatedAt: new Date().toISOString(),
  };
}
