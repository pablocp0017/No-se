import type { Alimento } from '@/types/nutrition';

/**
 * Base de datos local de ingredientes habituales, con valores nutricionales aproximados por
 * 100 g (referencias de composición de alimentos de uso general, no de un producto concreto).
 * Se usa para estimar los micronutrientes de platos caseros que no tienen código de barras.
 */
export interface IngredienteReferencia {
  id: string;
  nombre: string;
  categoria: string;
  /** Para estimar aminoácidos a partir del contenido de proteína (ver estimarAminoacidosPor100g). */
  tipoProteina?: 'animal' | 'vegetal';
  por100g: {
    kcal: number;
    proteina: number;
    carbohidratos: number;
    grasa: number;
    fibra: number;
    sodioMg?: number;
    micros?: Record<string, number>;
  };
}

export const INGREDIENTES: IngredienteReferencia[] = [
  {
    id: 'pechuga_pollo',
    nombre: 'Pechuga de pollo (cruda)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: {
      kcal: 165,
      proteina: 31,
      carbohidratos: 0,
      grasa: 3.6,
      fibra: 0,
      sodioMg: 74,
      micros: { hierro_mg: 0.7, zinc_mg: 1.0, potasio_mg: 256, b3Niacina_mg: 13.7, b6_mg: 0.6 },
    },
  },
  {
    id: 'huevo',
    nombre: 'Huevo entero',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: {
      kcal: 155,
      proteina: 13,
      carbohidratos: 1.1,
      grasa: 11,
      fibra: 0,
      sodioMg: 124,
      micros: { vitaminaA_ug: 160, vitaminaD_ug: 2, b12_ug: 0.9, calcio_mg: 50, hierro_mg: 1.8, zinc_mg: 1.3, selenio_ug: 30 },
    },
  },
  {
    id: 'salmon',
    nombre: 'Salmón (crudo)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: {
      kcal: 208,
      proteina: 20,
      carbohidratos: 0,
      grasa: 13,
      fibra: 0,
      sodioMg: 59,
      micros: { vitaminaD_ug: 11, b12_ug: 3.2, potasio_mg: 363, selenio_ug: 36, magnesio_mg: 29 },
    },
  },
  {
    id: 'atun_lata',
    nombre: 'Atún en lata (al natural)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: {
      kcal: 116,
      proteina: 26,
      carbohidratos: 0,
      grasa: 1,
      fibra: 0,
      sodioMg: 300,
      micros: { b12_ug: 2.2, selenio_ug: 80, potasio_mg: 237, vitaminaD_ug: 1.7 },
    },
  },
  {
    id: 'ternera_magra',
    nombre: 'Ternera magra (cruda)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: {
      kcal: 172,
      proteina: 21,
      carbohidratos: 0,
      grasa: 9,
      fibra: 0,
      sodioMg: 60,
      micros: { hierro_mg: 2.1, zinc_mg: 4.8, b12_ug: 2.6, potasio_mg: 318 },
    },
  },
  {
    id: 'tofu',
    nombre: 'Tofu firme',
    categoria: 'Proteína vegetal',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 76,
      proteina: 8,
      carbohidratos: 1.9,
      grasa: 4.8,
      fibra: 0.3,
      sodioMg: 7,
      micros: { calcio_mg: 350, hierro_mg: 5.4, magnesio_mg: 30 },
    },
  },
  {
    id: 'lentejas',
    nombre: 'Lentejas (cocidas)',
    categoria: 'Legumbre',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 116,
      proteina: 9,
      carbohidratos: 20,
      grasa: 0.4,
      fibra: 7.9,
      sodioMg: 2,
      micros: { hierro_mg: 3.3, b9Folato_ug: 181, potasio_mg: 369, magnesio_mg: 36, zinc_mg: 1.3 },
    },
  },
  {
    id: 'garbanzos',
    nombre: 'Garbanzos (cocidos)',
    categoria: 'Legumbre',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 164,
      proteina: 8.9,
      carbohidratos: 27.4,
      grasa: 2.6,
      fibra: 7.6,
      sodioMg: 7,
      micros: { hierro_mg: 2.9, b9Folato_ug: 172, magnesio_mg: 48, potasio_mg: 291 },
    },
  },
  {
    id: 'arroz_blanco',
    nombre: 'Arroz blanco (cocido)',
    categoria: 'Cereal',
    por100g: { kcal: 130, proteina: 2.7, carbohidratos: 28, grasa: 0.3, fibra: 0.4, sodioMg: 1, micros: { magnesio_mg: 12, potasio_mg: 35 } },
  },
  {
    id: 'pasta',
    nombre: 'Pasta (cocida)',
    categoria: 'Cereal',
    por100g: { kcal: 131, proteina: 5, carbohidratos: 25, grasa: 1.1, fibra: 1.8, sodioMg: 1, micros: { hierro_mg: 0.9, magnesio_mg: 18 } },
  },
  {
    id: 'pan_integral',
    nombre: 'Pan integral',
    categoria: 'Cereal',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 247,
      proteina: 13,
      carbohidratos: 41,
      grasa: 3.4,
      fibra: 7,
      sodioMg: 400,
      micros: { magnesio_mg: 82, hierro_mg: 2.5, b1Tiamina_mg: 0.4, b3Niacina_mg: 5 },
    },
  },
  {
    id: 'avena',
    nombre: 'Avena (copos secos)',
    categoria: 'Cereal',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 389,
      proteina: 16.9,
      carbohidratos: 66,
      grasa: 6.9,
      fibra: 10.6,
      sodioMg: 2,
      micros: { magnesio_mg: 177, hierro_mg: 4.7, zinc_mg: 4, b1Tiamina_mg: 0.76 },
    },
  },
  {
    id: 'patata',
    nombre: 'Patata (cocida)',
    categoria: 'Tubérculo',
    por100g: { kcal: 87, proteina: 1.9, carbohidratos: 20, grasa: 0.1, fibra: 1.8, sodioMg: 6, micros: { vitaminaC_mg: 13, potasio_mg: 379, b6_mg: 0.3 } },
  },
  {
    id: 'quinoa',
    nombre: 'Quinoa (cocida)',
    categoria: 'Cereal',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 120,
      proteina: 4.4,
      carbohidratos: 21.3,
      grasa: 1.9,
      fibra: 2.8,
      sodioMg: 7,
      micros: { hierro_mg: 1.5, magnesio_mg: 64, zinc_mg: 1.1, b9Folato_ug: 42 },
    },
  },
  {
    id: 'leche_entera',
    nombre: 'Leche entera',
    categoria: 'Lácteo',
    tipoProteina: 'animal',
    por100g: { kcal: 61, proteina: 3.2, carbohidratos: 4.8, grasa: 3.3, fibra: 0, sodioMg: 43, micros: { calcio_mg: 113, b12_ug: 0.45, potasio_mg: 150 } },
  },
  {
    id: 'yogur_natural',
    nombre: 'Yogur natural',
    categoria: 'Lácteo',
    tipoProteina: 'animal',
    por100g: {
      kcal: 61,
      proteina: 3.5,
      carbohidratos: 4.7,
      grasa: 3.2,
      fibra: 0,
      sodioMg: 46,
      micros: { calcio_mg: 121, b12_ug: 0.4, potasio_mg: 155, fosforo_mg: 95 },
    },
  },
  {
    id: 'queso_curado',
    nombre: 'Queso curado',
    categoria: 'Lácteo',
    tipoProteina: 'animal',
    por100g: {
      kcal: 400,
      proteina: 25,
      carbohidratos: 1.3,
      grasa: 33,
      fibra: 0,
      sodioMg: 700,
      micros: { calcio_mg: 700, fosforo_mg: 500, b12_ug: 1.1, zinc_mg: 3.1 },
    },
  },
  {
    id: 'espinacas',
    nombre: 'Espinacas (crudas)',
    categoria: 'Verdura',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 23,
      proteina: 2.9,
      carbohidratos: 3.6,
      grasa: 0.4,
      fibra: 2.2,
      sodioMg: 79,
      micros: { vitaminaA_ug: 469, vitaminaC_mg: 28, hierro_mg: 2.7, b9Folato_ug: 194, potasio_mg: 558, magnesio_mg: 79, vitaminaK_ug: 483 },
    },
  },
  {
    id: 'brocoli',
    nombre: 'Brócoli (cocido)',
    categoria: 'Verdura',
    por100g: {
      kcal: 35,
      proteina: 2.4,
      carbohidratos: 7.2,
      grasa: 0.4,
      fibra: 3.3,
      sodioMg: 41,
      micros: { vitaminaC_mg: 65, vitaminaK_ug: 141, b9Folato_ug: 108, potasio_mg: 293 },
    },
  },
  {
    id: 'tomate',
    nombre: 'Tomate',
    categoria: 'Verdura',
    por100g: { kcal: 18, proteina: 0.9, carbohidratos: 3.9, grasa: 0.2, fibra: 1.2, sodioMg: 5, micros: { vitaminaC_mg: 14, potasio_mg: 237, vitaminaA_ug: 42 } },
  },
  {
    id: 'zanahoria',
    nombre: 'Zanahoria',
    categoria: 'Verdura',
    por100g: { kcal: 41, proteina: 0.9, carbohidratos: 10, grasa: 0.2, fibra: 2.8, sodioMg: 69, micros: { vitaminaA_ug: 835, vitaminaC_mg: 5.9, potasio_mg: 320 } },
  },
  {
    id: 'platano',
    nombre: 'Plátano',
    categoria: 'Fruta',
    por100g: { kcal: 89, proteina: 1.1, carbohidratos: 23, grasa: 0.3, fibra: 2.6, sodioMg: 1, micros: { potasio_mg: 358, vitaminaC_mg: 8.7, b6_mg: 0.4, magnesio_mg: 27 } },
  },
  {
    id: 'manzana',
    nombre: 'Manzana',
    categoria: 'Fruta',
    por100g: { kcal: 52, proteina: 0.3, carbohidratos: 14, grasa: 0.2, fibra: 2.4, sodioMg: 1, micros: { vitaminaC_mg: 4.6, potasio_mg: 107 } },
  },
  {
    id: 'aceite_oliva',
    nombre: 'Aceite de oliva',
    categoria: 'Grasa',
    por100g: { kcal: 884, proteina: 0, carbohidratos: 0, grasa: 100, fibra: 0, sodioMg: 0, micros: { vitaminaE_mg: 14 } },
  },
  {
    id: 'aguacate',
    nombre: 'Aguacate',
    categoria: 'Fruta/grasa',
    por100g: {
      kcal: 160,
      proteina: 2,
      carbohidratos: 8.5,
      grasa: 14.7,
      fibra: 6.7,
      sodioMg: 7,
      micros: { potasio_mg: 485, vitaminaE_mg: 2.1, b9Folato_ug: 81, magnesio_mg: 29, vitaminaC_mg: 10 },
    },
  },
  {
    id: 'almendras',
    nombre: 'Almendras',
    categoria: 'Fruto seco',
    tipoProteina: 'vegetal',
    por100g: {
      kcal: 579,
      proteina: 21.2,
      carbohidratos: 21.6,
      grasa: 49.9,
      fibra: 12.5,
      sodioMg: 1,
      micros: { magnesio_mg: 270, calcio_mg: 269, vitaminaE_mg: 25.6, hierro_mg: 3.7, zinc_mg: 3.1 },
    },
  },
];

