import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProfile } from '@/lib/hooks/useProfile';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function Index() {
  const { session, cargando: cargandoAuth } = useAuth();
  const { perfil, cargando: cargandoPerfil } = useProfile();
  const colors = useThemeColors();

  if (cargandoAuth || (session && cargandoPerfil)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface100 }}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!perfil) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
