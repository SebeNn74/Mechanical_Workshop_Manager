import { api } from '@/shared/api/api';
import { CreateClientInput, DuplicateClientCheck } from '../types/client.types';

const ROUTE = '/clients';

export const postClient = async (
  data: CreateClientInput,
  signal?: AbortSignal,
) => {
  const res = await api.post(`${ROUTE}/`, data, { signal });
  return res;
};

export const checkDuplicateClient = async (
  data: DuplicateClientCheck,
  signal?: AbortSignal,
) => {
  const res = await api.post(`${ROUTE}/check-duplicate`, data, { signal });
  return res;
};

export const getClients = async (signal?: AbortSignal) => {
  const res = await api.get(`${ROUTE}/`, { signal });
  return res;
};
