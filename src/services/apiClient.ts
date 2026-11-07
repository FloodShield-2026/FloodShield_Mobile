import axios, { type InternalAxiosRequestConfig } from 'axios';
import { DOTNET_API_URL, JAVA_API_URL } from '@/constants/config';
import { tokenStorage } from '@/services/storage';

async function attachAuth(config: InternalAxiosRequestConfig) {
  const token = await tokenStorage.get();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}

export const javaApi = axios.create({
  baseURL: JAVA_API_URL || undefined,
  timeout: 15000,
});

export const dotnetApi = axios.create({
  baseURL: DOTNET_API_URL || undefined,
  timeout: 15000,
});

javaApi.interceptors.request.use(attachAuth);
dotnetApi.interceptors.request.use(attachAuth);
