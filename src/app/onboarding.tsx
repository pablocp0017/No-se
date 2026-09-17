import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useProfile } from '@/lib/hooks/useProfile';
import type { Sexo } from '@/lib/nutrition/constants';
import type { Objetivo } from '@/types/nutrition';

const PASOS = ['sexo', 'medidas', 'objetivo', 'pesoObjetivo', 'actividad', 'resumen'] as const;

const OBJETIVOS: { valor: Objetivo; titulo: string; descripcion: string }[] = [
  { valor: 'perder_peso', titulo: 'Perder peso', descripcion: 'Déficit calórico moderado preservando masa muscular.' },
  { valor: 'mantener', titulo: 'Mantenerme', descripcion: 'Calorías de mantenimiento y hábitos saludables.' },
  { valor: 'ganar_musculo', titulo: 'Ganar masa muscular', descripcion: 'Superávit calórico conservador con proteína alta.' },
];

function OpcionSeleccionable({
  seleccionado,
  onPress,
  titulo,
  descripcion,
}: {
  seleccionado: boolean;
  onPress: () => void;
  titulo: string;
  descripcion?: string;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: Spacing.space4,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: seleccionado ? colors.brand : colors.border,
        backgroundColor: seleccionado ? colors.surface300 : colors.surface200,
      }}
    >
      <AppText variant="h3">{titulo}</AppText>
      {descripcion ? (
        <AppText variant="bodySm" color="inkMuted" style={{ marginTop: 2 }}>
          {descripcion}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const { crearPerfil } = useProfile();
  const [pasoIdx, setPasoIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [sexo, setSexo] = useState<Sexo | null>(null);
  const [edad, setEdad] = useState('');
  const [alturaCm, setAlturaCm] = useState('');
  const [pesoKg, setPesoKg] = useState('');
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [pesoObjetivoKg, setPesoObjetivoKg] = useState('');
  const [diasEjercicioSemana, setDiasEjercicioSemana] = useState<number | null>(null);

  const paso = PASOS[pasoIdx];

  function puedeAvanzar() {
    if (paso === 'sexo') return sexo !== null;
    if (paso === 'medidas') return edad.trim() !== '' && alturaCm.trim() !== '' && pesoKg.trim() !== '';
    if (paso === 'objetivo') return objetivo !== null;
    if (paso === 'pesoObjetivo') return objetivo === 'mantener' || pesoObjetivoKg.trim() !== '';
    if (paso === 'actividad') return diasEjercicioSemana !== null;
    return true;
  }

  async function finalizar() {
    if (!sexo || !objetivo || diasEjercicioSemana === null) return;
    setError(null);
    setGuardando(true);
    const err = await crearPerfil({
      sexo,
      edad: Number(edad),
      alturaCm: Number(alturaCm),
      pesoKg: Number(pesoKg),
      objetivo,
      diasEjercicioSemana,
      pesoObjetivoKg: objetivo === 'mantener' ? Number(pesoKg) : Number(pesoObjetivoKg),
    });
    setGuardando(false);
    if (err) {
      setError(err);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', gap: Spacing.space1, marginTop: Spacing.space6 }}>
        {PASOS.map((p, i) => (
          <View
            key={p}
            style={{
              flex: 1,
              height: 4,
              borderRadius: Radius.pill,
              backgroundColor: i <= pasoIdx ? '#1fa463' : '#e4e1d8',
            }}
          />
        ))}
      </View>

      {paso === 'sexo' && (
        <View style={{ gap: Spacing.space4 }}>
          <AppText variant="h1">¿Cuál es tu sexo?</AppText>
          <AppText variant="body" color="inkMuted">
            Lo usamos para calcular tu gasto energético y tus necesidades de micronutrientes con mayor precisión.
          </AppText>
          <OpcionSeleccionable titulo="Hombre" seleccionado={sexo === 'hombre'} onPress={() => setSexo('hombre')} />
          <OpcionSeleccionable titulo="Mujer" seleccionado={sexo === 'mujer'} onPress={() => setSexo('mujer')} />
        </View>
      )}

      {paso === 'medidas' && (
        <View style={{ gap: Spacing.space4 }}>
          <AppText variant="h1">Sobre ti</AppText>
          <TextField label="Edad (años)" keyboardType="number-pad" value={edad} onChangeText={setEdad} placeholder="25" />
          <TextField label="Altura (cm)" keyboardType="decimal-pad" value={alturaCm} onChangeText={setAlturaCm} placeholder="175" />
          <TextField label="Peso (kg)" keyboardType="decimal-pad" value={pesoKg} onChangeText={setPesoKg} placeholder="70" />
        </View>
      )}

      {paso === 'objetivo' && (
        <View style={{ gap: Spacing.space4 }}>
          <AppText variant="h1">¿Cuál es tu objetivo?</AppText>
          {OBJETIVOS.map((o) => (
            <OpcionSeleccionable
              key={o.valor}
              titulo={o.titulo}
              descripcion={o.descripcion}
              seleccionado={objetivo === o.valor}
              onPress={() => setObjetivo(o.valor)}
            />
          ))}
        </View>
      )}

      {paso === 'pesoObjetivo' && (
        <View style={{ gap: Spacing.space4 }}>
          {objetivo === 'mantener' ? (
            <>
              <AppText variant="h1">Tu objetivo es mantenerte</AppText>
              <AppText variant="body" color="inkMuted">
                Usaremos tu peso actual ({pesoKg || '—'} kg) como referencia. Podrás cambiarlo cuando quieras desde Datos
                personales.
              </AppText>
            </>
          ) : (
            <>
              <AppText variant="h1">¿Cuál es tu peso objetivo?</AppText>
              <AppText variant="body" color="inkMuted">
                Con esto calculamos cuánto tiempo te llevará aproximadamente alcanzarlo al ritmo actual.
              </AppText>
              <TextField
                label="Peso objetivo (kg)"
                keyboardType="decimal-pad"
                value={pesoObjetivoKg}
                onChangeText={setPesoObjetivoKg}
                placeholder={objetivo === 'perder_peso' ? 'Ej. 65' : 'Ej. 78'}
              />
            </>
          )}
        </View>
      )}

      {paso === 'actividad' && (
        <View style={{ gap: Spacing.space4 }}>
          <AppText variant="h1">¿Cuántos días entrenas a la semana?</AppText>
          <AppText variant="body" color="inkMuted">
            Incluye cualquier ejercicio estructurado: gimnasio, running, deportes de equipo.
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.space2 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
              <Pressable
                key={d}
                onPress={() => setDiasEjercicioSemana(d)}
                style={({ pressed }) => ({
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: diasEjercicioSemana === d ? '#1fa463' : '#e4e1d8',
                  backgroundColor: diasEjercicioSemana === d ? '#1fa463' : 'transparent',
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <AppText variant="h3" color={diasEjercicioSemana === d ? 'onBrand' : 'ink'}>
                  {d}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {paso === 'resumen' && (
        <View style={{ gap: Spacing.space4 }}>
          <AppText variant="h1">Todo listo</AppText>
          <AppText variant="body" color="inkMuted">
            Calcularemos tus calorías, macros y micronutrientes diarios a partir de estos datos. Podrás cambiarlos cuando
            quieras desde Datos personales.
          </AppText>
          {error ? (
            <AppText variant="bodySm" color="danger">
              {error}
            </AppText>
          ) : null}
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: Spacing.space3, marginTop: 'auto' }}>
        {pasoIdx > 0 ? <Button label="Atrás" variant="secondary" onPress={() => setPasoIdx((i) => i - 1)} /> : null}
        {paso !== 'resumen' ? (
          <View style={{ flex: 1 }}>
            <Button label="Siguiente" onPress={() => setPasoIdx((i) => i + 1)} disabled={!puedeAvanzar()} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Button label="Empezar" onPress={finalizar} loading={guardando} />
          </View>
        )}
      </View>
    </Screen>
  );
}
