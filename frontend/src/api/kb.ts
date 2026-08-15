import { apiClient } from './client';
import type { KnowledgeBase } from '../types';
import type { BackendResponse } from './auth';

export interface CreateKBPayload {
  name: string;
  description?: string;
}

export const kbApi = {
  async getKBs(): Promise<KnowledgeBase[]> {
    const response = await apiClient.get<BackendResponse<KnowledgeBase[]>>('/kb/');
    return response.data.data;
  },

  async createKB(payload: CreateKBPayload): Promise<KnowledgeBase> {
    const response = await apiClient.post<BackendResponse<KnowledgeBase>>('/kb/', {
      name: payload.name,
      description: payload.description,
    });
    return response.data.data;
  },

  async getKB(kbId: string | number): Promise<KnowledgeBase> {
    const response = await apiClient.get<BackendResponse<KnowledgeBase>>(`/kb/${kbId}`);
    return response.data.data;
  },

  async updateKB(kbId: string | number, payload: CreateKBPayload): Promise<KnowledgeBase> {
    const response = await apiClient.put<BackendResponse<KnowledgeBase>>(`/kb/${kbId}`, {
      name: payload.name,
      description: payload.description,
    });
    return response.data.data;
  },

  async deleteKB(kbId: string | number): Promise<void> {
    await apiClient.delete<BackendResponse<unknown>>(`/kb/${kbId}`);
  }
};
