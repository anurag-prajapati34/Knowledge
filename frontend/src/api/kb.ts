import { apiClient } from './client';
import type { KnowledgeBase } from '../types';
import type { BackendResponse } from './auth';

export interface CreateKBPayload {
  name: string;
}

export const kbApi = {
  async getKBs(): Promise<KnowledgeBase[]> {
    const response = await apiClient.get<BackendResponse<KnowledgeBase[]>>('/kb/');
    return response.data.data;
  },

  async createKB(payload: CreateKBPayload): Promise<KnowledgeBase> {
    const response = await apiClient.post<BackendResponse<KnowledgeBase>>('/kb/', {
      name: payload.name,
    });
    return response.data.data;
  },

  async getKB(kbId: string | number): Promise<KnowledgeBase> {
    // Note: Backend does not have a GET /kb/{id} endpoint.
    // Fetch all KBs for user and find by ID.
    const kbs = await this.getKBs();
    const found = kbs.find((kb) => String(kb.id) === String(kbId));
    if (!found) {
      throw new Error(`Knowledge Base with ID ${kbId} not found.`);
    }
    return found;
  },

  async deleteKB(_kbId: string | number): Promise<void> {
    // Note: Backend does not currently support deleting a KB.
    throw new Error('Deleting a Knowledge Base is not supported by the backend.');
  }
};

