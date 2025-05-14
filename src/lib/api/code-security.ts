import apiClient from './client';
import { WebResponse, VulnerabilityReport } from '@/types/api';

export const codeSecurityApi = {
  scanCode: async (codeId: string): Promise<WebResponse<string>> => {
    return apiClient.post(`/code-security/scan/${codeId}`);
  },

  getScanResult: async (codeId: string): Promise<WebResponse<VulnerabilityReport>> => {
    return apiClient.get(`/code-security/result/${codeId}`);
  },
};
