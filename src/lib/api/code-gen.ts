import apiClient from './client';
import { WebResponse, CodeGenerationRequest, CodeGenerationResponse } from '@/types/api';

export const codeGenApi = {
  generateCode: async (data: CodeGenerationRequest): Promise<WebResponse<CodeGenerationResponse>> => {
    return apiClient.post('/code-gen/generate', data);
  },

  getSupportedModels: async (): Promise<WebResponse<string[]>> => {
    return apiClient.get('/code-gen/models');
  },
};
