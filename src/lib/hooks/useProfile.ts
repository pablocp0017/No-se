import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { ProfileRow } from '@/types/database';
import type { Perfil } from '@/types/nutrition';
import { calcularMacroTargets } from '@/lib/nutrition/energy';
import { construirMicronutrienteTargets } from '@/lib/nutrition/targets';

function filaAPerfil(fila: ProfileRow): Perfil {
  return {
    id: fila.id,
    sexo: fila.sexo,
    edad: fila.edad,
    alturaCm: fila.altura_cm,
    pesoKg: fila.peso_kg,
    objetivo: fila.objetivo,
    diasEjercicioSemana: fila.dias_ejercicio_semana,
  };
}

export interface DatosOnboarding {
  sexo: Perfil['sexo'];
  edad: number;
  alturaCm: number;
  pesoKg: number;
  objetivo: Perfil['objetivo'];
  diasEjercicioSemana: number;
}

export function useProfile() {
  const { session } = useAuth();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    if (!session) {
      setPerfil(null);
      setCargando(false);
      return;
    }
    setCargando(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    if (!error && data) {
      setPerfil(filaAPerfil(data as ProfileRow));
    } else {
      setPerfil(null);
    }
    setCargando(false);
  }, [session]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  async function crearPerfil(datos: DatosOnboarding) {
    if (!session) return 'No hay sesión activa';
    const { error } = await supabase.from('profiles').insert({
      id: session.user.id,
      sexo: datos.sexo,
      edad: datos.edad,
      altura_cm: datos.alturaCm,
      peso_kg: datos.pesoKg,
      objetivo: datos.objetivo,
      dias_ejercicio_semana: datos.diasEjercicioSemana,
    });
    if (error) return error.message;
    // Primer registro de peso para poder graficar la evolución desde el día 1.
    await supabase.from('weight_logs').insert({ user_id: session.user.id, peso_kg: datos.pesoKg });
    await recargar();
    return null;
  }

  async function actualizarPerfil(cambios: Partial<DatosOnboarding>) {
    if (!session) return 'No hay sesión activa';
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (cambios.sexo !== undefined) payload.sexo = cambios.sexo;
    if (cambios.edad !== undefined) payload.edad = cambios.edad;
    if (cambios.alturaCm !== undefined) payload.altura_cm = cambios.alturaCm;
    if (cambios.pesoKg !== undefined) payload.peso_kg = cambios.pesoKg;
    if (cambios.objetivo !== undefined) payload.objetivo = cambios.objetivo;
    if (cambios.diasEjercicioSemana !== undefined) payload.dias_ejercicio_semana = cambios.diasEjercicioSemana;

    const { error } = await supabase.from('profiles').update(payload).eq('id', session.user.id);
    if (error) return error.message;
    await recargar();
    return null;
  }

  const macroTargets = perfil
    ? calcularMacroTargets(perfil.sexo, perfil.pesoKg, perfil.alturaCm, perfil.edad, perfil.objetivo, perfil.diasEjercicioSemana)
    : null;
  const micronutrienteTargets = perfil ? construirMicronutrienteTargets(perfil) : null;

  return { perfil, cargando, macroTargets, micronutrienteTargets, crearPerfil, actualizarPerfil, recargar };
}
