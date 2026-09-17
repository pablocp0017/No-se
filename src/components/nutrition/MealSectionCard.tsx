import { Pressable, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { FoodRow } from './FoodRow';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { TITULOS_COMIDA } from '@/lib/nutrition/comidas';
import type { Comida, RegistroComida } from '@/types/nutrition';

interface MealSectionCardProps {
  comida: Comida;
  registros: RegistroComida[];
  onAnadir: () => void;
  onEliminarRegistro: (id: string) => void;
  onMoverRegistro: (id: string, nuevaComida: Comida) => void;
}

export function MealSectionCard({ comida, registros, onAnadir, onEliminarRegistro, onMoverRegistro }: MealSectionCardProps) {
  const colors = useThemeColors();
  const kcalTotal = registros.reduce((acc, r) => acc + (r.alimento.kcalPor100g * r.cantidadG) / 100, 0);

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: Spacing.space3 }}>
        <AppText variant="h2">{TITULOS_COMIDA[comida]}</AppText>
        <AppText variant="numeric" color="inkMuted">
          {Math.round(kcalTotal)} kcal
        </AppText>
      </View>
      {registros.map((r, i) => (
        <FoodRow
          key={r.id}
          registro={r}
          esPrimero={i === 0}
          onEliminar={() => onEliminarRegistro(r.id)}
          onMover={(nuevaComida) => onMoverRegistro(r.id, nuevaComida)}
          comidaActual={comida}
        />
      ))}
      <Pressable onPress={onAnadir} style={{ paddingTop: Spacing.space2, marginTop: registros.length ? 0 : undefined }}>
        <AppText variant="label" color="brand">
          + Añadir alimento
        </AppText>
      </Pressable>
    </Card>
  );
}
