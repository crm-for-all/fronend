import api from './client';
import type { OverviewStats, TimeSeriesResponse, TimePeriod } from '../types';

export const statsApi = {
  getOverview: async (): Promise<OverviewStats> => {
    const response = await api.get('/customers/stats/overview');
    return response.data;
  },

  getTimeSeries: async (period?: TimePeriod): Promise<TimeSeriesResponse> => {
    const response = await api.get('/customers/stats/time-series', { params: { period } });
    return response.data;
  }
};
