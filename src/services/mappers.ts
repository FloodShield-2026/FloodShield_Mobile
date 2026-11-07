import type { ActionPlan, Occurrence, Shelter, User } from '@/types/models';

type JavaUser = {
  id: number | string;
  name: string;
  email: string;
  role: 'CIDADAO' | 'GESTOR';
};

type JavaOccurrence = {
  id: number | string;
  title: string;
  description: string;
  neighborhood: string;
  waterLevelCm: number;
  latitude?: number | null;
  longitude?: number | null;
  status: Occurrence['status'];
  userId: number | string;
  createdAt: string;
};

type JavaShelter = {
  id: number | string;
  name: string;
  address: string;
  neighborhood?: string;
  latitude?: number | null;
  longitude?: number | null;
  availableSlots: number;
  open: boolean;
  distanceKm?: number | null;
  matchedNeighborhood?: boolean;
};

type JavaActionPlan = {
  occurrenceId?: number | string | null;
  summary: string;
  steps: string[];
  shelterName?: string;
  generatedAt: string;
};

type JavaPage<T> = {
  content: T[];
};

export function mapUser(user: JavaUser): User {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function mapOccurrence(item: JavaOccurrence): Occurrence {
  return {
    id: String(item.id),
    title: item.title,
    description: item.description,
    neighborhood: item.neighborhood,
    waterLevelCm: item.waterLevelCm,
    latitude: item.latitude ?? undefined,
    longitude: item.longitude ?? undefined,
    status: item.status,
    userId: String(item.userId),
    createdAt: item.createdAt,
  };
}

export function mapOccurrencePage(data: JavaPage<JavaOccurrence> | JavaOccurrence[]): Occurrence[] {
  const items = Array.isArray(data) ? data : data.content ?? [];
  return items.map(mapOccurrence);
}

export function mapShelter(item: JavaShelter): Shelter {
  return {
    id: String(item.id),
    name: item.name,
    address: item.address,
    neighborhood: item.neighborhood ?? '',
    latitude: item.latitude ?? undefined,
    longitude: item.longitude ?? undefined,
    availableSlots: item.availableSlots,
    open: item.open,
    distanceKm: item.distanceKm ?? undefined,
    matchedNeighborhood: item.matchedNeighborhood ?? false,
  };
}

export function mapActionPlan(item: JavaActionPlan): ActionPlan {
  return {
    occurrenceId: item.occurrenceId != null ? String(item.occurrenceId) : '',
    summary: item.summary,
    steps: item.steps ?? [],
    shelterName: item.shelterName,
    generatedAt: item.generatedAt,
  };
}
