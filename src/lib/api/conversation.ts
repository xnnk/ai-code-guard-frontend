import apiClient from './client';
import { WebResponse } from '@/types/api';

export interface CreateConversationRequest {
  modelType?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  message: string;
}

export interface Conversation {
  id: string;
  userId: string;
  modelType: string;
  messages: ConversationMessage[];
  createdAt: number;
  lastUpdatedAt: number;
}

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const conversationApi = {
  createConversation: async (
    data: CreateConversationRequest
  ): Promise<WebResponse<{ conversationId: string; modelType: string }>> => {
    return apiClient.post('/conversation/create', data);
  },

  sendMessage: async (
    data: SendMessageRequest
  ): Promise<WebResponse<{ reply: string; conversationId: string }>> => {
    return apiClient.post('/conversation/send', data);
  },

  getConversationHistory: async (
    userId: number,
    conversationId: string
  ): Promise<WebResponse<Conversation>> => {
    return apiClient.get(`/conversation/${userId}/${conversationId}`);
  },

  endConversation: async (
    userId: number,
    conversationId: string
  ): Promise<WebResponse<string>> => {
    return apiClient.delete(`/conversation/${userId}/${conversationId}`);
  },
};
