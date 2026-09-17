import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { WeightChart } from '@/components/nutrition/WeightChart';
import { ScoreGauge } from '@/components/nutrition/ScoreGauge';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useProfile } from '@/lib/hooks/useProfile';
import { useWeightLogs } from '@/lib/hooks/useWeightLogs';
import { useDailyLog } from '@/lib/hooks/useDailyLog';
import { useAuth } from '@/lib/hooks/useAuth';
import { calcularScoreNutricional } from '@/lib/nutrition/scoring';
import type { Objetivo } from '@/types/nutrition';

const OBJETIVOS: { valor: Objetivo; titulo: string }[] = [
  { valor: 'perder_peso', titulo: 'Perder peso' },
  { valor: 'mantener', titulo: 'Mantenerme' },
  { valor: 'ganar_musculo', titulo: 'Ganar masa muscular' },
];

function formatearFechaCorta(fechaISO: string): string {
  return new Date(`${fechaISO}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProfileScreen() {
  const { perfil, macroTargets, micronutrienteTargets, tiempoObjetivo, actualizarPerfil } = useProfile();
  const { historial, registrarPeso } = useWeightLogs();
  const { consumido } = useDailyLog();
  const { cerrarSesion } = useAuth();
  const colors = useThemeColors();

  const [alturaCm, setAlturaCm] = useState(perfil ? String(perfil.alturaCm) : '');
  const [pesoObjetivoKg, setPesoObjetivoKg] = useState(perfil?.pesoObjetivoKg != null ? String(perfil.pesoObjetivoKg) : '');
  const [nuevoPeso, setNuevoPeso] = useState('');
  const [guardandoCuerpo, setGuardandoCuerpo] = useState(false);
  const [guardandoPeso, setGuardandoPeso] = useState(false);

  const score = useMemo(() => {
    if (!macroTargets || !micronutrienteTargets) return null;
    return calcularScoreNutricional(consumido, macroTargets, micronutrienteTargets);
  }, [consumido, macroTargets, micronutrienteTargets]);

  if (!perfil) return null;

  async function guardarCuerpo() {
    setGuardandoCuerpo(true);
    await actualizarPerfil({
      alturaCm: Number(alturaCm),
      pesoObjetivoKg: pesoObjetivoKg.trim() ? Number(pesoObjetivoKg) : null,
    });
    setGuardandoCuerpo(false);
  }

  async function guardarPeso() {
    if (!nuevoPeso.trim()) return;
    setGuardandoPeso(true);
    await registrarPeso(Number(nuevoPeso));
    setNuevoPeso('');
    setGuardandoPeso(false);
  }

  return (
    <Screen>
      <AppText variant="h1">Datos personales</AppText>

      <Card>
        <AppText variant="h2" style={{ marginBottom: Spacing.space3 }}>
          Tu cuerpo
        </AppText>
        <View style={{ flexDirection: 'row', gap: Spacing.space3 }}>
          <View style={{ flex: 1 }}>
            <TextField label="Altura (cm)" keyboardType="decimal-pad" value={alturaCm} onChangeText={setAlturaCm} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="label" color="inkMuted">
              Peso actual
            </AppText>
            <AppText variant="displayLg" style={{ marginTop: Spacing.space2 }}>
              {perfil.pesoKg} kg
            </AppText>
          </View>
        </View>
        <View style={{ marginTop: Spacing.space3 }}>
          <TextField
            label="Peso objetivo (kg)"
            keyboardType="decimal-pad"
            value={pesoObjetivoKg}
            onChangeText={setPesoObjetivoKg}
            placeholder={String(perfil.pesoKg)}
          />
        </View>
        <View style={{ marginTop: Spacing.space3 }}>
          <Button label="Guardar cambios" variant="secondary" onPress={guardarCuerpo} loading={guardandoCuerpo} />
        </View>
      </Card>

      <Card>
        <AppText variant="h2" style={{ marginBottom: Spacing.space3 }}>
          Objetivo
        </AppText>
        <View style={{ gap: Spacing.space2 }}>
          {OBJETIVOS.map((o) => (
            <Button
              key={o.valor}
              label={o.titulo}
              variant={perfil.objetivo === o.valor ? 'primary' : 'secondary'}
              onPress={() => actualizarPerfil({ objetivo: o.valor })}
            />
          ))}
        </View>
      </Card>

      <Card>
        <AppText variant="h2" style={{ marginBottom: Spacing.space3 }}>
          Tiempo estimado para tu objetivo
        </AppText>
        {perfil.objetivo === 'mantener' ? (
          <AppText variant="body" color="inkMuted">
            Tu objetivo es mantener tu peso actual, así que no aplica una fecha estimada.
          </AppText>
        ) : tiempoObjetivo ? (
          <View style={{ gap: Spacing.space1 }}>
            <AppText variant="h3">
              ~{Math.ceil(tiempoObjetivo.semanas)} semana{Math.ceil(tiempoObjetivo.semanas) === 1 ? '' : 's'}
            </AppText>
            <AppText variant="body" color="inkMuted">
              Al ritmo actual (~{Math.abs(tiempoObjetivo.ritmoKgSemana).toFixed(2)} kg/semana), llegarías a tu peso objetivo
              sobre el {formatearFechaCorta(tiempoObjetivo.fechaEstimada)}.
            </AppText>
            <AppText variant="caption" color="inkMuted" style={{ marginTop: Spacing.space1 }}>
              Estimación aproximada (1 kg ≈ 7700 kcal); tu ritmo real depende de la adherencia y tu metabolismo.
            </AppText>
          </View>
        ) : (
          <AppText variant="body" color="inkMuted">
            Indica tu peso objetivo arriba para calcular una fecha estimada.
          </AppText>
        )}
      </Card>

      <Card>
        <AppText variant="h2" style={{ marginBottom: Spacing.space3 }}>
          Evolución de peso
        </AppText>
        <WeightChart historial={historial} />
        <View style={{ flexDirection: 'row', gap: Spacing.space3, marginTop: Spacing.space4, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <TextField label="Nuevo peso (kg)" keyboardType="decimal-pad" value={nuevoPeso} onChangeText={setNuevoPeso} placeholder="70.5" />
          </View>
          <Button label="Registrar" onPress={guardarPeso} loading={guardandoPeso} />
        </View>
      </Card>

      <Pressable onPress={() => router.push('/nutrient-detail')}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.space3 }}>
            <AppText variant="h2">Puntuación nutricional de hoy</AppText>
            <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
          </View>
          {score ? (
            <ScoreGauge
              score={score.total}
              desglose={`Macros ${score.macros} · Vitaminas ${score.vitaminas} · Minerales ${score.minerales} · Aminoácidos ${score.aminoacidos} · Electrolitos ${score.electrolitos}`}
            />
          ) : null}
          {score && score.alertas.length > 0 ? (
            <View style={{ marginTop: Spacing.space3 }}>
              <AppText variant="bodySm" color="danger">
                Por encima del límite recomendado: {score.alertas.map((a) => a.etiqueta).join(', ')}.
              </AppText>
            </View>
          ) : null}
          <AppText variant="label" color="brand" style={{ marginTop: Spacing.space3, textAlign: 'center' }}>
            Ver recuento completo de vitaminas, minerales, aminoácidos y electrolitos
          </AppText>
        </Card>
      </Pressable>

      <Button label="Cerrar sesión" variant="ghost" onPress={cerrarSesion} />
    </Screen>
  );
}
