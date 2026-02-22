import { api } from '@/shared/api/api';
import { CreateClientInput, DuplicateClientCheck, UpdateClientInput } from '../types/client.types';

const ROUTE = '/clients';

export const postClient = async (data: CreateClientInput) => {
  const res = await api.post(`${ROUTE}/`, data);
  return res;
};

export const checkDuplicateClient = async (data: DuplicateClientCheck) => {
  const res = await api.post(`${ROUTE}/check-duplicate`, data);
  return res;
};

export const getClients = async () => {
  const res = await api.get(`${ROUTE}/`);
  return res;
};

export const patchClient = async (id: number, data: UpdateClientInput) => {
  const res = await api.patch(`${ROUTE}/${id}`, data);
  return res;
}