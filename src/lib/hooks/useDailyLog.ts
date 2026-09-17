import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { FoodLogRowConAlimento, FoodRow } from '@/types/database';
import type { Alimento, Comida, NutrientesConsumidos, RegistroComida } from '@/types/nutrition';

function filaAAlimento(f: FoodRow): Alimento {
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

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyLog(fecha: string = hoyISO()) {
  const { session } = useAuth();
  const [registros, setRegistros] = useState<RegistroComida[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    if (!session) {
      setRegistros([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    const { data, error } = await supabase
      .from('food_logs')
      .select('*, foods(*)')
      .eq('user_id', session.user.id)
      .eq('fecha', fecha)
      .order('created_at', { ascending: true });

    if (!error && data) {
      const filas = data as unknown as FoodLogRowConAlimento[];
      setRegistros(
        filas.map((f) => ({
          id: String(f.id),
          alimento: filaAAlimento(f.foods),
          cantidadG: f.cantidad_g,
          comida: f.comida,
          fecha: f.fecha,
        }))
      );
    }
    setCargando(false);
  }, [session, fecha]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  /** Inserta el alimento en `foods` si no existe (por código de barras) y registra la ingesta. */
  async function registrarAlimento(alimento: Alimento, cantidadG: number, comida: Comida) {
    if (!session) return 'No hay sesión activa';

    let foodId: string | null = null;

    if (alimento.codigoBarras) {
      const { data: existente } = await supabase
        .from('foods')
        .select('id')
        .eq('codigo_barras', alimento.codigoBarras)
        .maybeSingle();
      if (existente) foodId = existente.id;
    }

    if (!foodId) {
      const { data: nuevo, error: errorInsert } = await supabase
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
          created_by: session.user.id,
        })
        .select('id')
        .single();
      if (errorInsert || !nuevo) return errorInsert?.message ?? 'No se pudo guardar el alimento';
      foodId = nuevo.id;
    }

    const { error: errorLog } = await supabase.from('food_logs').insert({
      user_id: session.user.id,
      food_id: foodId,
      comida,
      cantidad_g: cantidadG,
      fecha,
    });
    if (errorLog) return errorLog.message;
    await recargar();
    return null;
  }

  async function eliminarRegistro(id: string) {
    if (!session) return;
    await supabase.from('food_logs').delete().eq('id', id).eq('user_id', session.user.id);
    await recargar();
  }

  const porComida = useMemo(() => {
    const grupos: Record<Comida, RegistroComida[]> = { desayuno: [], almuerzo: [], cena: [], snacks: [] };
    for (const r of registros) grupos[r.comida].push(r);
    return grupos;
  }, [registros]);

  const consumido: NutrientesConsumidos = useMemo(() => {
    const total: NutrientesConsumidos = {
      kcal: 0,
      proteinaG: 0,
      carbohidratosG: 0,
      grasaG: 0,
      fibraG: 0,
      sodioMg: 0,
      micros: {},
    };
    for (const r of registros) {
      const factor = r.cantidadG / 100;
      total.kcal += r.alimento.kcalPor100g * factor;
      total.proteinaG += r.alimento.proteinaPor100g * factor;
      total.carbohidratosG += r.alimento.carbohidratosPor100g * factor;
      total.grasaG += r.alimento.grasaPor100g * factor;
      total.fibraG += (r.alimento.fibraPor100g ?? 0) * factor;
      total.sodioMg += (r.alimento.sodioMgPor100g ?? 0) * factor;
      if (r.alimento.micros) {
        for (const [clave, valorPor100g] of Object.entries(r.alimento.micros)) {
          total.micros[clave] = (total.micros[clave] ?? 0) + valorPor100g * factor;
        }
      }
    }
    total.micros.sodio_mg = total.sodioMg;
    return total;
  }, [registros]);

  return { registros, porComida, consumido, cargando, registrarAlimento, eliminarRegistro, recargar };
}
