import api from './client';
import type { Status } from '../types';

export const statusesApi = {
  getAll: async (): Promise<Status[]> => {
    const response = await api.get('/statuses');
    return response.data;
  },

  create: async (data: Omit<Status, 'id'>): Promise<Status> => {
    const response = await api.post('/statuses', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<Status, 'id'>>): Promise<Status> => {
    const response = await api.patch(`/statuses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/statuses/${id}`);
  }
};
