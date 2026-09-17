/**
 * Valores de referencia nutricional para adultos sanos (18-64 años).
 * Fuentes: EFSA (Dietary Reference Values, 2017 + opiniones específicas 2013-2023),
 * WHO/FAO/UNU (Protein and Amino Acid Requirements, WHO TRS 935, 2007),
 * NIH/IOM donde EFSA no fija valor (indicado con _nih).
 * Son valores poblacionales de referencia, no sustituyen consejo médico individualizado.
 */

export type Sexo = 'hombre' | 'mujer';

export interface RangoSexo {
  hombre: number;
  mujer: number;
}

// ---- Vitaminas (PRI/AI diario, adulto) ----
export const VITAMINAS = {
  vitaminaA_ug: { hombre: 750, mujer: 650 } as RangoSexo,
  vitaminaC_mg: { hombre: 110, mujer: 95 } as RangoSexo,
  vitaminaD_ug: 15,
  vitaminaE_mg: { hombre: 13, mujer: 11 } as RangoSexo,
  vitaminaK_ug: 70,
  b1Tiamina_mg: { hombre: 1.2, mujer: 1.1 } as RangoSexo,
  b2Riboflavina_mg: 1.6,
  b3Niacina_mg: { hombre: 16, mujer: 13 } as RangoSexo,
  b5AcidoPantotenico_mg: 5,
  b6_mg: { hombre: 1.7, mujer: 1.6 } as RangoSexo,
  b7Biotina_ug: 40,
  b9Folato_ug: 330,
  b12_ug: 4,
};

// ---- Minerales (PRI/AI diario, adulto) ----
export const MINERALES = {
  calcio_mg: 950,
  hierro_mg: { hombre: 11, mujer: 16 } as RangoSexo, // mujer: premenopáusica; ver ajuste por edad en energy.ts
  magnesio_mg: { hombre: 350, mujer: 300 } as RangoSexo,
  fosforo_mg: 550,
  potasio_mg: 3500,
  sodio_mg: 2000,
  zinc_mg: { hombre: 9.4, mujer: 7.5 } as RangoSexo,
  cobre_mg: 1.6,
  manganeso_mg: 3,
  selenio_ug: 70,
  yodo_ug: 150,
  cromo_ug: { hombre: 35, mujer: 25 } as RangoSexo, // NIH/IOM (EFSA sin valor fijado)
};

// ---- Fibra alimentaria (EFSA AI: 25 g/día; escalado por kcal, ~14 g/1000 kcal, regla IOM) ----
export const FIBRA_G_POR_1000KCAL = 14;
export const FIBRA_MINIMA_G = 25;

// ---- Electrolitos (sodio/potasio ya en minerales; se listan aparte por su rol en hidratación/ejercicio) ----
export const ELECTROLITOS = {
  sodio_mg: 2000,
  potasio_mg: 3500,
  cloruro_mg: 3100,
  // calcio y magnesio: ver MINERALES
  ajusteSodioPorEjercicioIntenso_mg: 500, // añadir en días de entrenamiento intenso (pérdidas por sudor)
};

// ---- Aminoácidos esenciales (mg/kg de peso corporal/día, WHO/FAO/UNU 2007) ----
export const AMINOACIDOS_MG_POR_KG = {
  histidina: 10,
  isoleucina: 20,
  leucina: 39,
  lisina: 30,
  metioninaCisteina: 15,
  fenilalaninaTirosina: 25,
  treonina: 15,
  triptofano: 4,
  valina: 26,
};

// ---- Límites superiores tolerables (UL) — umbrales de alerta por exceso ----
export const LIMITES_SUPERIORES = {
  vitaminaA_ug: 3000,
  vitaminaD_ug: 100,
  vitaminaE_mg: 300,
  b3Niacina_mg: 35, // referencia práctica NIH (formas alimentarias, no ácido nicotínico aislado)
  b6_mg: 12,
  b9Folato_ug: 1000,
  hierro_mg: 45, // NIH/IOM (EFSA sin UL fijado)
  zinc_mg: 40, // NIH/IOM
  calcio_mg: 2500,
  magnesio_mg: 350, // solo magnesio de suplementos/alimentos fortificados (EFSA); umbral de precaución general en la app
  yodo_ug: 600,
  selenio_ug: 400, // NIH/IOM
  cobre_mg: 10, // NIH/IOM
  sodio_mg: 2300, // objetivo de salud pública OMS/EFSA (<5 g sal/día)
};

export const NUTRIENTES_ALERTA_PRIORITARIA = [
  'vitaminaA_ug',
  'vitaminaD_ug',
  'hierro_mg',
  'zinc_mg',
  'sodio_mg',
  'b6_mg',
  'b9Folato_ug',
] as const;
