import type { Alimento } from '@/types/nutrition';

const BASE_URL = 'https://world.openfoodfacts.org';

interface OffProduct {
  code?: string;
  product_name?: string;
  product_name_es?: string;
  brands?: string;
  nutriments?: Record<string, number>;
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
    fuente: 'openfoodfacts',
  };
}

/** Busca un producto por su código de barras (EAN-13/UPC) en Open Food Facts. */
export async function buscarPorCodigoBarras(codigo: string): Promise<Alimento | null> {
  const res = await fetch(`${BASE_URL}/api/v2/product/${encodeURIComponent(codigo)}.json`);
  if (!res.ok) return null;
  const json = await res.json();
  if (json.status !== 1 || !json.product) return null;
  return alimentoDesdeProducto(json.product);
}

/** Búsqueda de productos por nombre (fallback cuando no hay código de barras). */
export async function buscarPorNombre(query: string): Promise<Alimento[]> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '20',
    fields: 'code,product_name,product_name_es,brands,nutriments',
  });
  const res = await fetch(`${BASE_URL}/cgi/search.pl?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  const productos: OffProduct[] = json.products ?? [];
  return productos.map(alimentoDesdeProducto).filter((a): a is Alimento => a !== null);
}
