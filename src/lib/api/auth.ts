import apiClient from './client';
import { LoginRequest, RegisterRequest, WebResponse } from '@/types/api';

export const authApi = {
  login: async (data: LoginRequest): Promise<WebResponse<string>> => {
    return apiClient.post('/auth/login', data);
  },

  register: async (data: RegisterRequest): Promise<WebResponse<void>> => {
    return apiClient.post('/auth/register', data);
  },

  logout: async (): Promise<WebResponse<string>> => {
    return apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<WebResponse<string>> => {
    return apiClient.post('/auth/refresh');
  },
};
