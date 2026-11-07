import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'floodshield.token';
const USER_KEY = 'floodshield.user';

async function setSecure(key: string, value: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getSecure(key: string) {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteSecure(key: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const tokenStorage = {
  get: () => getSecure(TOKEN_KEY),
  set: (token: string) => setSecure(TOKEN_KEY, token),
  clear: () => deleteSecure(TOKEN_KEY),
};

export const userStorage = {
  get: () => AsyncStorage.getItem(USER_KEY),
  set: (value: string) => AsyncStorage.setItem(USER_KEY, value),
  clear: () => AsyncStorage.removeItem(USER_KEY),
};
