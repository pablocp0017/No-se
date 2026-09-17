import type { Alimento } from '@/types/nutrition';

const BASE_URL = 'https://world.openfoodfacts.org';

// Open Food Facts pide identificar la app en el User-Agent para priorizar tráfico legítimo.
const HEADERS = { 'User-Agent': 'NutriGoal - App nutrición - Version 1.0' };

interface OffProduct {
  code?: string;
  product_name?: string;
  product_name_es?: string;
  brands?: string;
  nutriments?: Record<string, number>;
}

// Open Food Facts normaliza todos los nutrientes de los campos "_100g" a gramos (unidad base),
// sea cual sea la unidad en la que el producto los declaró originalmente (mg, µg...).
// Por eso hay que reconvertir a mg/µg según el nutriente para poder compararlos con nuestros
// objetivos de referencia (EFSA/NIH), que usan esas unidades.
function microsDesdeNutrimentos(n: Record<string, number>): Record<string, number> | null {
  const micros: Record<string, number> = {};
  const enMg = (clave: string, campo: string) => {
    if (n[campo] != null) micros[clave] = n[campo] * 1000;
  };
  const enUg = (clave: string, campo: string) => {
    if (n[campo] != null) micros[clave] = n[campo] * 1_000_000;
  };

  enUg('vitaminaA_ug', 'vitamin-a_100g');
  enMg('vitaminaC_mg', 'vitamin-c_100g');
  enUg('vitaminaD_ug', 'vitamin-d_100g');
  enMg('vitaminaE_mg', 'vitamin-e_100g');
  enUg('vitaminaK_ug', 'vitamin-k_100g');
  enMg('b1Tiamina_mg', 'vitamin-b1_100g');
  enMg('b2Riboflavina_mg', 'vitamin-b2_100g');
  enMg('b3Niacina_mg', 'vitamin-pp_100g');
  enMg('b6_mg', 'vitamin-b6_100g');
  enUg('b9Folato_ug', 'vitamin-b9_100g');
  enUg('b12_ug', 'vitamin-b12_100g');
  enMg('calcio_mg', 'calcium_100g');
  enMg('hierro_mg', 'iron_100g');
  enMg('magnesio_mg', 'magnesium_100g');
  enMg('fosforo_mg', 'phosphorus_100g');
  enMg('potasio_mg', 'potassium_100g');
  enMg('zinc_mg', 'zinc_100g');
  enMg('cobre_mg', 'copper_100g');
  enMg('manganeso_mg', 'manganese_100g');
  enUg('selenio_ug', 'selenium_100g');
  enUg('yodo_ug', 'iodine_100g');

  return Object.keys(micros).length > 0 ? micros : null;
}

function alimentoDesdeProducto(p: OffProduct): Alimento | null {
  const n = p.nutriments ?? {};
  const kcal = n['energy-kcal_100g'];
  if (kcal == null) return null;

  return {
    id: p.code ?? '',
    nombre: p.product_name_es || p.product_name || 'Producto sin nombre',
    marca: p.brands ?? null,
    codigoBarras: p.code ?? null,
    kcalPor100g: kcal,
    proteinaPor100g: n['proteins_100g'] ?? 0,
    carbohidratosPor100g: n['carbohydrates_100g'] ?? 0,
    grasaPor100g: n['fat_100g'] ?? 0,
    fibraPor100g: n['fiber_100g'] ?? null,
    azucarPor100g: n['sugars_100g'] ?? null,
    sodioMgPor100g: n['sodium_100g'] != null ? n['sodium_100g'] * 1000 : null,
    micros: microsDesdeNutrimentos(n),
    fuente: 'openfoodfacts',
  };
}

/** Busca un producto por su código de barras (EAN-13/UPC) en Open Food Facts. */
export async function buscarPorCodigoBarras(codigo: string): Promise<Alimento | null> {
  const res = await fetch(`${BASE_URL}/api/v2/product/${encodeURIComponent(codigo)}.json`, { headers: HEADERS });
  if (!res.ok) return null;
  const json = await res.json();
  if (json.status !== 1 || !json.product) return null;
  return alimentoDesdeProducto(json.product);
}

export class BusquedaError extends Error {}

const SEARCH_URL = 'https://search.openfoodfacts.org';

/**
 * Búsqueda de productos por nombre (fallback cuando no hay código de barras).
 * Usa "Search-a-licious" (search.openfoodfacts.org), el buscador de texto libre que reemplaza
 * a los antiguos /cgi/search.pl (roto, da 503) y /api/v2/search (no admite texto libre, solo
 * filtros por categoría/marca exactos).
 */
export async function buscarPorNombre(query: string): Promise<Alimento[]> {
  const params = new URLSearchParams({
    q: query,
    page_size: '20',
    langs: 'es,en',
    fields: 'code,product_name,product_name_es,brands,nutriments',
  });
  let res: Response;
  try {
    res = await fetch(`${SEARCH_URL}/search?${params.toString()}`, { headers: HEADERS });
  } catch {
    throw new BusquedaError('No se pudo conectar con Open Food Facts. Revisa tu conexión.');
  }
  if (!res.ok) {
    throw new BusquedaError('Open Food Facts no está respondiendo ahora mismo. Prueba a escanear o usa entrada manual.');
  }
  const json = await res.json();
  // La forma exacta de la respuesta de Search-a-licious (servicio nuevo, en evolución) no está
  // fijada en un único formato documentado; se comprueban las variantes más probables.
  const crudos: unknown[] = json.hits ?? json.products ?? json.results ?? [];
  const productos: OffProduct[] = crudos.map((h) => (h as { _source?: OffProduct })._source ?? (h as OffProduct));
  return productos.map(alimentoDesdeProducto).filter((a): a is Alimento => a !== null);
}
