-- Esquema inicial para la app de nutrición.
-- Ejecutar en el SQL Editor del proyecto Supabase (Project Settings > SQL Editor).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  sexo text not null check (sexo in ('hombre', 'mujer')),
  edad int not null check (edad between 10 and 100),
  altura_cm numeric not null check (altura_cm between 100 and 250),
  peso_kg numeric not null check (peso_kg between 30 and 300),
  objetivo text not null check (objetivo in ('perder_peso', 'mantener', 'ganar_musculo')),
  dias_ejercicio_semana int not null check (dias_ejercicio_semana between 0 and 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "El usuario ve su propio perfil" on public.profiles
  for select using (auth.uid() = id);
create policy "El usuario crea su propio perfil" on public.profiles
  for insert with check (auth.uid() = id);
create policy "El usuario actualiza su propio perfil" on public.profiles
  for update using (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;

-- Historial de peso para la gráfica de evolución.
create table public.weight_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  peso_kg numeric not null check (peso_kg between 30 and 300),
  fecha date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.weight_logs enable row level security;

create policy "El usuario ve sus propios registros de peso" on public.weight_logs
  for select using (auth.uid() = user_id);
create policy "El usuario inserta sus propios registros de peso" on public.weight_logs
  for insert with check (auth.uid() = user_id);
create policy "El usuario borra sus propios registros de peso" on public.weight_logs
  for delete using (auth.uid() = user_id);

grant select, insert, delete on public.weight_logs to authenticated;

create index weight_logs_user_fecha_idx on public.weight_logs (user_id, fecha desc);

-- Caché compartida de alimentos (Open Food Facts + entradas manuales de usuarios).
create table public.foods (
  id uuid primary key default gen_random_uuid(),
  codigo_barras text unique,
  nombre text not null,
  marca text,
  kcal_100g numeric not null,
  proteina_100g numeric not null default 0,
  carbohidratos_100g numeric not null default 0,
  grasa_100g numeric not null default 0,
  fibra_100g numeric,
  azucar_100g numeric,
  sodio_mg_100g numeric,
  micros jsonb,
  fuente text not null check (fuente in ('openfoodfacts', 'manual', 'usda')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.foods enable row level security;

create policy "Cualquier usuario autenticado puede leer alimentos" on public.foods
  for select using (auth.role() = 'authenticated');
create policy "Cualquier usuario autenticado puede añadir alimentos" on public.foods
  for insert with check (auth.role() = 'authenticated');

grant select, insert on public.foods to authenticated;

create index foods_codigo_barras_idx on public.foods (codigo_barras);

-- Registro de comidas: qué alimento, en qué sección (desayuno/almuerzo/cena/snacks) y cuánta cantidad.
create table public.food_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  food_id uuid not null references public.foods (id),
  comida text not null check (comida in ('desayuno', 'almuerzo', 'cena', 'snacks')),
  cantidad_g numeric not null check (cantidad_g > 0),
  fecha date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.food_logs enable row level security;

create policy "El usuario ve sus propios registros de comida" on public.food_logs
  for select using (auth.uid() = user_id);
create policy "El usuario inserta sus propios registros de comida" on public.food_logs
  for insert with check (auth.uid() = user_id);
create policy "El usuario borra sus propios registros de comida" on public.food_logs
  for delete using (auth.uid() = user_id);

grant select, insert, delete on public.food_logs to authenticated;

create index food_logs_user_fecha_idx on public.food_logs (user_id, fecha);
