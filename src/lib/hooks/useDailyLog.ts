import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { hoyISO } from '@/lib/date';
import { filaAAlimento, asegurarFoodId } from '@/lib/foods';
import type { FoodLogRowConAlimento } from '@/types/database';
import type { Alimento, Comida, NutrientesConsumidos, RegistroComida } from '@/types/nutrition';

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

  // Vuelve a cargar cada vez que la pantalla recupera el foco (p.ej. al volver de añadir un
  // alimento), porque cada pantalla tiene su propia instancia de este hook y no comparten estado.
  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar])
  );

  /** Inserta el alimento en `foods` si no existe (por código de barras) y registra la ingesta. */
  async function registrarAlimento(alimento: Alimento, cantidadG: number, comida: Comida) {
    if (!session) return 'No hay sesión activa';

    let foodId: string;
    try {
      foodId = await asegurarFoodId(supabase, alimento, session.user.id);
    } catch (e) {
      return e instanceof Error ? e.message : 'No se pudo guardar el alimento';
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

  async function moverRegistro(id: string, nuevaComida: Comida) {
    if (!session) return;
    await supabase.from('food_logs').update({ comida: nuevaComida }).eq('id', id).eq('user_id', session.user.id);
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

  return { registros, porComida, consumido, cargando, registrarAlimento, eliminarRegistro, moverRegistro, recargar };
}
