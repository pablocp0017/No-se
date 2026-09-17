import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ScoreGauge } from '@/components/nutrition/ScoreGauge';
import { NutrientTargetRow } from '@/components/nutrition/NutrientTargetRow';
import { Spacing } from '@/constants/theme';
import { useProfile } from '@/lib/hooks/useProfile';
import { useDailyLog } from '@/lib/hooks/useDailyLog';
import { calcularScoreNutricional } from '@/lib/nutrition/scoring';
import type { MicronutrienteTarget } from '@/types/nutrition';

const TITULOS_CATEGORIA: Record<MicronutrienteTarget['categoria'], string> = {
  vitamina: 'Vitaminas',
  mineral: 'Minerales',
  electrolito: 'Electrolitos',
  aminoacido: 'Aminoácidos esenciales',
};

export default function NutrientDetailScreen() {
  const { macroTargets, micronutrienteTargets } = useProfile();
  const { consumido } = useDailyLog();

  const score = macroTargets && micronutrienteTargets ? calcularScoreNutricional(consumido, macroTargets, micronutrienteTargets) : null;

  const categorias: MicronutrienteTarget['categoria'][] = ['vitamina', 'mineral', 'electrolito', 'aminoacido'];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="h1">Nutrientes de hoy</AppText>
        <Pressable onPress={() => router.back()}>
          <AppText variant="body" color="brand">
            Cerrar
          </AppText>
        </Pressable>
      </View>

      {score ? (
        <Card>
          <ScoreGauge
            score={score.total}
            desglose={`Macros ${score.macros} · Vitaminas ${score.vitaminas} · Minerales ${score.minerales} · Aminoácidos ${score.aminoacidos} · Electrolitos ${score.electrolitos}`}
          />
        </Card>
      ) : null}

      {micronutrienteTargets ? (
        categorias.map((categoria) => {
          const items = micronutrienteTargets.filter((t) => t.categoria === categoria);
          if (items.length === 0) return null;
          return (
            <Card key={categoria}>
              <AppText variant="h2" style={{ marginBottom: Spacing.space2 }}>
                {TITULOS_CATEGORIA[categoria]}
              </AppText>
              {categoria === 'aminoacido' ? (
                <AppText variant="bodySm" color="inkMuted" style={{ marginBottom: Spacing.space2 }}>
                  Pocos alimentos reportan su perfil de aminoácidos: estos valores solo se rellenan cuando el producto
                  escaneado los incluye.
                </AppText>
              ) : null}
              {items.map((t) => (
                <NutrientTargetRow
                  key={t.clave}
                  etiqueta={t.etiqueta}
                  unidad={t.unidad}
                  consumido={consumido.micros[t.clave] ?? 0}
                  objetivo={t.objetivo}
                  limiteSuperior={t.limiteSuperior}
                />
              ))}
            </Card>
          );
        })
      ) : null}
    </Screen>
  );
}
