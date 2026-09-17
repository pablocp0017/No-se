import { TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
}

export function TextField({ label, error, style, ...rest }: TextFieldProps) {
  const colors = useThemeColors();
  return (
    <View style={{ gap: Spacing.space2 }}>
      <AppText variant="label" color="inkMuted">
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colors.inkMuted}
        style={[
          {
            height: 48,
            borderRadius: Radius.md,
            paddingHorizontal: Spacing.space4,
            backgroundColor: colors.surface300,
            color: colors.ink,
            fontSize: 15,
            borderWidth: error ? 1.5 : 0,
            borderColor: colors.danger,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
