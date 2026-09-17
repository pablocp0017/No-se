import type { Sexo } from '@/lib/nutrition/constants';

export type Objetivo = 'perder_peso' | 'mantener' | 'ganar_musculo';

export type NivelActividad = 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo';

export type Comida = 'desayuno' | 'almuerzo' | 'cena' | 'snacks';

export interface Perfil {
  id: string;
  sexo: Sexo;
  edad: number;
  alturaCm: number;
  pesoKg: number;
  objetivo: Objetivo;
  diasEjercicioSemana: number;
  pesoObjetivoKg: number | null;
}

export interface MacroTargets {
  kcal: number;
  proteinaG: number;
  grasaG: number;
  carbohidratosG: number;
  fibraG: number;
}

export interface MicronutrienteTarget {
  clave: string;
  etiqueta: string;
  unidad: string;
  objetivo: number;
  limiteSuperior?: number;
  categoria: 'vitamina' | 'mineral' | 'electrolito' | 'aminoacido';
}

export interface PerfilNutricionalCompleto {
  macros: MacroTargets;
  micronutrientes: MicronutrienteTarget[];
}

/** Datos nutricionales de un alimento, normalizados por 100 g. */
export interface Alimento {
  id: string;
  nombre: string;
  marca?: string | null;
  codigoBarras?: string | null;
  kcalPor100g: number;
  proteinaPor100g: number;
  carbohidratosPor100g: number;
  grasaPor100g: number;
  fibraPor100g?: number | null;
  azucarPor100g?: number | null;
  sodioMgPor100g?: number | null;
  micros?: Record<string, number> | null;
  fuente: 'openfoodfacts' | 'manual' | 'usda';
}

export interface RegistroComida {
  id: string;
  alimento: Alimento;
  cantidadG: number;
  comida: Comida;
  fecha: string; // YYYY-MM-DD
}

export interface NutrientesConsumidos {
  kcal: number;
  proteinaG: number;
  carbohidratosG: number;
  grasaG: number;
  fibraG: number;
  sodioMg: number;
  micros: Record<string, number>;
}
