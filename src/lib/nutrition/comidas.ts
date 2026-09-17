import type { Comida } from '@/types/nutrition';

export const COMIDAS: Comida[] = ['desayuno', 'almuerzo', 'cena', 'snacks'];

export const TITULOS_COMIDA: Record<Comida, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  snacks: 'Snacks',
};
