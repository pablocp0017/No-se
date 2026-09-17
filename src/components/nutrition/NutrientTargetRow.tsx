import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface NutrientTargetRowProps {
  etiqueta: string;
  unidad: string;
  consumido: number;
  objetivo: number;
  limiteSuperior?: number;
}

function formatear(valor: number, unidad: string): string {
  if (unidad === 'µg' || unidad === 'mg') {
    return valor >= 100 ? Math.round(valor).toString() : valor.toFixed(1);
  }
  return Math.round(valor).toString();
}

export function NutrientTargetRow({ etiqueta, unidad, consumido, objetivo, limiteSuperior }: NutrientTargetRowProps) {
  const colors = useThemeColors();
  const ratio = objetivo > 0 ? consumido / objetivo : 0;
  const excedeLimite = limiteSuperior != null && consumido > limiteSuperior;
  const anchoPct = Math.min(Math.max(ratio, 0), 1) * 100;
  const colorBarra = excedeLimite ? colors.danger : ratio >= 0.7 ? colors.success : ratio >= 0.4 ? colors.warning : colors.inkMuted;

  return (
    <View style={{ paddingVertical: Spacing.space2 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.space1 }}>
        <AppText variant="body">{etiqueta}</AppText>
        <AppText variant="numeric" color={excedeLimite ? 'danger' : 'ink'}>
          {formatear(consumido, unidad)} / {formatear(objetivo, unidad)} {unidad}
        </AppText>
      </View>
      <View style={{ height: 6, borderRadius: Radius.pill, backgroundColor: colors.surface300, overflow: 'hidden' }}>
        <View style={{ width: `${anchoPct}%`, height: '100%', borderRadius: Radius.pill, backgroundColor: colorBarra }} />
      </View>
      {excedeLimite ? (
        <AppText variant="caption" color="danger" style={{ marginTop: 2 }}>
          Por encima del límite superior recomendado ({formatear(limiteSuperior!, unidad)} {unidad})
        </AppText>
      ) : null}
    </View>
  );
}
