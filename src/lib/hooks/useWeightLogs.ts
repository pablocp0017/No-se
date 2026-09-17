import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { WeightLogRow } from '@/types/database';

export interface PuntoPeso {
  fecha: string;
  pesoKg: number;
}

export function useWeightLogs() {
  const { session } = useAuth();
  const [historial, setHistorial] = useState<PuntoPeso[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    if (!session) {
      setHistorial([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('fecha', { ascending: true });
    if (!error && data) {
      setHistorial((data as WeightLogRow[]).map((f) => ({ fecha: f.fecha, pesoKg: f.peso_kg })));
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

  async function registrarPeso(pesoKg: number) {
    if (!session) return 'No hay sesión activa';
    const { error } = await supabase.from('weight_logs').insert({ user_id: session.user.id, peso_kg: pesoKg });
    if (error) return error.message;
    await supabase.from('profiles').update({ peso_kg: pesoKg }).eq('id', session.user.id);
    await recargar();
    return null;
  }

  return { historial, cargando, registrarPeso, recargar };
}
