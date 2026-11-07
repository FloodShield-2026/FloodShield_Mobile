import { USE_MOCK_APIS } from '@/constants/config';
import { javaApi } from '@/services/apiClient';
import { mapShelter } from '@/services/mappers';
import { mockShelters } from '@/services/mockData';
import type { Shelter } from '@/types/models';

type JavaShelter = {
  id: number | string;
  name: string;
  address: string;
  availableSlots: number;
  open: boolean;
};

export async function listShelters(): Promise<Shelter[]> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.get<JavaShelter[]>('/abrigos');
    return data.map(mapShelter);
  }
  return mockShelters;
}
