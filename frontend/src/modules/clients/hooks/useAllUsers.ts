import { useState, useEffect } from 'react';
import { getAllClients } from '../services/client.services';

export default function useAllClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    getAllClients(abortController.signal)
      .then((clients) => setClients(clients))
      .catch((error) => {
        setError(error.message);
        setClients([]);
      })
      .finally(() => setLoading(false));
    return () => abortController.abort();
  }, []);

  return { clients, loading, error };
}
