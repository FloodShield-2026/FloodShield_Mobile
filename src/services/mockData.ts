import type { Occurrence, Shelter, User } from '@/types/models';

export const mockShelters: Shelter[] = [
  {
    id: 's1',
    name: 'Escola Municipal Penha',
    address: 'Rua Padre Antônio Vieira, 120',
    neighborhood: 'Penha',
    latitude: -23.5225,
    longitude: -46.5421,
    availableSlots: 84,
    open: true,
  },
  {
    id: 's2',
    name: 'GINÁSIO Itaquera',
    address: 'Av. Itaquera, 5500',
    neighborhood: 'Itaquera',
    latitude: -23.5401,
    longitude: -46.4712,
    availableSlots: 210,
    open: true,
  },
  {
    id: 's3',
    name: 'Centro Comunitário Jardim Pantanal',
    address: 'Rua das Hortênsias, 45',
    neighborhood: 'Jardim Pantanal',
    latitude: -23.4978,
    longitude: -46.4015,
    availableSlots: 36,
    open: false,
  },
  {
    id: 's4',
    name: 'CEEJA São Mateus',
    address: 'Av. Mateo Bei, 2888',
    neighborhood: 'São Mateus',
    latitude: -23.5984,
    longitude: -46.4819,
    availableSlots: 120,
    open: true,
  },
  {
    id: 's5',
    name: 'Centro Esportivo Tatuapé',
    address: 'Rua Serra de Botucatu, 885',
    neighborhood: 'Tatuapé',
    latitude: -23.5408,
    longitude: -46.5765,
    availableSlots: 95,
    open: true,
  },
];

export const seedOccurrences = (userId: string): Occurrence[] => [
  {
    id: 'o1',
    title: 'Água na calçada da Carvalho Pinto',
    description: 'Nível subindo rápido após 40 minutos de chuva forte.',
    neighborhood: 'Penha',
    waterLevelCm: 42,
    status: 'ABERTA',
    createdAt: new Date().toISOString(),
    userId,
  },
];

export const demoUser: User = {
  id: 'u-demo',
  name: 'Cidadão Demo',
  email: 'cidadao@floodshield.app',
  role: 'CIDADAO',
};
