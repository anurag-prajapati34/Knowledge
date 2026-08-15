import { apiClient } from './client';
import type { QueryResponse } from '../types';

export const queryApi = {
  async askQuestion(kbId: string | number, question: string): Promise<QueryResponse> {
    const response = await apiClient.post<QueryResponse>(`/kb/${kbId}/query`, { question });
    return response.data;
  }
};
