/**
 * Tokens del sistema de diseño NutriGoal (colores, tipografía, espaciado, radios, sombra).
 * Ver el Design System publicado para el detalle de uso de cada token.
 */

export const Colors = {
  light: {
    surface100: '#faf9f6',
    surface200: '#ffffff',
    surface300: '#f1efe9',
    border: '#e4e1d8',
    ink: '#1b2420',
    inkMuted: '#5b6b62',
    brand: '#1fa463',
    brandStrong: '#158049',
    onBrand: '#ffffff',
    accent: '#ff6b4a',
    onAccent: '#ffffff',
    protein: '#e0583a',
    carbs: '#d98a00',
    fat: '#6c5ce7',
    fiber: '#1f8f76',
    success: '#1fa463',
    warning: '#c97a00',
    danger: '#c23c46',
    onDanger: '#ffffff',
  },
  dark: {
    surface100: '#121815',
    surface200: '#1a2320',
    surface300: '#212c27',
    border: '#2c3730',
    ink: '#edefe9',
    inkMuted: '#9fb0a6',
    brand: '#34c77e',
    brandStrong: '#26a868',
    onBrand: '#08130d',
    accent: '#ff8566',
    onAccent: '#2b0d06',
    protein: '#ff8566',
    carbs: '#ffc24d',
    fat: '#9c8cff',
    fiber: '#4fd69c',
    success: '#34c77e',
    warning: '#ffc24d',
    danger: '#ff6b75',
    onDanger: '#2b0508',
  },
} as const;

export type ThemeColorKey = keyof typeof Colors.light;

/** Familias exactas registradas por @expo-google-fonts/{sora,manrope} vía useAppFonts(). */
export const Fonts = {
  displayExtraBold: 'Sora_800ExtraBold',
  displayBold: 'Sora_700Bold',
  displaySemiBold: 'Sora_600SemiBold',
  sansRegular: 'Manrope_400Regular',
  sansMedium: 'Manrope_500Medium',
  sansSemiBold: 'Manrope_600SemiBold',
  sansBold: 'Manrope_700Bold',
} as const;

export const Spacing = {
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 24,
  space6: 32,
  space7: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const MacroColorKey = {
  proteina: 'protein',
  carbohidratos: 'carbs',
  grasa: 'fat',
  fibra: 'fiber',
} as const;
