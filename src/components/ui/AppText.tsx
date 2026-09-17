import { Text, type TextProps } from 'react-native';
import { Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export type TextVariant =
  | 'displayXl'
  | 'displayLg'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLg'
  | 'body'
  | 'bodySm'
  | 'numeric'
  | 'label'
  | 'caption';

const VARIANT_STYLE: Record<TextVariant, { fontSize: number; lineHeight: number; fontFamily: string; letterSpacing?: number }> = {
  displayXl: { fontSize: 56, lineHeight: 58, fontFamily: Fonts.displayExtraBold, letterSpacing: -0.5 },
  displayLg: { fontSize: 40, lineHeight: 44, fontFamily: Fonts.displayBold, letterSpacing: -0.3 },
  h1: { fontSize: 26, lineHeight: 32, fontFamily: Fonts.displayBold },
  h2: { fontSize: 20, lineHeight: 26, fontFamily: Fonts.displayBold },
  h3: { fontSize: 16, lineHeight: 22, fontFamily: Fonts.displaySemiBold },
  bodyLg: { fontSize: 17, lineHeight: 24, fontFamily: Fonts.sansMedium },
  body: { fontSize: 15, lineHeight: 21, fontFamily: Fonts.sansRegular },
  bodySm: { fontSize: 13, lineHeight: 18, fontFamily: Fonts.sansRegular },
  numeric: { fontSize: 15, lineHeight: 20, fontFamily: Fonts.sansBold },
  label: { fontSize: 13, lineHeight: 16, fontFamily: Fonts.sansBold, letterSpacing: 0.3 },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: Fonts.sansMedium },
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: 'ink' | 'inkMuted' | 'brand' | 'danger' | 'success' | 'warning' | 'onBrand';
}

export function AppText({ variant = 'body', color = 'ink', style, ...rest }: AppTextProps) {
  const colors = useThemeColors();
  return <Text style={[VARIANT_STYLE[variant], { color: colors[color] }, style]} {...rest} />;
}
