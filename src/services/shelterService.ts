import { USE_MOCK_APIS } from '@/constants/config';
import { javaApi } from '@/services/apiClient';
import { mockShelters } from '@/services/mockData';
import type { Shelter } from '@/types/models';

export async function listShelters(): Promise<Shelter[]> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.get<Shelter[]>('/abrigos');
    return data;
  }
  return mockShelters;
}
