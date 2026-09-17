import type { Perfil } from '@/types/nutrition';
import { calcularBMR, calcularTDEE, calcularMacroTargets, nivelActividadDesdeDias } from './energy';

/** Aproximación estándar usada en nutrición clínica: 1 kg de grasa corporal ≈ 7700 kcal. */
const KCAL_POR_KG_GRASA = 7700;

export interface TiempoObjetivo {
  deltaKg: number; // negativo si toca perder peso, positivo si toca ganarlo
  ritmoKgSemana: number;
  semanas: number;
  fechaEstimada: string; // ISO
}

/**
 * Estima cuánto tardarías en alcanzar tu peso objetivo al ritmo calórico actual
 * (el déficit/superávit que ya aplica el motor de macros según tu objetivo).
 * Es una aproximación: el ritmo real varía con la adherencia, el metabolismo y,
 * en ganancia muscular, con cuánto del superávit se traduce en músculo vs. grasa.
 */
export function estimarTiempoObjetivo(perfil: Perfil): TiempoObjetivo | null {
  if (perfil.objetivo === 'mantener' || perfil.pesoObjetivoKg == null) return null;

  const deltaKg = perfil.pesoObjetivoKg - perfil.pesoKg;
  if (Math.abs(deltaKg) < 0.1) return null;

  const bmr = calcularBMR(perfil.sexo, perfil.pesoKg, perfil.alturaCm, perfil.edad);
  const nivelActividad = nivelActividadDesdeDias(perfil.diasEjercicioSemana);
  const tdee = calcularTDEE(bmr, nivelActividad);
  const macros = calcularMacroTargets(
    perfil.sexo,
    perfil.pesoKg,
    perfil.alturaCm,
    perfil.edad,
    perfil.objetivo,
    perfil.diasEjercicioSemana
  );

  const diferenciaDiariaKcal = Math.abs(tdee - macros.kcal);
  const ritmoKgSemana = (diferenciaDiariaKcal * 7) / KCAL_POR_KG_GRASA;
  if (ritmoKgSemana <= 0) return null;

  const semanas = Math.abs(deltaKg) / ritmoKgSemana;
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + Math.round(semanas * 7));

  return { deltaKg, ritmoKgSemana, semanas, fechaEstimada: fecha.toISOString().slice(0, 10) };
}
