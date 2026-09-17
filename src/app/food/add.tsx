import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Card } from '@/components/ui/Card';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useDailyLog } from '@/lib/hooks/useDailyLog';
import { buscarPorCodigoBarras, buscarPorNombre, BusquedaError } from '@/lib/openfoodfacts';
import { formatearFechaLarga, hoyISO } from '@/lib/date';
import { INGREDIENTES, componerAlimentoDesdeIngredientes, pesoTotalIngredientes, type IngredienteReferencia, type ItemIngrediente } from '@/lib/nutrition/ingredientes';
import type { Alimento, Comida } from '@/types/nutrition';

type Paso = 'inicio' | 'resultados' | 'cantidad' | 'manual' | 'ingredientes';

export default function AddFoodScreen() {
  const params = useLocalSearchParams<{ comida: Comida; codigoBarras?: string; fecha?: string }>();
  const comida = params.comida ?? 'desayuno';
  const fecha = params.fecha ?? hoyISO();
  const colors = useThemeColors();
  const { registrarAlimento } = useDailyLog(fecha);

  const [paso, setPaso] = useState<Paso>('inicio');
  const [query, setQuery] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<Alimento[]>([]);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState<Alimento | null>(null);
  const [cantidadG, setCantidadG] = useState('100');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [manual, setManual] = useState({ nombre: '', kcal: '', proteina: '', carbohidratos: '', grasa: '', fibra: '' });

  const [nombrePlato, setNombrePlato] = useState('');
  const [buscarIngrediente, setBuscarIngrediente] = useState('');
  const [itemsIngredientes, setItemsIngredientes] = useState<ItemIngrediente[]>([]);

  useEffect(() => {
    if (params.codigoBarras) {
      lookupCodigoBarras(params.codigoBarras);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.codigoBarras]);

  async function lookupCodigoBarras(codigo: string) {
    setBuscando(true);
    setError(null);
    const alimento = await buscarPorCodigoBarras(codigo);
    setBuscando(false);
    if (alimento) {
      setAlimentoSeleccionado(alimento);
      setPaso('cantidad');
    } else {
      setManual((m) => ({ ...m, nombre: '' }));
      setError('No encontramos ese producto. Añádelo manualmente.');
      setPaso('manual');
    }
  }

  async function buscar() {
    if (!query.trim()) return;
    setBuscando(true);
    setError(null);
    try {
      const res = await buscarPorNombre(query.trim());
      setResultados(res);
      setPaso('resultados');
    } catch (e) {
      setError(e instanceof BusquedaError ? e.message : 'No se pudo buscar. Inténtalo de nuevo.');
    } finally {
      setBuscando(false);
    }
  }

  function seleccionar(alimento: Alimento) {
    setAlimentoSeleccionado(alimento);
    setCantidadG('100');
    setPaso('cantidad');
  }

  function confirmarManual() {
    const alimento: Alimento = {
      id: `manual-${Date.now()}`,
      nombre: manual.nombre || 'Alimento manual',
      marca: null,
      codigoBarras: params.codigoBarras ?? null,
      kcalPor100g: Number(manual.kcal) || 0,
      proteinaPor100g: Number(manual.proteina) || 0,
      carbohidratosPor100g: Number(manual.carbohidratos) || 0,
      grasaPor100g: Number(manual.grasa) || 0,
      fibraPor100g: manual.fibra ? Number(manual.fibra) : null,
      fuente: 'manual',
    };
    setAlimentoSeleccionado(alimento);
    setCantidadG('100');
    setPaso('cantidad');
  }

  function anadirIngrediente(ingrediente: IngredienteReferencia) {
    setItemsIngredientes((items) => [...items, { ingrediente, gramos: 100 }]);
    setBuscarIngrediente('');
  }

  function actualizarGramosIngrediente(indice: number, gramos: number) {
    setItemsIngredientes((items) => items.map((it, i) => (i === indice ? { ...it, gramos } : it)));
  }

  function quitarIngrediente(indice: number) {
    setItemsIngredientes((items) => items.filter((_, i) => i !== indice));
  }

  function confirmarIngredientes() {
    const alimento = componerAlimentoDesdeIngredientes(nombrePlato || 'Plato casero', itemsIngredientes);
    setAlimentoSeleccionado(alimento);
    setCantidadG(String(Math.round(pesoTotalIngredientes(itemsIngredientes))));
    setPaso('cantidad');
  }

  const ingredientesFiltrados = buscarIngrediente.trim()
    ? INGREDIENTES.filter((i) => i.nombre.toLowerCase().includes(buscarIngrediente.trim().toLowerCase()))
    : [];

  async function confirmarRegistro() {
    if (!alimentoSeleccionado) return;
    setGuardando(true);
    setError(null);
    const err = await registrarAlimento(alimentoSeleccionado, Number(cantidadG) || 100, comida);
    setGuardando(false);
    if (err) {
      setError(err);
      return;
    }
    router.back();
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <AppText variant="h1">Añadir alimento</AppText>
          <AppText variant="bodySm" color="inkMuted">
            {formatearFechaLarga(fecha)}
          </AppText>
        </View>
        <Pressable onPress={() => router.back()}>
          <AppText variant="body" color="brand">
            Cerrar
          </AppText>
        </Pressable>
      </View>

      {paso === 'inicio' && (
        <View style={{ gap: Spacing.space4 }}>
          <TextField
            label="Buscar alimento"
            value={query}
            onChangeText={setQuery}
            placeholder="Ej. pechuga de pollo"
            onSubmitEditing={buscar}
            returnKeyType="search"
          />
          {error ? (
            <AppText variant="bodySm" color="danger">
              {error}
            </AppText>
          ) : null}
          <Button label="Buscar" onPress={buscar} loading={buscando} />
          <Button
            label="Escanear código de barras"
            variant="accent"
            onPress={() => router.push({ pathname: '/food/scan', params: { comida, fecha } })}
          />
          <Button label="Entrada manual" variant="secondary" onPress={() => setPaso('manual')} />
          <Button label="Componer por ingredientes" variant="ghost" onPress={() => setPaso('ingredientes')} />
        </View>
      )}

      {paso === 'ingredientes' && (
        <View style={{ gap: Spacing.space4 }}>
          <AppText variant="body" color="inkMuted">
            Para platos caseros sin código de barras: añade los ingredientes y sus cantidades, y estimamos las kcal,
            macros y micronutrientes a partir de ellos.
          </AppText>
          <TextField label="Nombre del plato" value={nombrePlato} onChangeText={setNombrePlato} placeholder="Ej. Ensalada de pollo" />

          <TextField
            label="Añadir ingrediente"
            value={buscarIngrediente}
            onChangeText={setBuscarIngrediente}
            placeholder="Ej. arroz, pollo, aceite..."
          />
          {ingredientesFiltrados.length > 0 ? (
            <View style={{ gap: Spacing.space2 }}>
              {ingredientesFiltrados.map((ing) => (
                <Pressable
                  key={ing.id}
                  onPress={() => anadirIngrediente(ing)}
                  style={{ padding: Spacing.space3, borderRadius: Radius.md, backgroundColor: colors.surface300 }}
                >
                  <AppText variant="body">{ing.nombre}</AppText>
                  <AppText variant="caption" color="inkMuted">
                    {ing.categoria} · {ing.por100g.kcal} kcal / 100 g
                  </AppText>
                </Pressable>
              ))}
            </View>
          ) : null}

          {itemsIngredientes.length > 0 ? (
            <View style={{ gap: Spacing.space3 }}>
              <AppText variant="label" color="inkMuted">
                Ingredientes del plato
              </AppText>
              {itemsIngredientes.map((item, i) => (
                <View key={`${item.ingrediente.id}-${i}`} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.space3 }}>
                  <AppText variant="body" style={{ flex: 1 }}>
                    {item.ingrediente.nombre}
                  </AppText>
                  <View style={{ width: 90 }}>
                    <TextField
                      label=""
                      keyboardType="decimal-pad"
                      value={String(item.gramos)}
                      onChangeText={(v) => actualizarGramosIngrediente(i, Number(v) || 0)}
                    />
                  </View>
                  <AppText variant="bodySm" color="inkMuted">
                    g
                  </AppText>
                  <Pressable onPress={() => quitarIngrediente(i)} hitSlop={8}>
                    <AppText variant="body" color="danger">
                      ×
                    </AppText>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}

          <Button
            label="Continuar"
            onPress={confirmarIngredientes}
            disabled={itemsIngredientes.length === 0 || !nombrePlato.trim()}
          />
        </View>
      )}

      {paso === 'resultados' && (
        <View style={{ gap: Spacing.space2 }}>
          {resultados.length === 0 ? (
            <AppText variant="body" color="inkMuted">
              Sin resultados. Prueba con entrada manual.
            </AppText>
          ) : (
            resultados.map((a, i) => (
              <Pressable
                key={`${a.id}-${i}`}
                onPress={() => seleccionar(a)}
                style={{ padding: Spacing.space3, borderRadius: Radius.md, backgroundColor: colors.surface200, borderWidth: 1, borderColor: colors.border }}
              >
                <AppText variant="bodyLg">{a.nombre}</AppText>
                <AppText variant="bodySm" color="inkMuted">
                  {a.marca ? `${a.marca} · ` : ''}
                  {Math.round(a.kcalPor100g)} kcal / 100 g
                </AppText>
              </Pressable>
            ))
          )}
          <Button label="Entrada manual" variant="ghost" onPress={() => setPaso('manual')} />
        </View>
      )}

      {paso === 'manual' && (
        <View style={{ gap: Spacing.space4 }}>
          {error ? (
            <AppText variant="bodySm" color="danger">
              {error}
            </AppText>
          ) : null}
          <TextField label="Nombre" value={manual.nombre} onChangeText={(v) => setManual((m) => ({ ...m, nombre: v }))} />
          <View style={{ flexDirection: 'row', gap: Spacing.space3 }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Kcal / 100 g"
                keyboardType="decimal-pad"
                value={manual.kcal}
                onChangeText={(v) => setManual((m) => ({ ...m, kcal: v }))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label="Proteína g / 100 g"
                keyboardType="decimal-pad"
                value={manual.proteina}
                onChangeText={(v) => setManual((m) => ({ ...m, proteina: v }))}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.space3 }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Hidratos g / 100 g"
                keyboardType="decimal-pad"
                value={manual.carbohidratos}
                onChangeText={(v) => setManual((m) => ({ ...m, carbohidratos: v }))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label="Grasas g / 100 g"
                keyboardType="decimal-pad"
                value={manual.grasa}
                onChangeText={(v) => setManual((m) => ({ ...m, grasa: v }))}
              />
            </View>
          </View>
          <TextField
            label="Fibra g / 100 g (opcional)"
            keyboardType="decimal-pad"
            value={manual.fibra}
            onChangeText={(v) => setManual((m) => ({ ...m, fibra: v }))}
          />
          <Button label="Continuar" onPress={confirmarManual} disabled={!manual.nombre || !manual.kcal} />
        </View>
      )}

      {paso === 'cantidad' && alimentoSeleccionado && (
        <View style={{ gap: Spacing.space4 }}>
          <Card>
            <AppText variant="h3">{alimentoSeleccionado.nombre}</AppText>
            <AppText variant="bodySm" color="inkMuted">
              {Math.round(alimentoSeleccionado.kcalPor100g)} kcal / 100 g
            </AppText>
          </Card>
          <TextField label="Cantidad (g)" keyboardType="decimal-pad" value={cantidadG} onChangeText={setCantidadG} />
          <AppText variant="body" color="inkMuted">
            {Math.round((alimentoSeleccionado.kcalPor100g * Number(cantidadG || '0')) / 100)} kcal en esta ración
          </AppText>
          {error ? (
            <AppText variant="bodySm" color="danger">
              {error}
            </AppText>
          ) : null}
          <Button label={`Añadir a ${comida}`} onPress={confirmarRegistro} loading={guardando} />
        </View>
      )}

      {buscando && paso === 'inicio' ? <ActivityIndicator color={colors.brand} /> : null}
    </Screen>
  );
}
