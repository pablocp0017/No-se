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

  // --- Más proteína animal ---
  {
    id: 'pavo_pechuga',
    nombre: 'Pechuga de pavo (cruda)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: { kcal: 135, proteina: 30, carbohidratos: 0, grasa: 1, fibra: 0, sodioMg: 63, micros: { b3Niacina_mg: 8, potasio_mg: 250, zinc_mg: 1.5 } },
  },
  {
    id: 'cerdo_lomo',
    nombre: 'Lomo de cerdo (crudo)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: { kcal: 143, proteina: 21, carbohidratos: 0, grasa: 6, fibra: 0, sodioMg: 55, micros: { b1Tiamina_mg: 0.7, zinc_mg: 2, potasio_mg: 350 } },
  },
  {
    id: 'merluza',
    nombre: 'Merluza (cruda)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: { kcal: 86, proteina: 17.8, carbohidratos: 0, grasa: 1.3, fibra: 0, sodioMg: 70, micros: { b12_ug: 1.2, potasio_mg: 280, yodo_ug: 17 } },
  },
  {
    id: 'gambas',
    nombre: 'Gambas (crudas)',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: { kcal: 85, proteina: 20.3, carbohidratos: 0, grasa: 0.5, fibra: 0, sodioMg: 119, micros: { selenio_ug: 38, b12_ug: 1.1, yodo_ug: 35 } },
  },
  {
    id: 'jamon_cocido',
    nombre: 'Jamón cocido',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: { kcal: 105, proteina: 18, carbohidratos: 1.5, grasa: 3, fibra: 0, sodioMg: 950, micros: { zinc_mg: 1.5, b1Tiamina_mg: 0.5 } },
  },
  {
    id: 'jamon_serrano',
    nombre: 'Jamón serrano',
    categoria: 'Proteína animal',
    tipoProteina: 'animal',
    por100g: { kcal: 241, proteina: 31, carbohidratos: 0, grasa: 13, fibra: 0, sodioMg: 2200, micros: { zinc_mg: 2.5, hierro_mg: 1.4 } },
  },

  // --- Más cereales y legumbres ---
  {
    id: 'arroz_integral',
    nombre: 'Arroz integral (cocido)',
    categoria: 'Cereal',
    por100g: { kcal: 123, proteina: 2.7, carbohidratos: 25.6, grasa: 1, fibra: 1.8, sodioMg: 4, micros: { magnesio_mg: 43, b3Niacina_mg: 2 } },
  },
  {
    id: 'cous_cous',
    nombre: 'Cuscús (cocido)',
    categoria: 'Cereal',
    por100g: { kcal: 112, proteina: 3.8, carbohidratos: 23, grasa: 0.2, fibra: 1.4, sodioMg: 5, micros: { selenio_ug: 18 } },
  },
  {
    id: 'maiz',
    nombre: 'Maíz dulce (cocido)',
    categoria: 'Verdura',
    por100g: { kcal: 96, proteina: 3.4, carbohidratos: 21, grasa: 1.5, fibra: 2.4, sodioMg: 15, micros: { vitaminaC_mg: 6.8, magnesio_mg: 26 } },
  },
  {
    id: 'guisantes',
    nombre: 'Guisantes (cocidos)',
    categoria: 'Legumbre',
    tipoProteina: 'vegetal',
    por100g: { kcal: 84, proteina: 5.4, carbohidratos: 14, grasa: 0.4, fibra: 5.5, sodioMg: 3, micros: { vitaminaC_mg: 14.2, hierro_mg: 1.5, b9Folato_ug: 65 } },
  },
  {
    id: 'judias_blancas',
    nombre: 'Judías blancas (cocidas)',
    categoria: 'Legumbre',
    tipoProteina: 'vegetal',
    por100g: { kcal: 127, proteina: 8.7, carbohidratos: 22.8, grasa: 0.5, fibra: 6.3, sodioMg: 2, micros: { hierro_mg: 2.5, magnesio_mg: 43, potasio_mg: 400 } },
  },
  {
    id: 'pan_blanco',
    nombre: 'Pan blanco',
    categoria: 'Cereal',
    tipoProteina: 'vegetal',
    por100g: { kcal: 265, proteina: 9, carbohidratos: 49, grasa: 3.2, fibra: 2.7, sodioMg: 490, micros: { hierro_mg: 1.2 } },
  },

  // --- Más verduras ---
  {
    id: 'calabacin',
    nombre: 'Calabacín',
    categoria: 'Verdura',
    por100g: { kcal: 17, proteina: 1.2, carbohidratos: 3.1, grasa: 0.3, fibra: 1, sodioMg: 8, micros: { vitaminaC_mg: 17.9, potasio_mg: 261 } },
  },
  {
    id: 'pimiento_rojo',
    nombre: 'Pimiento rojo',
    categoria: 'Verdura',
    por100g: { kcal: 31, proteina: 1, carbohidratos: 6, grasa: 0.3, fibra: 2.1, sodioMg: 4, micros: { vitaminaC_mg: 128, vitaminaA_ug: 157 } },
  },
  {
    id: 'cebolla',
    nombre: 'Cebolla',
    categoria: 'Verdura',
    por100g: { kcal: 40, proteina: 1.1, carbohidratos: 9.3, grasa: 0.1, fibra: 1.7, sodioMg: 4, micros: { vitaminaC_mg: 7.4, potasio_mg: 146 } },
  },
  {
    id: 'ajo',
    nombre: 'Ajo',
    categoria: 'Verdura',
    por100g: { kcal: 149, proteina: 6.4, carbohidratos: 33, grasa: 0.5, fibra: 2.1, sodioMg: 17, micros: { vitaminaC_mg: 31, b6_mg: 1.2 } },
  },
  {
    id: 'lechuga',
    nombre: 'Lechuga',
    categoria: 'Verdura',
    por100g: { kcal: 15, proteina: 1.4, carbohidratos: 2.9, grasa: 0.2, fibra: 1.3, sodioMg: 28, micros: { vitaminaA_ug: 370, vitaminaK_ug: 126 } },
  },
  {
    id: 'champinones',
    nombre: 'Champiñones',
    categoria: 'Verdura',
    por100g: { kcal: 22, proteina: 3.1, carbohidratos: 3.3, grasa: 0.3, fibra: 1, sodioMg: 5, micros: { potasio_mg: 318, b3Niacina_mg: 3.6, selenio_ug: 9 } },
  },
  {
    id: 'calabaza',
    nombre: 'Calabaza',
    categoria: 'Verdura',
    por100g: { kcal: 26, proteina: 1, carbohidratos: 6.5, grasa: 0.1, fibra: 0.5, sodioMg: 1, micros: { vitaminaA_ug: 426, vitaminaC_mg: 9 } },
  },
  {
    id: 'berenjena',
    nombre: 'Berenjena',
    categoria: 'Verdura',
    por100g: { kcal: 25, proteina: 1, carbohidratos: 6, grasa: 0.2, fibra: 3, sodioMg: 2, micros: { potasio_mg: 229 } },
  },
  {
    id: 'pepino',
    nombre: 'Pepino',
    categoria: 'Verdura',
    por100g: { kcal: 15, proteina: 0.7, carbohidratos: 3.6, grasa: 0.1, fibra: 0.5, sodioMg: 2, micros: { vitaminaC_mg: 2.8, potasio_mg: 147 } },
  },
  {
    id: 'coliflor',
    nombre: 'Coliflor (cocida)',
    categoria: 'Verdura',
    por100g: { kcal: 23, proteina: 1.8, carbohidratos: 4.1, grasa: 0.5, fibra: 2.3, sodioMg: 15, micros: { vitaminaC_mg: 44, b9Folato_ug: 44 } },
  },
  {
    id: 'remolacha',
    nombre: 'Remolacha (cocida)',
    categoria: 'Verdura',
    por100g: { kcal: 44, proteina: 1.7, carbohidratos: 10, grasa: 0.2, fibra: 2, sodioMg: 78, micros: { b9Folato_ug: 80, potasio_mg: 305 } },
  },
  {
    id: 'esparragos',
    nombre: 'Espárragos (cocidos)',
    categoria: 'Verdura',
    por100g: { kcal: 20, proteina: 2.2, carbohidratos: 3.9, grasa: 0.2, fibra: 2, sodioMg: 14, micros: { b9Folato_ug: 52, vitaminaK_ug: 41 } },
  },
  {
    id: 'judias_verdes',
    nombre: 'Judías verdes (cocidas)',
    categoria: 'Verdura',
    por100g: { kcal: 35, proteina: 1.9, carbohidratos: 7.9, grasa: 0.1, fibra: 3.4, sodioMg: 6, micros: { vitaminaC_mg: 12, vitaminaA_ug: 35 } },
  },

  // --- Más frutas ---
  {
    id: 'naranja',
    nombre: 'Naranja',
    categoria: 'Fruta',
    por100g: { kcal: 47, proteina: 0.9, carbohidratos: 11.8, grasa: 0.1, fibra: 2.4, sodioMg: 0, micros: { vitaminaC_mg: 53, potasio_mg: 181 } },
  },
  {
    id: 'fresas',
    nombre: 'Fresas',
    categoria: 'Fruta',
    por100g: { kcal: 32, proteina: 0.7, carbohidratos: 7.7, grasa: 0.3, fibra: 2, sodioMg: 1, micros: { vitaminaC_mg: 59, b9Folato_ug: 24 } },
  },
  {
    id: 'uvas',
    nombre: 'Uvas',
    categoria: 'Fruta',
    por100g: { kcal: 69, proteina: 0.7, carbohidratos: 18, grasa: 0.2, fibra: 0.9, sodioMg: 2, micros: { vitaminaC_mg: 3.2, potasio_mg: 191 } },
  },
  {
    id: 'sandia',
    nombre: 'Sandía',
    categoria: 'Fruta',
    por100g: { kcal: 30, proteina: 0.6, carbohidratos: 7.6, grasa: 0.2, fibra: 0.4, sodioMg: 1, micros: { vitaminaC_mg: 8.1, vitaminaA_ug: 28 } },
  },
  {
    id: 'melon',
    nombre: 'Melón',
    categoria: 'Fruta',
    por100g: { kcal: 34, proteina: 0.8, carbohidratos: 8.2, grasa: 0.2, fibra: 0.9, sodioMg: 16, micros: { vitaminaC_mg: 36.7, vitaminaA_ug: 169 } },
  },
  {
    id: 'pera',
    nombre: 'Pera',
    categoria: 'Fruta',
    por100g: { kcal: 57, proteina: 0.4, carbohidratos: 15.2, grasa: 0.1, fibra: 3.1, sodioMg: 1, micros: { vitaminaC_mg: 4.3, potasio_mg: 116 } },
  },
  {
    id: 'pina',
    nombre: 'Piña',
    categoria: 'Fruta',
    por100g: { kcal: 50, proteina: 0.5, carbohidratos: 13.1, grasa: 0.1, fibra: 1.4, sodioMg: 1, micros: { vitaminaC_mg: 47.8 } },
  },
  {
    id: 'kiwi',
    nombre: 'Kiwi',
    categoria: 'Fruta',
    por100g: { kcal: 61, proteina: 1.1, carbohidratos: 14.7, grasa: 0.5, fibra: 3, sodioMg: 3, micros: { vitaminaC_mg: 92.7, vitaminaK_ug: 40 } },
  },
  {
    id: 'arandanos',
    nombre: 'Arándanos',
    categoria: 'Fruta',
    por100g: { kcal: 57, proteina: 0.7, carbohidratos: 14.5, grasa: 0.3, fibra: 2.4, sodioMg: 1, micros: { vitaminaC_mg: 9.7, vitaminaK_ug: 19 } },
  },
  {
    id: 'limon',
    nombre: 'Limón',
    categoria: 'Fruta',
    por100g: { kcal: 29, proteina: 1.1, carbohidratos: 9.3, grasa: 0.3, fibra: 2.8, sodioMg: 2, micros: { vitaminaC_mg: 53 } },
  },

  // --- Más lácteos ---
  {
    id: 'queso_fresco',
    nombre: 'Queso fresco batido',
    categoria: 'Lácteo',
    tipoProteina: 'animal',
    por100g: { kcal: 74, proteina: 8, carbohidratos: 4, grasa: 3, fibra: 0, sodioMg: 350, micros: { calcio_mg: 90, fosforo_mg: 130 } },
  },
  {
    id: 'nata_cocinar',
    nombre: 'Nata para cocinar',
    categoria: 'Lácteo',
    por100g: { kcal: 195, proteina: 2.5, carbohidratos: 3.5, grasa: 18, fibra: 0, sodioMg: 40, micros: { calcio_mg: 90 } },
  },
  {
    id: 'mantequilla',
    nombre: 'Mantequilla',
    categoria: 'Grasa',
    por100g: { kcal: 717, proteina: 0.9, carbohidratos: 0.1, grasa: 81, fibra: 0, sodioMg: 11, micros: { vitaminaA_ug: 684 } },
  },
  {
    id: 'leche_desnatada',
    nombre: 'Leche desnatada',
    categoria: 'Lácteo',
    tipoProteina: 'animal',
    por100g: { kcal: 35, proteina: 3.4, carbohidratos: 5, grasa: 0.1, fibra: 0, sodioMg: 44, micros: { calcio_mg: 122, b12_ug: 0.5 } },
  },
  {
    id: 'kefir',
    nombre: 'Kéfir',
    categoria: 'Lácteo',
    tipoProteina: 'animal',
    por100g: { kcal: 55, proteina: 3.3, carbohidratos: 4.5, grasa: 2.5, fibra: 0, sodioMg: 40, micros: { calcio_mg: 110, b12_ug: 0.4 } },
  },

  // --- Más grasas, frutos secos y semillas ---
  {
    id: 'nueces',
    nombre: 'Nueces',
    categoria: 'Fruto seco',
    tipoProteina: 'vegetal',
    por100g: { kcal: 654, proteina: 15.2, carbohidratos: 13.7, grasa: 65.2, fibra: 6.7, sodioMg: 2, micros: { magnesio_mg: 158, vitaminaE_mg: 0.7 } },
  },
  {
    id: 'anacardos',
    nombre: 'Anacardos',
    categoria: 'Fruto seco',
    tipoProteina: 'vegetal',
    por100g: { kcal: 553, proteina: 18.2, carbohidratos: 30.2, grasa: 43.9, fibra: 3.3, sodioMg: 12, micros: { magnesio_mg: 292, zinc_mg: 5.8, hierro_mg: 6.7 } },
  },
  {
    id: 'cacahuetes',
    nombre: 'Cacahuetes',
    categoria: 'Fruto seco',
    tipoProteina: 'vegetal',
    por100g: { kcal: 567, proteina: 25.8, carbohidratos: 16.1, grasa: 49.2, fibra: 8.5, sodioMg: 18, micros: { magnesio_mg: 168, b3Niacina_mg: 12.1 } },
  },
  {
    id: 'pipas_girasol',
    nombre: 'Pipas de girasol',
    categoria: 'Semilla',
    tipoProteina: 'vegetal',
    por100g: { kcal: 584, proteina: 20.8, carbohidratos: 20, grasa: 51.5, fibra: 8.6, sodioMg: 9, micros: { vitaminaE_mg: 35, magnesio_mg: 325, selenio_ug: 53 } },
  },
  {
    id: 'semillas_chia',
    nombre: 'Semillas de chía',
    categoria: 'Semilla',
    tipoProteina: 'vegetal',
    por100g: { kcal: 486, proteina: 16.5, carbohidratos: 42.1, grasa: 30.7, fibra: 34.4, sodioMg: 16, micros: { calcio_mg: 631, magnesio_mg: 335, hierro_mg: 7.7 } },
  },
  {
    id: 'semillas_lino',
    nombre: 'Semillas de lino',
    categoria: 'Semilla',
    tipoProteina: 'vegetal',
    por100g: { kcal: 534, proteina: 18.3, carbohidratos: 28.9, grasa: 42.2, fibra: 27.3, sodioMg: 30, micros: { magnesio_mg: 392, potasio_mg: 813 } },
  },
  {
    id: 'mantequilla_cacahuete',
    nombre: 'Mantequilla de cacahuete',
    categoria: 'Grasa',
    tipoProteina: 'vegetal',
    por100g: { kcal: 588, proteina: 25, carbohidratos: 20, grasa: 50, fibra: 6, sodioMg: 400, micros: { magnesio_mg: 154, b3Niacina_mg: 13.2 } },
  },
  {
    id: 'aceite_girasol',
    nombre: 'Aceite de girasol',
    categoria: 'Grasa',
    por100g: { kcal: 884, proteina: 0, carbohidratos: 0, grasa: 100, fibra: 0, sodioMg: 0, micros: { vitaminaE_mg: 41 } },
  },
  {
    id: 'aceite_coco',
    nombre: 'Aceite de coco',
    categoria: 'Grasa',
    por100g: { kcal: 862, proteina: 0, carbohidratos: 0, grasa: 100, fibra: 0, sodioMg: 0 },
  },

  // --- Dulces y condimentos ---
  {
    id: 'miel',
    nombre: 'Miel',
    categoria: 'Dulce',
    por100g: { kcal: 304, proteina: 0.3, carbohidratos: 82.4, grasa: 0, fibra: 0.2, sodioMg: 4 },
  },
  {
    id: 'azucar',
    nombre: 'Azúcar blanco',
    categoria: 'Dulce',
    por100g: { kcal: 400, proteina: 0, carbohidratos: 100, grasa: 0, fibra: 0, sodioMg: 0 },
  },
  {
    id: 'chocolate_negro',
    nombre: 'Chocolate negro (70%)',
    categoria: 'Dulce',
    por100g: { kcal: 598, proteina: 7.8, carbohidratos: 45.9, grasa: 42.6, fibra: 10.9, sodioMg: 20, micros: { magnesio_mg: 228, hierro_mg: 11.9 } },
  },
  {
    id: 'mayonesa',
    nombre: 'Mayonesa',
    categoria: 'Condimento',
    por100g: { kcal: 680, proteina: 1.1, carbohidratos: 1.3, grasa: 75, fibra: 0, sodioMg: 590 },
  },
  {
    id: 'ketchup',
    nombre: 'Kétchup',
    categoria: 'Condimento',
    por100g: { kcal: 101, proteina: 1.2, carbohidratos: 25.8, grasa: 0.2, fibra: 0.4, sodioMg: 950, micros: { vitaminaC_mg: 8 } },
  },
  {
    id: 'mostaza',
    nombre: 'Mostaza',
    categoria: 'Condimento',
    por100g: { kcal: 66, proteina: 4.4, carbohidratos: 5.8, grasa: 3.3, fibra: 3.3, sodioMg: 1100 },
  },
  {
    id: 'vinagre',
    nombre: 'Vinagre de vino',
    categoria: 'Condimento',
    por100g: { kcal: 19, proteina: 0, carbohidratos: 0.6, grasa: 0, fibra: 0, sodioMg: 4 },
  },
  {
    id: 'hummus',
    nombre: 'Hummus',
    categoria: 'Legumbre',
    tipoProteina: 'vegetal',
    por100g: { kcal: 166, proteina: 7.9, carbohidratos: 14.3, grasa: 9.6, fibra: 6, sodioMg: 380, micros: { hierro_mg: 1.6, magnesio_mg: 39 } },
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
