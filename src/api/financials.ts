import api from './client';
import type { 
  Contract, 
  ContractCreateDTO, 
  ContractUpdateDTO, 
  Payment, 
  PaymentCreateDTO, 
  PaymentUpdateDTO,
  PaymentReportResponse
} from '../types';

export const financialsApi = {
  // Reports
  getPaymentsReport: async (params: {
    start_date?: string;
    end_date?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
  } = {}): Promise<PaymentReportResponse> => {
    const response = await api.get('/customers/payments/report', { params });
    return response.data;
  },

  // Contracts
  getContracts: async (customerId: string): Promise<Contract[]> => {
    const response = await api.get(`/customers/${customerId}/contracts`);
    return response.data;
  },

  getContract: async (contractId: string): Promise<Contract> => {
    const response = await api.get(`/contracts/${contractId}`);
    return response.data;
  },

  createContract: async (customerId: string, data: ContractCreateDTO): Promise<Contract> => {
    const response = await api.post(`/customers/${customerId}/contracts`, data);
    return response.data;
  },

  updateContract: async (contractId: string, data: ContractUpdateDTO): Promise<Contract> => {
    const response = await api.patch(`/contracts/${contractId}`, data);
    return response.data;
  },

  deleteContract: async (contractId: string): Promise<void> => {
    await api.delete(`/contracts/${contractId}`);
  },

  // Payments
  getPayments: async (contractId: string): Promise<Payment[]> => {
    const response = await api.get(`/contracts/${contractId}/payments`);
    return response.data;
  },

  createPayment: async (contractId: string, data: PaymentCreateDTO): Promise<Payment> => {
    const response = await api.post(`/contracts/${contractId}/payments`, data);
    return response.data;
  },

  updatePayment: async (paymentId: string, data: PaymentUpdateDTO): Promise<Payment> => {
    const response = await api.patch(`/payments/${paymentId}`, data);
    return response.data;
  },

  deletePayment: async (paymentId: string): Promise<void> => {
    await api.delete(`/payments/${paymentId}`);
  }
};
