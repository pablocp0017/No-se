import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { NutrientRing } from '@/components/nutrition/NutrientRing';
import { MacroBar } from '@/components/nutrition/MacroBar';
import { MealSectionCard } from '@/components/nutrition/MealSectionCard';
import { WeekCalendar } from '@/components/nutrition/WeekCalendar';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useProfile } from '@/lib/hooks/useProfile';
import { useDailyLog } from '@/lib/hooks/useDailyLog';
import { formatearFechaLarga, hoyISO } from '@/lib/date';
import { COMIDAS } from '@/lib/nutrition/comidas';
import type { Comida } from '@/types/nutrition';

export default function HomeScreen() {
  const colors = useThemeColors();
  const { macroTargets } = useProfile();
  const [fecha, setFecha] = useState(hoyISO());
  const { porComida, consumido, eliminarRegistro, moverRegistro } = useDailyLog(fecha);

  const kcalObjetivo = macroTargets?.kcal ?? 0;
  const kcalRestantes = Math.round(kcalObjetivo - consumido.kcal);
  const progresoKcal = kcalObjetivo > 0 ? consumido.kcal / kcalObjetivo : 0;

  function abrirAnadir(comida: Comida) {
    router.push({ pathname: '/food/add', params: { comida, fecha } });
  }

  return (
    <Screen>
      <View style={{ gap: Spacing.space3 }}>
        <AppText variant="h1">{formatearFechaLarga(fecha)}</AppText>
        <WeekCalendar fechaSeleccionada={fecha} onSeleccionar={setFecha} />
      </View>

      <View style={{ alignItems: 'center' }}>
        <NutrientRing
          progreso={progresoKcal}
          valorCentral={`${kcalRestantes < 0 ? '+' : ''}${Math.abs(kcalRestantes)}`}
          etiquetaCentral={kcalRestantes < 0 ? 'kcal de más' : 'kcal restantes'}
        />
      </View>

      {macroTargets ? (
        <View>
          <MacroBar nombre="Proteína" color={colors.protein} consumidoG={consumido.proteinaG} objetivoG={macroTargets.proteinaG} />
          <MacroBar nombre="Hidratos" color={colors.carbs} consumidoG={consumido.carbohidratosG} objetivoG={macroTargets.carbohidratosG} />
          <MacroBar nombre="Grasas" color={colors.fat} consumidoG={consumido.grasaG} objetivoG={macroTargets.grasaG} />
          <MacroBar nombre="Fibra" color={colors.fiber} consumidoG={consumido.fibraG} objetivoG={macroTargets.fibraG} />
        </View>
      ) : null}

      <View style={{ gap: Spacing.space5 }}>
        {COMIDAS.map((comida) => (
          <MealSectionCard
            key={comida}
            comida={comida}
            registros={porComida[comida]}
            onAnadir={() => abrirAnadir(comida)}
            onEliminarRegistro={eliminarRegistro}
            onMoverRegistro={moverRegistro}
          />
        ))}
      </View>
    </Screen>
  );
}
