import { api } from '@/shared/api/api';

const ROUTE = '/clients';

export const getClients = async (signal?: AbortSignal) => {
  const res = await api.get(`${ROUTE}/`, { signal });
  return res;
};
