import type { SupabaseClient } from '@supabase/supabase-js';
import type { FoodRow } from '@/types/database';
import type { Alimento } from '@/types/nutrition';

export function filaAAlimento(f: FoodRow): Alimento {
  return {
    id: f.id,
    nombre: f.nombre,
    marca: f.marca,
    codigoBarras: f.codigo_barras,
    kcalPor100g: f.kcal_100g,
    proteinaPor100g: f.proteina_100g,
    carbohidratosPor100g: f.carbohidratos_100g,
    grasaPor100g: f.grasa_100g,
    fibraPor100g: f.fibra_100g,
    azucarPor100g: f.azucar_100g,
    sodioMgPor100g: f.sodio_mg_100g,
    micros: f.micros,
    fuente: f.fuente,
  };
}

/**
 * Busca el alimento en `foods` por su código de barras; si no existe (o no tiene código de
 * barras, p.ej. entrada manual o compuesta por ingredientes), lo inserta. Devuelve su id.
 */
export async function asegurarFoodId(supabase: SupabaseClient, alimento: Alimento, userId: string): Promise<string> {
  if (alimento.codigoBarras) {
    const { data: existente } = await supabase.from('foods').select('id').eq('codigo_barras', alimento.codigoBarras).maybeSingle();
    if (existente) return existente.id;
  }

  const { data: nuevo, error } = await supabase
    .from('foods')
    .insert({
      codigo_barras: alimento.codigoBarras,
      nombre: alimento.nombre,
      marca: alimento.marca,
      kcal_100g: alimento.kcalPor100g,
      proteina_100g: alimento.proteinaPor100g,
      carbohidratos_100g: alimento.carbohidratosPor100g,
      grasa_100g: alimento.grasaPor100g,
      fibra_100g: alimento.fibraPor100g,
      azucar_100g: alimento.azucarPor100g,
      sodio_mg_100g: alimento.sodioMgPor100g,
      micros: alimento.micros,
      fuente: alimento.fuente,
      created_by: userId,
    })
    .select('id')
    .single();

  if (error || !nuevo) throw new Error(error?.message ?? 'No se pudo guardar el alimento');
  return nuevo.id;
}
