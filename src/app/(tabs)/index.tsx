import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { NutrientRing } from '@/components/nutrition/NutrientRing';
import { MacroBar } from '@/components/nutrition/MacroBar';
import { MealSectionCard } from '@/components/nutrition/MealSectionCard';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useProfile } from '@/lib/hooks/useProfile';
import { useDailyLog } from '@/lib/hooks/useDailyLog';
import { esHoy, formatearFechaLarga, hoyISO, sumarDias } from '@/lib/date';
import type { Comida } from '@/types/nutrition';

const COMIDAS: Comida[] = ['desayuno', 'almuerzo', 'cena', 'snacks'];

export default function HomeScreen() {
  const colors = useThemeColors();
  const { macroTargets } = useProfile();
  const [fecha, setFecha] = useState(hoyISO());
  const { porComida, consumido, eliminarRegistro } = useDailyLog(fecha);

  const kcalObjetivo = macroTargets?.kcal ?? 0;
  const kcalRestantes = Math.round(kcalObjetivo - consumido.kcal);
  const progresoKcal = kcalObjetivo > 0 ? consumido.kcal / kcalObjetivo : 0;

  function abrirAnadir(comida: Comida) {
    router.push({ pathname: '/food/add', params: { comida, fecha } });
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => setFecha((f) => sumarDias(f, -1))} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.ink} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <AppText variant="h1">{formatearFechaLarga(fecha)}</AppText>
        </View>
        <Pressable onPress={() => setFecha((f) => sumarDias(f, 1))} disabled={esHoy(fecha)} hitSlop={12}>
          <Ionicons name="chevron-forward" size={24} color={esHoy(fecha) ? colors.border : colors.ink} />
        </Pressable>
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
          />
        ))}
      </View>
    </Screen>
  );
}
