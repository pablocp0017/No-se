import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface NutrientRingProps {
  progreso: number; // 0-1, puede superar 1 (se trata como exceso)
  tamano?: number;
  grosor?: number;
  color?: string;
  valorCentral?: string;
  etiquetaCentral?: string;
}

export function NutrientRing({
  progreso,
  tamano = 180,
  grosor = 14,
  color,
  valorCentral,
  etiquetaCentral,
}: NutrientRingProps) {
  const colors = useThemeColors();
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const excedido = progreso > 1;
  const progresoClamp = Math.min(Math.max(progreso, 0), 1);
  const offset = circunferencia * (1 - progresoClamp);
  const colorTrazo = color ?? (excedido ? colors.danger : colors.brand);

  return (
    <View style={{ width: tamano, height: tamano, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`}>
        <Circle cx={tamano / 2} cy={tamano / 2} r={radio} stroke={colors.border} strokeWidth={grosor} fill="none" />
        <Circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          stroke={colorTrazo}
          strokeWidth={grosor}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circunferencia} ${circunferencia}`}
          strokeDashoffset={offset}
          rotation="-90"
          origin={`${tamano / 2}, ${tamano / 2}`}
        />
      </Svg>
      {valorCentral ? (
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <AppText variant={tamano >= 140 ? 'displayXl' : 'h2'}>{valorCentral}</AppText>
          {etiquetaCentral ? (
            <AppText variant="caption" color="inkMuted">
              {etiquetaCentral}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
