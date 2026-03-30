import api from './client';
import type { Tag } from '../types';

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get('/tags');
    return response.data;
  },

  create: async (data: Omit<Tag, 'id'>): Promise<Tag> => {
    const response = await api.post('/tags', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<Tag, 'id'>>): Promise<Tag> => {
    const response = await api.patch(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  }
};
