import apiClient from './client';
import { WebResponse, VulnerabilityReport, EnhancedCodeAnalysisResult } from '@/types/api';

export const codeSecurityApi = {
  scanCode: async (codeId: string): Promise<WebResponse<string>> => {
    return apiClient.post(`/code-security/scan/${codeId}`);
  },

  scanCodeEnhanced: async (codeId: string): Promise<WebResponse<EnhancedCodeAnalysisResult>> => {
    return apiClient.post(`/code-security/scan-enhanced/${codeId}`);
  },

  getScanResult: async (codeId: string): Promise<WebResponse<VulnerabilityReport>> => {
    return apiClient.get(`/code-security/result/${codeId}`);
  },
};
