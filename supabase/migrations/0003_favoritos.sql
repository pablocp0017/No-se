-- Comidas/alimentos guardados como favoritos, para reutilizarlos rápido desde "Añadir alimento".
-- Ejecutar en el SQL Editor de Supabase (además de 0001_init.sql y 0002_peso_objetivo.sql).

create table public.food_favorites (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  food_id uuid not null references public.foods (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, food_id)
);

alter table public.food_favorites enable row level security;

create policy "El usuario ve sus propios favoritos" on public.food_favorites
  for select using (auth.uid() = user_id);
create policy "El usuario guarda sus propios favoritos" on public.food_favorites
  for insert with check (auth.uid() = user_id);
create policy "El usuario borra sus propios favoritos" on public.food_favorites
  for delete using (auth.uid() = user_id);

grant select, insert, delete on public.food_favorites to authenticated;

create index food_favorites_user_idx on public.food_favorites (user_id, created_at desc);
