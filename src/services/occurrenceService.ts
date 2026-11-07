import AsyncStorage from '@react-native-async-storage/async-storage';
import { USE_MOCK_APIS } from '@/constants/config';
import { javaApi } from '@/services/apiClient';
import { seedOccurrences } from '@/services/mockData';
import type { Occurrence, OccurrenceStatus } from '@/types/models';

const KEY = 'floodshield.mock.occurrences';

async function readAll(userId: string): Promise<Occurrence[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    const seed = seedOccurrences(userId);
    await AsyncStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as Occurrence[];
}

async function writeAll(items: Occurrence[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function listOccurrences(userId: string): Promise<Occurrence[]> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.get<Occurrence[]>('/ocorrencias');
    return data;
  }
  const all = await readAll(userId);
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOccurrence(id: string, userId: string): Promise<Occurrence | undefined> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.get<Occurrence>(`/ocorrencias/${id}`);
    return data;
  }
  return (await readAll(userId)).find((item) => item.id === id);
}

export async function createOccurrence(
  userId: string,
  input: Omit<Occurrence, 'id' | 'createdAt' | 'userId' | 'status'> & {
    status?: OccurrenceStatus;
  },
): Promise<Occurrence> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.post<Occurrence>('/ocorrencias', input);
    return data;
  }

  const all = await readAll(userId);
  const created: Occurrence = {
    id: `o-${Date.now()}`,
    createdAt: new Date().toISOString(),
    userId,
    status: input.status ?? 'ABERTA',
    title: input.title,
    description: input.description,
    neighborhood: input.neighborhood,
    waterLevelCm: input.waterLevelCm,
    latitude: input.latitude,
    longitude: input.longitude,
  };
  await writeAll([created, ...all]);
  return created;
}

export async function updateOccurrence(
  userId: string,
  id: string,
  patch: Partial<Occurrence>,
): Promise<Occurrence> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.put<Occurrence>(`/ocorrencias/${id}`, patch);
    return data;
  }

  const all = await readAll(userId);
  const index = all.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new Error('Ocorrência não encontrada.');
  }
  const updated = { ...all[index], ...patch, id };
  all[index] = updated;
  await writeAll(all);
  return updated;
}

export async function deleteOccurrence(userId: string, id: string): Promise<void> {
  if (!USE_MOCK_APIS) {
    await javaApi.delete(`/ocorrencias/${id}`);
    return;
  }
  const all = await readAll(userId);
  await writeAll(all.filter((item) => item.id !== id));
}
