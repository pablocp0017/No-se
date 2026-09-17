import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { WeightChart } from '@/components/nutrition/WeightChart';
import { ScoreGauge } from '@/components/nutrition/ScoreGauge';
import { Spacing } from '@/constants/theme';
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

export default function ProfileScreen() {
  const { perfil, macroTargets, micronutrienteTargets, actualizarPerfil } = useProfile();
  const { historial, registrarPeso } = useWeightLogs();
  const { consumido } = useDailyLog();
  const { cerrarSesion } = useAuth();

  const [alturaCm, setAlturaCm] = useState(perfil ? String(perfil.alturaCm) : '');
  const [nuevoPeso, setNuevoPeso] = useState('');
  const [guardandoAltura, setGuardandoAltura] = useState(false);
  const [guardandoPeso, setGuardandoPeso] = useState(false);

  const score = useMemo(() => {
    if (!macroTargets || !micronutrienteTargets) return null;
    return calcularScoreNutricional(consumido, macroTargets, micronutrienteTargets);
  }, [consumido, macroTargets, micronutrienteTargets]);

  if (!perfil) return null;

  async function guardarAltura() {
    setGuardandoAltura(true);
    await actualizarPerfil({ alturaCm: Number(alturaCm) });
    setGuardandoAltura(false);
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
          <Button label="Guardar altura" variant="secondary" onPress={guardarAltura} loading={guardandoAltura} />
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

      <Card>
        <AppText variant="h2" style={{ marginBottom: Spacing.space3 }}>
          Puntuación nutricional de hoy
        </AppText>
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
      </Card>

      <Button label="Cerrar sesión" variant="ghost" onPress={cerrarSesion} />
    </Screen>
  );
}
