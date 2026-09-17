import { useState } from 'react';
import { View } from 'react-native';
import { Link, router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SignupScreen() {
  const { registrarse } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function onSubmit() {
    setError(null);
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setCargando(true);
    const err = await registrarse(email.trim(), password);
    setCargando(false);
    if (err) {
      setError(err);
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <Screen>
        <View style={{ marginTop: Spacing.space7, gap: Spacing.space3 }}>
          <AppText variant="h1">Revisa tu correo</AppText>
          <AppText variant="body" color="inkMuted">
            Te hemos enviado un enlace de confirmación a {email}. Confírmalo y vuelve a iniciar sesión.
          </AppText>
        </View>
        <Button label="Ir a iniciar sesión" onPress={() => router.replace('/(auth)/login')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ marginTop: Spacing.space7, gap: Spacing.space2 }}>
        <AppText variant="h1">Crea tu cuenta</AppText>
        <AppText variant="body" color="inkMuted">
          Tus datos y tu progreso se guardan de forma segura en la nube.
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
          placeholder="Mínimo 6 caracteres"
          error={error}
        />
      </View>

      <Button label="Crear cuenta" onPress={onSubmit} loading={cargando} />

      <Link href="/(auth)/login" style={{ alignSelf: 'center', marginTop: Spacing.space2 }}>
        <AppText variant="bodySm" color="brand">
          ¿Ya tienes cuenta? Inicia sesión
        </AppText>
      </Link>
    </Screen>
  );
}
