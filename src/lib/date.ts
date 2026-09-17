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

/** Lunes de la semana (ISO 8601, semana empieza en lunes) que contiene fechaISO. */
export function inicioDeSemana(fechaISO: string): string {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const diaSemana = fecha.getDay(); // 0 = domingo, 1 = lunes, ...
  const offsetHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  return sumarDias(fechaISO, offsetHastaLunes);
}

/** Los 7 días (lunes a domingo) de la semana que contiene fechaISO. */
export function diasDeSemana(fechaISO: string): string[] {
  const lunes = inicioDeSemana(fechaISO);
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}

const INICIALES_DIA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export function inicialDia(fechaISO: string): string {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const diaSemana = fecha.getDay();
  return INICIALES_DIA[diaSemana === 0 ? 6 : diaSemana - 1];
}

export function numeroDia(fechaISO: string): number {
  return new Date(`${fechaISO}T00:00:00`).getDate();
}

export function esFuturo(fechaISO: string): boolean {
  return fechaISO > hoyISO();
}
