import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { filaAAlimento, asegurarFoodId } from '@/lib/foods';
import type { FoodRow } from '@/types/database';
import type { Alimento } from '@/types/nutrition';

export interface AlimentoFavorito {
  id: string; // id de la fila food_favorites (para poder borrarla)
  alimento: Alimento;
}

interface FilaFavorito {
  id: number;
  foods: FoodRow;
}

export function useFavoritos() {
  const { session } = useAuth();
  const [favoritos, setFavoritos] = useState<AlimentoFavorito[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    if (!session) {
      setFavoritos([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    const { data, error } = await supabase
      .from('food_favorites')
      .select('id, foods(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const filas = data as unknown as FilaFavorito[];
      setFavoritos(filas.map((f) => ({ id: String(f.id), alimento: filaAAlimento(f.foods) })));
    }
    setCargando(false);
  }, [session]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar])
  );

  async function guardarFavorito(alimento: Alimento) {
    if (!session) return 'No hay sesión activa';
    let foodId: string;
    try {
      foodId = await asegurarFoodId(supabase, alimento, session.user.id);
    } catch (e) {
      return e instanceof Error ? e.message : 'No se pudo guardar el alimento';
    }
    // Ignora el conflicto de unicidad si ya estaba guardado (no es un error para el usuario).
    const { error } = await supabase.from('food_favorites').insert({ user_id: session.user.id, food_id: foodId });
    if (error && error.code !== '23505') return error.message;
    await recargar();
    return null;
  }

  async function quitarFavorito(id: string) {
    if (!session) return;
    await supabase.from('food_favorites').delete().eq('id', id).eq('user_id', session.user.id);
    await recargar();
  }

  return { favoritos, cargando, guardarFavorito, quitarFavorito, recargar };
}
