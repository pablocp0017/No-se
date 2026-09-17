import type { Objetivo, NivelActividad, MacroTargets } from '@/types/nutrition';
import type { Sexo } from './constants';
import { FIBRA_G_POR_1000KCAL, FIBRA_MINIMA_G } from './constants';

/** Mifflin-St Jeor (Am J Clin Nutr. 1990;51(2):241-247), fórmula de referencia de la Academy of Nutrition and Dietetics. */
export function calcularBMR(sexo: Sexo, pesoKg: number, alturaCm: number, edad: number): number {
  const base = 10 * pesoKg + 6.25 * alturaCm - 5 * edad;
  return sexo === 'hombre' ? base + 5 : base - 161;
}

const MULTIPLICADOR_ACTIVIDAD: Record<NivelActividad, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9,
};

/** Traduce los días de ejercicio semanal (cuestionario inicial) a un nivel de actividad. */
export function nivelActividadDesdeDias(diasEjercicioSemana: number): NivelActividad {
  if (diasEjercicioSemana <= 0) return 'sedentario';
  if (diasEjercicioSemana <= 2) return 'ligero';
  if (diasEjercicioSemana <= 4) return 'moderado';
  if (diasEjercicioSemana <= 6) return 'activo';
  return 'muy_activo';
}

export function calcularTDEE(bmr: number, nivelActividad: NivelActividad): number {
  return bmr * MULTIPLICADOR_ACTIVIDAD[nivelActividad];
}

/** Ajuste calórico por objetivo: déficit ISSN/ACSM (~-20%) o superávit conservador (~+15%). */
const AJUSTE_OBJETIVO: Record<Objetivo, number> = {
  perder_peso: -0.2,
  mantener: 0,
  ganar_musculo: 0.15,
};

const PROTEINA_G_POR_KG: Record<Objetivo, number> = {
  perder_peso: 2.0, // rango ISSN 1.6-2.4 g/kg; se toma un valor conservador-alto para preservar masa magra en déficit
  mantener: 1.4, // por encima del PRI (0.83 g/kg) para población general activa
  ganar_musculo: 1.8, // rango ISSN 1.6-2.2 g/kg
};

const GRASA_PORCENTAJE_KCAL: Record<Objetivo, number> = {
  perder_peso: 0.25,
  mantener: 0.3,
  ganar_musculo: 0.25,
};

const KCAL_MINIMA_SEGURA: Record<Sexo, number> = {
  mujer: 1200,
  hombre: 1500,
};

export function calcularMacroTargets(
  sexo: Sexo,
  pesoKg: number,
  alturaCm: number,
  edad: number,
  objetivo: Objetivo,
  diasEjercicioSemana: number
): MacroTargets {
  const bmr = calcularBMR(sexo, pesoKg, alturaCm, edad);
  const nivelActividad = nivelActividadDesdeDias(diasEjercicioSemana);
  const tdee = calcularTDEE(bmr, nivelActividad);

  let kcal = tdee * (1 + AJUSTE_OBJETIVO[objetivo]);
  kcal = Math.max(kcal, KCAL_MINIMA_SEGURA[sexo]);
  kcal = Math.round(kcal);

  const proteinaG = Math.round(PROTEINA_G_POR_KG[objetivo] * pesoKg);
  const grasaG = Math.round((kcal * GRASA_PORCENTAJE_KCAL[objetivo]) / 9);
  const kcalRestantes = kcal - proteinaG * 4 - grasaG * 9;
  const carbohidratosG = Math.max(Math.round(kcalRestantes / 4), 0);

  const fibraG = Math.max(Math.round((kcal / 1000) * FIBRA_G_POR_1000KCAL), FIBRA_MINIMA_G);

  return { kcal, proteinaG, grasaG, carbohidratosG, fibraG };
}
