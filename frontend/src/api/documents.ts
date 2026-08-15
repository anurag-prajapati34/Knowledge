import { apiClient } from './client';
import type { Document } from '../types';
import type { BackendResponse } from './auth';

export const documentsApi = {
  async getDocuments(kbId: string | number): Promise<Document[]> {
    const response = await apiClient.get<BackendResponse<Document[]>>(`/kb/${kbId}/documents`);
    return response.data.data;
  },

  async uploadDocument(kbId: string | number, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<BackendResponse<Document>>(`/kb/${kbId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async getDocumentStatus(kbId: string | number, docId: string | number): Promise<Document> {
    const response = await apiClient.get<BackendResponse<Document>>(`/kb/${kbId}/documents/${docId}`);
    return response.data.data;
  },

  async deleteDocument(kbId: string | number, docId: string | number): Promise<void> {
    await apiClient.delete<BackendResponse<unknown>>(`/kb/${kbId}/documents/${docId}`);
  }
};
