import { USE_MOCK_APIS } from '@/constants/config';
import { javaApi } from '@/services/apiClient';
import { mapShelter } from '@/services/mappers';
import { mockShelters } from '@/services/mockData';
import type { Shelter } from '@/types/models';

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

export type ShelterQuery = {
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
};

function filterMock(query?: ShelterQuery): Shelter[] {
  const q = query?.neighborhood?.trim().toLowerCase();
  if (!q) {
    return mockShelters;
  }
  const matches = mockShelters.filter(
    (item) =>
      item.neighborhood.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q),
  );
  if (matches.length === 0) {
    return mockShelters.map((item) => ({ ...item, matchedNeighborhood: false }));
  }
  const matchedIds = new Set(matches.map((item) => item.id));
  return [...mockShelters]
    .sort((a, b) => Number(matchedIds.has(b.id)) - Number(matchedIds.has(a.id)))
    .map((item) => ({
      ...item,
      matchedNeighborhood: matchedIds.has(item.id),
      distanceKm: matchedIds.has(item.id) ? 0.3 : 4.2,
    }));
}

export async function listShelters(query?: ShelterQuery): Promise<Shelter[]> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.get<JavaShelter[]>('/abrigos', {
      params: {
        bairro: query?.neighborhood?.trim() || undefined,
        lat: query?.latitude,
        lng: query?.longitude,
      },
    });
    return data.map(mapShelter);
  }
  return filterMock(query);
}
