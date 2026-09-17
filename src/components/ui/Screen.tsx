import { ScrollView, View, type ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface ScreenProps extends ViewProps {
  scroll?: boolean;
}

export function Screen({ children, style, scroll = true, ...rest }: ScreenProps) {
  const colors = useThemeColors();
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll ? { contentContainerStyle: [styles.content, style] } : { style: [styles.content, style] };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface100 }]} edges={['top', 'bottom']}>
      <Container {...containerProps} {...rest}>
        {children}
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: Spacing.space4, paddingBottom: Spacing.space7, gap: Spacing.space5 },
});
