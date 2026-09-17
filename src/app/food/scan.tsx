import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { Comida } from '@/types/nutrition';

export default function ScanScreen() {
  const params = useLocalSearchParams<{ comida: Comida }>();
  const colors = useThemeColors();
  const [permission, requestPermission] = useCameraPermissions();
  const yaEscaneado = useRef(false);

  function onBarcodeScanned(resultado: BarcodeScanningResult) {
    if (yaEscaneado.current) return;
    yaEscaneado.current = true;
    router.replace({ pathname: '/food/add', params: { comida: params.comida, codigoBarras: resultado.data } });
  }

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: colors.surface100 }} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centro, { backgroundColor: colors.surface100, padding: Spacing.space4 }]}>
        <AppText variant="h2" style={{ textAlign: 'center', marginBottom: Spacing.space3 }}>
          Necesitamos acceso a la cámara
        </AppText>
        <AppText variant="body" color="inkMuted" style={{ textAlign: 'center', marginBottom: Spacing.space4 }}>
          Para escanear el código de barras del producto y rellenar sus datos automáticamente.
        </AppText>
        <Button label="Permitir cámara" onPress={requestPermission} />
        <Pressable onPress={() => router.back()} style={{ marginTop: Spacing.space3 }}>
          <AppText variant="body" color="brand">
            Cancelar
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        onBarcodeScanned={onBarcodeScanned}
      />
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.marco} />
        <AppText variant="body" style={{ color: '#fff', textAlign: 'center', marginTop: Spacing.space4 }}>
          Encuadra el código de barras
        </AppText>
      </View>
      <Pressable style={styles.cerrar} onPress={() => router.back()}>
        <AppText variant="label" style={{ color: '#fff' }}>
          Cancelar
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  marco: { width: 260, height: 160, borderRadius: 16, borderWidth: 3, borderColor: '#ff6b4a' },
  cerrar: { position: 'absolute', top: 60, left: 24, padding: 12 },
});
