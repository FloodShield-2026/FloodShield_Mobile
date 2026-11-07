export type UserRole = 'CIDADAO' | 'GESTOR';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type OccurrenceStatus = 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA';

export type Occurrence = {
  id: string;
  title: string;
  description: string;
  neighborhood: string;
  waterLevelCm: number;
  latitude?: number;
  longitude?: number;
  status: OccurrenceStatus;
  createdAt: string;
  userId: string;
};

export type Shelter = {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  latitude?: number;
  longitude?: number;
  availableSlots: number;
  open: boolean;
  distanceKm?: number;
  matchedNeighborhood?: boolean;
};

export type ActionPlan = {
  occurrenceId: string;
  summary: string;
  steps: string[];
  shelterName?: string;
  generatedAt: string;
};

export type CheckInPayload = {
  status: 'SEGURO' | 'PRECISO_AJUDA';
  message?: string;
  latitude?: number;
  longitude?: number;
  idempotencyKey: string;
};

export type CheckInResponse = {
  id: string;
  status: 'SEGURO' | 'PRECISO_AJUDA';
  createdAt: string;
  duplicated: boolean;
};
