import { Pressable, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { FoodRow } from './FoodRow';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { Comida, RegistroComida } from '@/types/nutrition';

const TITULOS: Record<Comida, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  snacks: 'Snacks',
};

interface MealSectionCardProps {
  comida: Comida;
  registros: RegistroComida[];
  onAnadir: () => void;
  onEliminarRegistro: (id: string) => void;
}

export function MealSectionCard({ comida, registros, onAnadir, onEliminarRegistro }: MealSectionCardProps) {
  const colors = useThemeColors();
  const kcalTotal = registros.reduce((acc, r) => acc + (r.alimento.kcalPor100g * r.cantidadG) / 100, 0);

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: Spacing.space3 }}>
        <AppText variant="h2">{TITULOS[comida]}</AppText>
        <AppText variant="numeric" color="inkMuted">
          {Math.round(kcalTotal)} kcal
        </AppText>
      </View>
      {registros.map((r, i) => (
        <FoodRow key={r.id} registro={r} esPrimero={i === 0} onEliminar={() => onEliminarRegistro(r.id)} />
      ))}
      <Pressable onPress={onAnadir} style={{ paddingTop: Spacing.space2, marginTop: registros.length ? 0 : undefined }}>
        <AppText variant="label" color="brand">
          + Añadir alimento
        </AppText>
      </Pressable>
    </Card>
  );
}
