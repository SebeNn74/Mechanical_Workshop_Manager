export function formatDate(dateInput: Date) {
  const date = new Date(dateInput);

  return date.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // formato 24 horas
  });
}
