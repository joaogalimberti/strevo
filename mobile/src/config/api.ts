import axios from 'axios';
import { Platform } from 'react-native';
import { useStore } from '../store/useStore';

export const API_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.18.9:3000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
