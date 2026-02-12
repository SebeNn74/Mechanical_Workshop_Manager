const BACK_URL = import.meta.env.VITE_BACKEND_URL

export async function getAllClients(signal: AbortSignal) {
    const res = await fetch(`${BACK_URL}/clients`, { signal });
    if (!res.ok) throw new Error('Error al obtener clientes');
    return res.json();
}