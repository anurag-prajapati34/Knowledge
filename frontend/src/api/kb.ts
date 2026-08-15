import { apiClient } from './client';
import type { KnowledgeBase } from '../types';

export interface CreateKBPayload {
  name: string;
  description?: string;
}

export const kbApi = {
  async getKBs(): Promise<KnowledgeBase[]> {
    const response = await apiClient.get<KnowledgeBase[]>('/kb');
    return response.data;
  },

  async createKB(payload: CreateKBPayload): Promise<KnowledgeBase> {
    const response = await apiClient.post<KnowledgeBase>('/kb', payload);
    return response.data;
  },

  async getKB(kbId: string | number): Promise<KnowledgeBase> {
    const response = await apiClient.get<KnowledgeBase>(`/kb/${kbId}`);
    return response.data;
  },

  async deleteKB(kbId: string | number): Promise<void> {
    await apiClient.delete(`/kb/${kbId}`);
  }
};
