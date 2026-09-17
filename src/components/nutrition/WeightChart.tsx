import { View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { PuntoPeso } from '@/lib/hooks/useWeightLogs';

interface WeightChartProps {
  historial: PuntoPeso[];
  alturaPx?: number;
}

export function WeightChart({ historial, alturaPx = 140 }: WeightChartProps) {
  const colors = useThemeColors();
  const ancho = 320;

  if (historial.length < 2) {
    return (
      <View style={{ height: alturaPx, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="bodySm" color="inkMuted">
          Registra al menos dos pesos para ver tu evolución.
        </AppText>
      </View>
    );
  }

  const pesos = historial.map((p) => p.pesoKg);
  const min = Math.min(...pesos);
  const max = Math.max(...pesos);
  const rango = max - min || 1;
  const paddingY = 16;

  const puntos = historial.map((p, i) => {
    const x = (i / (historial.length - 1)) * ancho;
    const y = paddingY + (1 - (p.pesoKg - min) / rango) * (alturaPx - paddingY * 2);
    return { x, y };
  });

  const puntosStr = puntos.map((p) => `${p.x},${p.y}`).join(' ');
  const ultimo = historial[historial.length - 1];
  const primero = historial[0];
  const delta = ultimo.pesoKg - primero.pesoKg;

  return (
    <View>
      <Svg width={ancho} height={alturaPx}>
        <Polyline points={puntosStr} fill="none" stroke={colors.brand} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        {puntos.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={i === puntos.length - 1 ? 5 : 3} fill={colors.brand} />
        ))}
      </Svg>
      <AppText variant="bodySm" color="inkMuted" style={{ marginTop: 4 }}>
        {delta === 0 ? 'Sin cambios' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)} kg`} desde el {new Date(primero.fecha).toLocaleDateString('es-ES')}
      </AppText>
    </View>
  );
}
