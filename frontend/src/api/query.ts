import { apiClient } from './client';
import type { QueryResponse, SourceCitation } from '../types';
import type { BackendResponse } from './auth';

export const queryApi = {
  async askQuestion(kbId: string | number, question: string): Promise<QueryResponse> {
    const response = await apiClient.post<BackendResponse<any>>(`/kb/${kbId}/query`, {
      prompt: question,
    });
    
    const data = response.data.data;

    if (typeof data === 'string') {
      return {
        answer: data,
        sources: [],
      };
    }

    if (data && typeof data === 'object') {
      return {
        answer: data.answer || '',
        sources: (data.sources as SourceCitation[]) || [],
      };
    }

    return {
      answer: String(data || ''),
      sources: [],
    };
  }
};

