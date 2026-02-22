import { useState } from 'react';
import { CreateClientInput, DuplicateClientCheck, UpdateClientInput } from '../types/client.types';
import { checkDuplicateClient, postClient, patchClient } from '../services/client.services';

export function useSubmitClient() {
  const [submitting, setSubmitting] = useState(false);

  const checkDuplicate = async (data: DuplicateClientCheck) => {
    try {
      const res = await checkDuplicateClient(data);
      return { success: true, exists: res.data.exist };
    } catch (err) {
      if (err instanceof Error) {
        return { success: false, exists: false, error: err.message };
      }
      return { success: false, exists: false, error: 'Error desconocido' };
    }
  };

  const createClient = async (data: CreateClientInput) => {
    setSubmitting(true);
    try {
      await postClient(data);
      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'Error desconocido' };
    } finally {
      setSubmitting(false);
    }
  };

  const updateClient = async (id: number, data: UpdateClientInput) => {
    setSubmitting(true);
    try {
      await patchClient(id, data);
      return { success: true };
    } catch (err) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'Error desconocido' };
    } finally {
      setSubmitting(false);
    }
  };

  return { checkDuplicate, createClient, updateClient, submitting };
}
