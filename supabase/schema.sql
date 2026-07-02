-- ============================================================
-- AtlasQuest Cloud v1 — schéma Supabase (version mobile-friendly)
-- À coller dans : Dashboard Supabase → SQL Editor
-- Sur téléphone : exécuter les 4 blocs UN PAR UN (vider l'éditeur
-- entre chaque bloc) pour éviter les collages tronqués.
-- ============================================================

-- ---------- BLOC 1 : table + verrouillage ----------
-- RLS activé SANS policy : la table est inaccessible en direct via
-- l'API publique. Le garde-fou anti-abus (taille max ~200 Ko) est
-- porté par une contrainte de table.
create table if not exists public.backups (
  code uuid primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint backups_data_size check (length(data::text) < 200000)
);
alter table public.backups enable row level security;
revoke all on table public.backups from anon, authenticated;

-- ---------- BLOC 2 : écriture d'une sauvegarde ----------
-- security definer : seule porte d'entrée en écriture ; exige le
-- code famille exact (non listable, non énumérable).
create or replace function public.put_backup(p_code uuid, p_data jsonb)
returns void language sql security definer set search_path = public as $$
  insert into public.backups(code, data, updated_at)
  values (p_code, p_data, now())
  on conflict (code) do update set data = excluded.data, updated_at = now();
$$;

-- ---------- BLOC 3 : lecture d'une sauvegarde ----------
-- Renvoie null si le code n'existe pas.
create or replace function public.get_backup(p_code uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select data from public.backups where code = p_code;
$$;

-- ---------- BLOC 4 : droits d'exécution ----------
grant execute on function public.put_backup(uuid, jsonb) to anon;
grant execute on function public.get_backup(uuid) to anon;
