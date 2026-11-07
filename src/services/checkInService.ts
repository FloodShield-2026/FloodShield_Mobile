import AsyncStorage from '@react-native-async-storage/async-storage';
import { DOTNET_API_URL, USE_MOCK_APIS } from '@/constants/config';
import { dotnetApi } from '@/services/apiClient';
import type { CheckInPayload, CheckInResponse } from '@/types/models';

const KEY = 'floodshield.mock.checkins';

type StoredCheckIn = CheckInResponse & { idempotencyKey: string };

export async function submitCheckIn(payload: CheckInPayload): Promise<CheckInResponse> {
  if (!USE_MOCK_APIS && DOTNET_API_URL) {
    const { data } = await dotnetApi.post<CheckInResponse>('/checkins', payload, {
      headers: { 'Idempotency-Key': payload.idempotencyKey },
    });
    return data;
  }

  const raw = await AsyncStorage.getItem(KEY);
  const items: StoredCheckIn[] = raw ? (JSON.parse(raw) as StoredCheckIn[]) : [];
  const existing = items.find((item) => item.idempotencyKey === payload.idempotencyKey);
  if (existing) {
    return { ...existing, duplicated: true };
  }

  const created: StoredCheckIn = {
    id: `c-${Date.now()}`,
    status: payload.status,
    createdAt: new Date().toISOString(),
    duplicated: false,
    idempotencyKey: payload.idempotencyKey,
  };
  await AsyncStorage.setItem(KEY, JSON.stringify([created, ...items]));
  return created;
}
