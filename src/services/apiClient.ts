import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { DOTNET_API_URL, JAVA_API_URL } from '@/constants/config';
import { tokenStorage } from '@/services/storage';

async function attachAuth(config: InternalAxiosRequestConfig) {
  const token = await tokenStorage.get();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}

function toUsefulError(error: AxiosError<{ message?: string }>) {
  const apiMessage = error.response?.data?.message;
  if (apiMessage) {
    return Promise.reject(new Error(apiMessage));
  }
  if (error.code === 'ERR_NETWORK') {
    return Promise.reject(
      new Error('Network Error: API Java fora do ar ou URL errada (localhost:8080).'),
    );
  }
  return Promise.reject(error);
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
javaApi.interceptors.response.use((response) => response, toUsefulError);
dotnetApi.interceptors.response.use((response) => response, toUsefulError);
