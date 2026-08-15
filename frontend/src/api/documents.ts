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

  async deleteDocument(_kbId: string | number, _docId: string | number): Promise<void> {
    // Note: Backend does not currently support deleting a document.
    throw new Error('Deleting a document is not supported by the backend.');
  }
};

