import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { etiquetaNutriente, unidadDesdeClave } from '@/lib/nutrition/targets';
import type { RegistroComida } from '@/types/nutrition';

interface FoodRowProps {
  registro: RegistroComida;
  onEliminar?: () => void;
  esPrimero?: boolean;
}

function formatearCantidad(valor: number, unidad: string): string {
  const decimales = unidad === 'µg' || valor < 10 ? 1 : 0;
  return `${valor.toFixed(decimales)} ${unidad}`;
}

export function FoodRow({ registro, onEliminar, esPrimero }: FoodRowProps) {
  const colors = useThemeColors();
  const [expandido, setExpandido] = useState(false);
  const factor = registro.cantidadG / 100;
  const { alimento } = registro;

  const kcal = Math.round(alimento.kcalPor100g * factor);
  const proteina = alimento.proteinaPor100g * factor;
  const carbohidratos = alimento.carbohidratosPor100g * factor;
  const grasa = alimento.grasaPor100g * factor;
  const fibra = alimento.fibraPor100g != null ? alimento.fibraPor100g * factor : null;

  const microsEntries = alimento.micros ? Object.entries(alimento.micros) : [];

  return (
    <Pressable
      onPress={() => setExpandido((v) => !v)}
      onLongPress={onEliminar}
      style={{
        paddingVertical: Spacing.space3,
        borderTopWidth: esPrimero ? 0 : 1,
        borderTopColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: Spacing.space3 }}>
          <AppText variant="bodyLg">{alimento.nombre}</AppText>
          <AppText variant="bodySm" color="inkMuted">
            {alimento.marca ? `${alimento.marca} · ` : ''}
            {Math.round(registro.cantidadG)} g
          </AppText>
        </View>
        <AppText variant="numeric">{kcal} kcal</AppText>
      </View>

      <View style={{ flexDirection: 'row', gap: Spacing.space3, marginTop: Spacing.space1 }}>
        <AppText variant="caption" color="inkMuted">
          P {proteina.toFixed(1)} g
        </AppText>
        <AppText variant="caption" color="inkMuted">
          H {carbohidratos.toFixed(1)} g
        </AppText>
        <AppText variant="caption" color="inkMuted">
          G {grasa.toFixed(1)} g
        </AppText>
        {fibra != null ? (
          <AppText variant="caption" color="inkMuted">
            Fibra {fibra.toFixed(1)} g
          </AppText>
        ) : null}
      </View>

      {expandido ? (
        <View
          style={{
            marginTop: Spacing.space3,
            padding: Spacing.space3,
            borderRadius: 12,
            backgroundColor: colors.surface300,
            gap: Spacing.space1,
          }}
        >
          <AppText variant="label" color="inkMuted">
            Micronutrientes ({Math.round(registro.cantidadG)} g)
          </AppText>
          {microsEntries.length === 0 ? (
            <AppText variant="bodySm" color="inkMuted">
              Open Food Facts no reporta micronutrientes para este producto.
            </AppText>
          ) : (
            microsEntries.map(([clave, por100g]) => (
              <View key={clave} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText variant="bodySm">{etiquetaNutriente(clave)}</AppText>
                <AppText variant="bodySm" color="inkMuted">
                  {formatearCantidad(por100g * factor, unidadDesdeClave(clave))}
                </AppText>
              </View>
            ))
          )}
        </View>
      ) : null}
    </Pressable>
  );
}