// Composición aminoacídica aproximada por gramo de proteína (mg AA / g proteína), según el tipo
// de proteína: valores de referencia típicos de proteína animal completa vs. proteína vegetal
// genérica. Es una estimación (no el perfil exacto de cada ingrediente), útil quando no hay
// datos concretos de aminoácidos disponibles.
const RATIOS_AMINOACIDOS_MG_POR_G_PROTEINA: Record<'animal' | 'vegetal', Record<string, number>> = {
  animal: {
    histidina: 34,
    isoleucina: 50,
    leucina: 81,
    lisina: 86,
    metioninaCisteina: 40,
    fenilalaninaTirosina: 79,
    treonina: 46,
    triptofano: 13,
    valina: 57,
  },
  vegetal: {
    histidina: 27,
    isoleucina: 40,
    leucina: 70,
    lisina: 50,
    metioninaCisteina: 27,
    fenilalaninaTirosina: 75,
    treonina: 35,
    triptofano: 11,
    valina: 48,
  },
};

function estimarAminoacidosPor100g(proteinaG: number, tipo?: 'animal' | 'vegetal'): Record<string, number> {
  if (!tipo || proteinaG <= 0) return {};
  const ratios = RATIOS_AMINOACIDOS_MG_POR_G_PROTEINA[tipo];
  const resultado: Record<string, number> = {};
  for (const [aa, mgPorG] of Object.entries(ratios)) {
    resultado[`aa_${aa}`] = mgPorG * proteinaG;
  }
  return resultado;
}

