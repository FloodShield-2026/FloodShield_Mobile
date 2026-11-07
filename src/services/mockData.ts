import type { Occurrence, Shelter, User } from '@/types/models';

export const mockShelters: Shelter[] = [
  {
    id: 's1',
    name: 'Escola Municipal Penha',
    address: 'Rua Padre Antônio Vieira, 120 — Penha',
    availableSlots: 84,
    open: true,
  },
  {
    id: 's2',
    name: 'GINÁSIO Itaquera',
    address: 'Av. Itaquera, 5500 — Itaquera',
    availableSlots: 210,
    open: true,
  },
  {
    id: 's3',
    name: 'Centro Comunitário Jardim Pantanal',
    address: 'Rua das Hortênsias, 45 — Jardim Pantanal',
    availableSlots: 36,
    open: false,
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
