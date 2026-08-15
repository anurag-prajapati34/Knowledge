import { apiClient } from './client';
import type { Document } from '../types';

export const documentsApi = {
  async getDocuments(kbId: string | number): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(`/kb/${kbId}/documents`);
    return response.data;
  },

  async uploadDocument(kbId: string | number, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<Document>(`/kb/${kbId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteDocument(kbId: string | number, docId: string | number): Promise<void> {
    await apiClient.delete(`/kb/${kbId}/documents/${docId}`);
  }
};
