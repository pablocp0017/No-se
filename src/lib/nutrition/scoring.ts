import type { MacroTargets, MicronutrienteTarget, NutrientesConsumidos } from '@/types/nutrition';

function attainment(intake: number, objetivo: number, limiteSuperior?: number): number {
  if (objetivo <= 0) return 100;
  let score = Math.min((intake / objetivo) * 100, 100);
  if (limiteSuperior && intake > limiteSuperior) {
    const excesoRatio = Math.min((intake - limiteSuperior) / limiteSuperior, 1);
    const penalizacion = excesoRatio * 100;
    score = Math.max(score - penalizacion, 0);
  }
  return score;
}

/** Puntuación 0-100 de un macro respecto a su objetivo (100 dentro de ±10%, decreciente fuera). */
function macroRangeScore(intake: number, objetivo: number): number {
  if (objetivo <= 0) return 100;
  const desviacion = Math.abs(intake - objetivo) / objetivo;
  if (desviacion <= 0.1) return 100;
  const score = 100 - (desviacion - 0.1) * 200;
  return Math.max(score, 0);
}

export interface DesgloseScore {
  total: number;
  macros: number;
  vitaminas: number;
  minerales: number;
  electrolitos: number;
  aminoacidos: number;
  alertas: { clave: string; etiqueta: string }[];
}

const PESOS = {
  macros: 0.35,
  vitaminas: 0.2,
  minerales: 0.2,
  electrolitos: 0.1,
  aminoacidos: 0.15,
};

/**
 * Calcula la puntuación de cumplimiento nutricional (0-100), combinando macros + fibra,
 * vitaminas, minerales, electrolitos y aminoácidos. Metodología inspirada en el Nutrient
 * Adequacy Ratio (NAR/MAR) y el capado a 100% del Healthy Eating Index (USDA).
 */
export function calcularScoreNutricional(
  consumido: NutrientesConsumidos,
  macroTargets: MacroTargets,
  micronutrienteTargets: MicronutrienteTarget[]
): DesgloseScore {
  const macroScores = [
    macroRangeScore(consumido.proteinaG, macroTargets.proteinaG),
    macroRangeScore(consumido.carbohidratosG, macroTargets.carbohidratosG),
    macroRangeScore(consumido.grasaG, macroTargets.grasaG),
    attainment(consumido.fibraG, macroTargets.fibraG),
  ];
  const macros = promedio(macroScores);

  const alertas: { clave: string; etiqueta: string }[] = [];
  const porCategoria = (categoria: MicronutrienteTarget['categoria']) => {
    const items = micronutrienteTargets.filter((t) => t.categoria === categoria);
    if (items.length === 0) return 100;
    const scores = items.map((t) => {
      const intake = consumido.micros[t.clave] ?? 0;
      if (t.limiteSuperior && intake > t.limiteSuperior) {
        alertas.push({ clave: t.clave, etiqueta: t.etiqueta });
      }
      return attainment(intake, t.objetivo, t.limiteSuperior);
    });
    return promedio(scores);
  };

  const vitaminas = porCategoria('vitamina');
  const minerales = porCategoria('mineral');
  const electrolitos = porCategoria('electrolito');
  const aminoacidos = porCategoria('aminoacido');

  const total =
    macros * PESOS.macros +
    vitaminas * PESOS.vitaminas +
    minerales * PESOS.minerales +
    electrolitos * PESOS.electrolitos +
    aminoacidos * PESOS.aminoacidos;

  return {
    total: Math.round(total),
    macros: Math.round(macros),
    vitaminas: Math.round(vitaminas),
    minerales: Math.round(minerales),
    electrolitos: Math.round(electrolitos),
    aminoacidos: Math.round(aminoacidos),
    alertas,
  };
}

function promedio(nums: number[]): number {
  if (nums.length === 0) return 100;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
