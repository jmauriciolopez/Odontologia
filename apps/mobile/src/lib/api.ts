import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// En desarrollo con emulador Android, localhost es 10.0.2.2
// Para iOS o dispositivo físico, usar la IP de la máquina
const API_URL = 'http://10.0.2.2:3000/api/v1/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
