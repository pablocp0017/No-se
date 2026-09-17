/** Utilidades de fecha en formato ISO (YYYY-MM-DD), usadas para navegar entre días de registro. */

export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function sumarDias(fechaISO: string, delta: number): string {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  fecha.setDate(fecha.getDate() + delta);
  return fecha.toISOString().slice(0, 10);
}

export function esHoy(fechaISO: string): boolean {
  return fechaISO === hoyISO();
}

export function esAyer(fechaISO: string): boolean {
  return fechaISO === sumarDias(hoyISO(), -1);
}

export function formatearFechaLarga(fechaISO: string): string {
  if (esHoy(fechaISO)) return 'Hoy';
  if (esAyer(fechaISO)) return 'Ayer';
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const texto = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
