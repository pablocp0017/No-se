import { Pressable, StyleSheet, type PressableProps, ActivityIndicator } from 'react-native';
import { AppText } from './AppText';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({ label, variant = 'primary', loading, disabled, ...rest }: ButtonProps) {
  const colors = useThemeColors();

  const backgroundByVariant: Record<ButtonVariant, string> = {
    primary: colors.brand,
    accent: colors.accent,
    secondary: colors.surface200,
    ghost: 'transparent',
  };
  const textColorByVariant: Record<ButtonVariant, string> = {
    primary: colors.onBrand,
    accent: colors.onAccent,
    secondary: colors.ink,
    ghost: colors.brand,
  };

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: backgroundByVariant[variant],
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          borderColor: colors.border,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColorByVariant[variant]} />
      ) : (
        <AppText variant="label" style={{ color: textColorByVariant[variant] }}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: Spacing.space5,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
