import { Pressable, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { RegistroComida } from '@/types/nutrition';

interface FoodRowProps {
  registro: RegistroComida;
  onEliminar?: () => void;
  esPrimero?: boolean;
}

export function FoodRow({ registro, onEliminar, esPrimero }: FoodRowProps) {
  const colors = useThemeColors();
  const factor = registro.cantidadG / 100;
  const kcal = Math.round(registro.alimento.kcalPor100g * factor);

  return (
    <Pressable
      onLongPress={onEliminar}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.space3,
        borderTopWidth: esPrimero ? 0 : 1,
        borderTopColor: colors.border,
      }}
    >
      <View style={{ flex: 1, paddingRight: Spacing.space3 }}>
        <AppText variant="bodyLg">{registro.alimento.nombre}</AppText>
        <AppText variant="bodySm" color="inkMuted">
          {registro.alimento.marca ? `${registro.alimento.marca} · ` : ''}
          {Math.round(registro.cantidadG)} g
        </AppText>
      </View>
      <AppText variant="numeric">{kcal} kcal</AppText>
    </Pressable>
  );
}
