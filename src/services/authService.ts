import AsyncStorage from '@react-native-async-storage/async-storage';
import { USE_MOCK_APIS } from '@/constants/config';
import { javaApi } from '@/services/apiClient';
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

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (!USE_MOCK_APIS) {
    const { data } = await javaApi.post<AuthResponse>('/auth/login', { email, password });
    return data;
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
    const { data } = await javaApi.post<AuthResponse>('/auth/register', input);
    return data;
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
