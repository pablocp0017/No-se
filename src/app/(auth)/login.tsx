import { useState } from 'react';
import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit() {
    setError(null);
    setCargando(true);
    const err = await iniciarSesion(email.trim(), password);
    setCargando(false);
    if (err) {
      setError(err);
      return;
    }
    router.replace('/');
  }

  return (
    <Screen>
      <View style={{ marginTop: Spacing.space7, gap: Spacing.space2 }}>
        <AppText variant="h1">Bienvenido a NutriGoal</AppText>
        <AppText variant="body" color="inkMuted">
          Inicia sesión para seguir tu progreso en cualquier dispositivo.
        </AppText>
      </View>

      <View style={{ gap: Spacing.space4 }}>
        <TextField
          label="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="tucorreo@ejemplo.com"
        />
        <TextField
          label="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          error={error}
        />
      </View>

      <Button label="Iniciar sesión" onPress={onSubmit} loading={cargando} />

      <Link href="/(auth)/signup" style={{ alignSelf: 'center', marginTop: Spacing.space2 }}>
        <AppText variant="bodySm" color="brand">
          ¿No tienes cuenta? Crear una
        </AppText>
      </Link>
    </Screen>
  );
}
