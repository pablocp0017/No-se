import { View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface MacroBarProps {
  nombre: string;
  color: string;
  consumidoG: number;
  objetivoG: number;
}

export function MacroBar({ nombre, color, consumidoG, objetivoG }: MacroBarProps) {
  const colors = useThemeColors();
  const ratio = objetivoG > 0 ? consumidoG / objetivoG : 0;
  const excedido = ratio > 1;
  const anchoPct = Math.min(Math.max(ratio, 0), 1) * 100;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.space3, paddingVertical: Spacing.space2 }}>
      <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: color }} />
      <AppText variant="bodySm" style={{ width: 76 }}>
        {nombre}
      </AppText>
      <View style={{ flex: 1, height: 10, borderRadius: Radius.pill, backgroundColor: colors.surface300, overflow: 'hidden' }}>
        <View
          style={{
            width: `${anchoPct}%`,
            height: '100%',
            borderRadius: Radius.pill,
            backgroundColor: excedido ? colors.danger : color,
          }}
        />
      </View>
      <AppText variant="numeric" style={{ width: 82, textAlign: 'right' }}>
        {Math.round(consumidoG)} / {Math.round(objetivoG)} g
      </AppText>
    </View>
  );
}
