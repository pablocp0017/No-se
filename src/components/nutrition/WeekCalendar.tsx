import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { diasDeSemana, esFuturo, esHoy, inicialDia, numeroDia, sumarDias } from '@/lib/date';

interface WeekCalendarProps {
  fechaSeleccionada: string;
  onSeleccionar: (fecha: string) => void;
}

export function WeekCalendar({ fechaSeleccionada, onSeleccionar }: WeekCalendarProps) {
  const colors = useThemeColors();
  const dias = diasDeSemana(fechaSeleccionada);

  function cambiarSemana(delta: number) {
    onSeleccionar(sumarDias(fechaSeleccionada, delta * 7));
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.space1 }}>
      <Pressable onPress={() => cambiarSemana(-1)} hitSlop={12} style={{ padding: Spacing.space1 }}>
        <Ionicons name="chevron-back" size={20} color={colors.inkMuted} />
      </Pressable>

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        {dias.map((dia) => {
          const seleccionado = dia === fechaSeleccionada;
          const hoy = esHoy(dia);
          const deshabilitado = esFuturo(dia);
          return (
            <Pressable
              key={dia}
              onPress={() => !deshabilitado && onSeleccionar(dia)}
              disabled={deshabilitado}
              style={{
                width: 40,
                height: 56,
                borderRadius: Radius.md,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                backgroundColor: seleccionado ? colors.brand : 'transparent',
                borderWidth: !seleccionado && hoy ? 1.5 : 0,
                borderColor: colors.brand,
                opacity: deshabilitado ? 0.35 : 1,
              }}
            >
              <AppText variant="caption" color={seleccionado ? 'onBrand' : 'inkMuted'}>
                {inicialDia(dia)}
              </AppText>
              <AppText variant="h3" color={seleccionado ? 'onBrand' : 'ink'}>
                {numeroDia(dia)}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => cambiarSemana(1)} hitSlop={12} style={{ padding: Spacing.space1 }}>
        <Ionicons name="chevron-forward" size={20} color={colors.inkMuted} />
      </Pressable>
    </View>
  );
}
