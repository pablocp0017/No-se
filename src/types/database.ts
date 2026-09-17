import type { Comida, Objetivo } from './nutrition';
import type { Sexo } from '@/lib/nutrition/constants';

export type { Sexo };

export interface ProfileRow {
  id: string;
  sexo: Sexo;
  edad: number;
  altura_cm: number;
  peso_kg: number;
  objetivo: Objetivo;
  dias_ejercicio_semana: number;
  created_at: string;
  updated_at: string;
}

export interface WeightLogRow {
  id: number;
  user_id: string;
  peso_kg: number;
  fecha: string;
  created_at: string;
}

export interface FoodRow {
  id: string;
  codigo_barras: string | null;
  nombre: string;
  marca: string | null;
  kcal_100g: number;
  proteina_100g: number;
  carbohidratos_100g: number;
  grasa_100g: number;
  fibra_100g: number | null;
  azucar_100g: number | null;
  sodio_mg_100g: number | null;
  micros: Record<string, number> | null;
  fuente: 'openfoodfacts' | 'manual' | 'usda';
  created_by: string | null;
  created_at: string;
}

export interface FoodLogRow {
  id: number;
  user_id: string;
  food_id: string;
  comida: Comida;
  cantidad_g: number;
  fecha: string;
  created_at: string;
}

export interface FoodLogRowConAlimento extends FoodLogRow {
  foods: FoodRow;
}
