import AsyncStorage from '@react-native-async-storage/async-storage';
import { USE_MOCK_APIS } from '@/constants/config';
import { javaApi } from '@/services/apiClient';
import { mapUser } from '@/services/mappers';
import { demoUser } from '@/services/mockData';
import type { AuthResponse, User } from '@/types/models';

const USERS_KEY = 'floodshield.mock.users';

type StoredUser = User & { password: string };

const DEMO: StoredUser = { ...demoUser, password: '123456' };

async function readUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([DEMO]));
    return [DEMO];
  }

  const users = JSON.parse(raw) as StoredUser[];
  if (!users.some((u) => u.email.toLowerCase() === DEMO.email.toLowerCase())) {
    const next = [DEMO, ...users];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(next));
    return next;
  }
  return users;
}

async function writeUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

type JavaAuthResponse = {
  token: string;
  user: {
    id: number | string;
    name: string;
    email: string;
    role: 'CIDADAO' | 'GESTOR';
  };
};

function toAuth(data: JavaAuthResponse): AuthResponse {
  return {
    token: data.token,
    user: mapUser(data.user),
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (!USE_MOCK_APIS) {
    try {
      const { data } = await javaApi.post<JavaAuthResponse>('/auth/login', { email, password });
      return toAuth(data);
    } catch {
      throw new Error('E-mail ou senha inválidos, ou API Java indisponível.');
    }
  }

  const users = await readUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!found || found.password !== password) {
    throw new Error('E-mail ou senha inválidos.');
  }
  const { password: _password, ...user } = found;
  return { token: `mock-${user.id}`, user };
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  if (!USE_MOCK_APIS) {
    try {
      const { data } = await javaApi.post<JavaAuthResponse>('/auth/register', input);
      return toAuth(data);
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Não foi possível criar a conta.';
      throw new Error(message);
    }
  }

  const users = await readUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error('Já existe uma conta com este e-mail.');
  }

  const user: StoredUser = {
    id: `u-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: 'CIDADAO',
    password: input.password,
  };
  await writeUsers([...users, user]);
  const { password: _password, ...safe } = user;
  return { token: `mock-${safe.id}`, user: safe };
}
