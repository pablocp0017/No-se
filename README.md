# NutriGoal

App móvil (React Native + Expo) para controlar la nutrición: registra comidas por Desayuno/Almuerzo/Cena/Snacks, escanea códigos de barras (Open Food Facts), calcula tus objetivos de calorías/macros/micronutrientes/aminoácidos/electrolitos según tu perfil y objetivo, y traduce tu cumplimiento diario en una puntuación sobre 100.

## Antes de arrancar

1. **Crea un proyecto en [Supabase](https://supabase.com/dashboard)** (gratuito).
2. En el **SQL Editor** de tu proyecto, ejecuta en orden el contenido de [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql), [`supabase/migrations/0002_peso_objetivo.sql`](./supabase/migrations/0002_peso_objetivo.sql) y [`supabase/migrations/0003_favoritos.sql`](./supabase/migrations/0003_favoritos.sql) — crea las tablas `profiles`, `weight_logs`, `foods`, `food_logs` y `food_favorites` con sus políticas de seguridad (RLS).
3. Copia `.env.local.example` a `.env.local` y rellena `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` con los valores de **Project Settings → API Keys** de tu proyecto Supabase (usa la *Publishable key*).
4. En **Authentication → Providers → Email**, activa **"Allow new users to sign up"** y, si no quieres verificación por correo durante las pruebas, desactiva **"Confirm email"**.

## Arrancar la app

```sh
npm install
npx expo start
```

Escanea el QR con la app **Expo Go** (Android/iOS) o pulsa `a`/`i` para abrir un emulador. El escáner de código de barras (`expo-camera`) necesita un dispositivo real o un development build — no funciona en el simulador de iOS.

## Estructura

- `src/app/` — pantallas (Expo Router, enrutado por archivos): `(auth)` login/registro, `onboarding` cuestionario inicial, `(tabs)` Menú Principal y Datos personales, `food/` añadir alimento y escáner.
- `src/lib/nutrition/` — motor de reglas nutricional: BMR/TDEE (Mifflin-St Jeor), reparto de macros por objetivo, tablas de referencia de vitaminas/minerales/aminoácidos/electrolitos (EFSA / WHO-FAO-UNU / ISSN) y el cálculo de la puntuación sobre 100.
- `src/lib/hooks/` — acceso a datos (Supabase): sesión, perfil, registro diario de comidas, historial de peso.
- `src/lib/openfoodfacts.ts` — búsqueda de productos por nombre y por código de barras.
- `supabase/migrations/` — esquema SQL de la base de datos.

## Sistema de diseño

La identidad visual (colores, tipografía, componentes) vive en el Design System **NutriGoal** publicado como Artifact — tokens en `tokens.json`, componentes base (Button, Card, NutrientRing, MacroBar, ScoreGauge) con su preview y guía de uso.

## Próximos pasos sugeridos

Este es un MVP funcional: cuestionario inicial (con peso objetivo), Menú Principal con navegación entre días, registro de comidas con escáner/búsqueda/entrada manual/composición por ingredientes (~80 ingredientes con macros y micros conocidos) mostrando macros y micronutrientes por producto, alimentos guardados como favoritos (⭐) para reutilizar rápido, mover o eliminar un registro entre comidas, y Datos Personales con evolución de peso, tiempo estimado al objetivo y una pantalla de desglose completo de vitaminas/minerales/aminoácidos/electrolitos.

La búsqueda por nombre depende de la API pública de Open Food Facts (`search.openfoodfacts.org`), que en el momento de escribir esto está migrando de sistema de búsqueda y puede fallar o dar 0 resultados de forma intermitente; si falla, el error mostrado incluye el detalle técnico (status HTTP o mensaje de red) para poder diagnosticarlo. El escáner de código de barras usa un endpoint distinto (`world.openfoodfacts.org/api/v2/product`) y no depende de esto.
