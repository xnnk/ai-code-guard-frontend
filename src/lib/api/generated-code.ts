import apiClient from './client';
import { WebResponse, GeneratedCodeDocument } from '@/types/api';

export const generatedCodeApi = {
  getCodeList: async (): Promise<WebResponse<GeneratedCodeDocument[]>> => {
    return apiClient.get('/generated-code/list');
  },

  getCodeDetail: async (codeId: string): Promise<WebResponse<GeneratedCodeDocument>> => {
    return apiClient.get(`/generated-code/${codeId}`);
  },

  deleteCode: async (codeId: string): Promise<WebResponse<string>> => {
    return apiClient.delete(`/generated-code/${codeId}`);
  },
};
