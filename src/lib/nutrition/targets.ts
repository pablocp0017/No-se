import type { MicronutrienteTarget, Perfil } from '@/types/nutrition';
import {
  VITAMINAS,
  MINERALES,
  ELECTROLITOS,
  AMINOACIDOS_MG_POR_KG,
  LIMITES_SUPERIORES,
  type RangoSexo,
  type Sexo,
} from './constants';

function valor(v: number | RangoSexo, sexo: Sexo): number {
  return typeof v === 'number' ? v : v[sexo];
}

const ETIQUETAS_VITAMINAS: Record<string, string> = {
  vitaminaA_ug: 'Vitamina A',
  vitaminaC_mg: 'Vitamina C',
  vitaminaD_ug: 'Vitamina D',
  vitaminaE_mg: 'Vitamina E',
  vitaminaK_ug: 'Vitamina K',
  b1Tiamina_mg: 'Vitamina B1 (Tiamina)',
  b2Riboflavina_mg: 'Vitamina B2 (Riboflavina)',
  b3Niacina_mg: 'Vitamina B3 (Niacina)',
  b5AcidoPantotenico_mg: 'Vitamina B5 (Ác. pantoténico)',
  b6_mg: 'Vitamina B6',
  b7Biotina_ug: 'Vitamina B7 (Biotina)',
  b9Folato_ug: 'Folato (B9)',
  b12_ug: 'Vitamina B12',
};

const ETIQUETAS_MINERALES: Record<string, string> = {
  calcio_mg: 'Calcio',
  hierro_mg: 'Hierro',
  magnesio_mg: 'Magnesio',
  fosforo_mg: 'Fósforo',
  potasio_mg: 'Potasio',
  sodio_mg: 'Sodio',
  zinc_mg: 'Zinc',
  cobre_mg: 'Cobre',
  manganeso_mg: 'Manganeso',
  selenio_ug: 'Selenio',
  yodo_ug: 'Yodo',
  cromo_ug: 'Cromo',
};

const ETIQUETAS_AMINOACIDOS: Record<string, string> = {
  histidina: 'Histidina',
  isoleucina: 'Isoleucina',
  leucina: 'Leucina',
  lisina: 'Lisina',
  metioninaCisteina: 'Metionina + Cisteína',
  fenilalaninaTirosina: 'Fenilalanina + Tirosina',
  treonina: 'Treonina',
  triptofano: 'Triptófano',
  valina: 'Valina',
};

export function unidadDesdeClave(clave: string): string {
  if (clave.endsWith('_ug')) return 'µg';
  if (clave.endsWith('_mg')) return 'mg';
  return 'mg';
}

/** Etiquetas legibles para cualquier clave de nutriente, usado para mostrar los micros que trae un alimento. */
export const ETIQUETAS_NUTRIENTES: Record<string, string> = {
  ...ETIQUETAS_VITAMINAS,
  ...ETIQUETAS_MINERALES,
  cloruro_mg: 'Cloruro',
};

export function etiquetaNutriente(clave: string): string {
  return ETIQUETAS_NUTRIENTES[clave] ?? clave;
}

/**
 * Construye la lista completa de objetivos de micronutrientes (vitaminas, minerales,
 * electrolitos, aminoácidos) personalizados para el perfil del usuario.
 */
export function construirMicronutrienteTargets(perfil: Pick<Perfil, 'sexo' | 'edad' | 'pesoKg'>): MicronutrienteTarget[] {
  const { sexo, edad, pesoKg } = perfil;
  const targets: MicronutrienteTarget[] = [];

  for (const [clave, v] of Object.entries(VITAMINAS)) {
    targets.push({
      clave,
      etiqueta: ETIQUETAS_VITAMINAS[clave] ?? clave,
      unidad: unidadDesdeClave(clave),
      objetivo: valor(v as number | RangoSexo, sexo),
      limiteSuperior: (LIMITES_SUPERIORES as Record<string, number>)[clave],
      categoria: 'vitamina',
    });
  }

  for (const [clave, v] of Object.entries(MINERALES)) {
    let objetivo = valor(v as number | RangoSexo, sexo);
    // Hierro: PRI de mujer (16mg) aplica a edad fértil; a partir de los 50 se asimila a necesidad de hombre (11mg)
    if (clave === 'hierro_mg' && sexo === 'mujer' && edad >= 50) {
      objetivo = MINERALES.hierro_mg.hombre;
    }
    targets.push({
      clave,
      etiqueta: ETIQUETAS_MINERALES[clave] ?? clave,
      unidad: unidadDesdeClave(clave),
      objetivo,
      limiteSuperior: (LIMITES_SUPERIORES as Record<string, number>)[clave],
      categoria: 'mineral',
    });
  }

  targets.push({
    clave: 'cloruro_mg',
    etiqueta: 'Cloruro',
    unidad: 'mg',
    objetivo: ELECTROLITOS.cloruro_mg,
    categoria: 'electrolito',
  });

  for (const [clave, mgPorKg] of Object.entries(AMINOACIDOS_MG_POR_KG)) {
    targets.push({
      clave: `aa_${clave}`,
      etiqueta: ETIQUETAS_AMINOACIDOS[clave] ?? clave,
      unidad: 'mg',
      objetivo: Math.round(mgPorKg * pesoKg),
      categoria: 'aminoacido',
    });
  }

  return targets;
}
