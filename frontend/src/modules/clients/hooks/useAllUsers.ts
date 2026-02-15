import { useState, useEffect, useCallback } from 'react';
import { getClients } from '../services/client.services';

export default function useAllClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getClients();
      setClients(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'CanceledError') {
        setError(err.message ?? 'Error al cargar clientes');
        setClients([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
}
