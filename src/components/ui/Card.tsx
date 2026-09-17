import { View, type ViewProps, Platform } from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export function Card({ style, ...rest }: ViewProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface200,
          borderRadius: Radius.lg,
          padding: Spacing.space4,
          ...Platform.select({
            ios: { shadowColor: '#1b2420', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
            android: { elevation: 3 },
            default: {},
          }),
        },
        style,
      ]}
      {...rest}
    />
  );
}
