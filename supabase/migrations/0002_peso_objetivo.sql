-- Añade el peso objetivo del usuario, usado para estimar el tiempo hasta alcanzarlo.
-- Ejecutar en el SQL Editor de Supabase (además de 0001_init.sql, que ya deberías tener aplicado).

alter table public.profiles add column if not exists peso_objetivo_kg numeric;

-- Para perfiles ya existentes sin peso objetivo, se asume su peso actual (equivale a "mantener").
update public.profiles set peso_objetivo_kg = peso_kg where peso_objetivo_kg is null;