function microsCompletosIngrediente(ingrediente: IngredienteReferencia): Record<string, number> {
  return {
    ...(ingrediente.por100g.micros ?? {}),
    ...estimarAminoacidosPor100g(ingrediente.por100g.proteina, ingrediente.tipoProteina),
  };
}

export interface ItemIngrediente {
  ingrediente: IngredienteReferencia;
  gramos: number;
}

/**
 * Combina varios ingredientes con sus cantidades en un único Alimento (per 100g), sumando
 * macros y micros proporcionalmente. Los aminoácidos son una estimación a partir de la proteína.
 */
export function componerAlimentoDesdeIngredientes(nombre: string, items: ItemIngrediente[]): Alimento {
  const totalG = items.reduce((acc, it) => acc + it.gramos, 0) || 100;
  const factor100 = 100 / totalG;

  let kcal = 0;
  let proteina = 0;
  let carbohidratos = 0;
  let grasa = 0;
  let fibra = 0;
  let sodioMg = 0;
  const micros: Record<string, number> = {};

  for (const { ingrediente, gramos } of items) {
    const f = gramos / 100;
    kcal += ingrediente.por100g.kcal * f;
    proteina += ingrediente.por100g.proteina * f;
    carbohidratos += ingrediente.por100g.carbohidratos * f;
    grasa += ingrediente.por100g.grasa * f;
    fibra += ingrediente.por100g.fibra * f;
    sodioMg += (ingrediente.por100g.sodioMg ?? 0) * f;

    for (const [clave, valorPor100g] of Object.entries(microsCompletosIngrediente(ingrediente))) {
      micros[clave] = (micros[clave] ?? 0) + valorPor100g * f;
    }
  }

  const microsPor100: Record<string, number> = {};
  for (const [clave, valorTotal] of Object.entries(micros)) {
    microsPor100[clave] = valorTotal * factor100;
  }

  return {
    id: `compuesto-${Date.now()}`,
    nombre,
    marca: null,
    codigoBarras: null,
    kcalPor100g: kcal * factor100,
    proteinaPor100g: proteina * factor100,
    carbohidratosPor100g: carbohidratos * factor100,
    grasaPor100g: grasa * factor100,
    fibraPor100g: fibra * factor100,
    sodioMgPor100g: sodioMg * factor100,
    micros: microsPor100,
    fuente: 'manual',
  };
}

export function pesoTotalIngredientes(items: ItemIngrediente[]): number {
  return items.reduce((acc, it) => acc + it.gramos, 0);
}
