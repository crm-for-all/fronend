import api from './client';
import type { Customer, CustomerCreateDTO, CustomerUpdateDTO, CustomerFilters } from '../types';

export const customersApi = {
  getAll: async (filters?: CustomerFilters): Promise<Customer[]> => {
    const response = await api.get('/customers', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  export: async (filters?: CustomerFilters): Promise<Blob> => {
    const response = await api.get('/customers/export', { 
      params: filters, 
      responseType: 'blob' 
    });
    return response.data;
  },

  create: async (data: CustomerCreateDTO): Promise<Customer> => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  update: async (id: string, data: CustomerUpdateDTO): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  }
};
