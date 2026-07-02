-- ============================================================
-- AtlasQuest Cloud v1 — schéma Supabase
-- À coller dans : Dashboard Supabase → SQL Editor → New query → Run
-- ============================================================

-- Table des sauvegardes : 1 ligne = 1 famille (code = clé d'accès secrète)
create table if not exists public.backups (
  code uuid primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS activé SANS policy : la table est totalement inaccessible en direct
-- via l'API publique. Toute lecture/écriture passe par les fonctions
-- ci-dessous, qui exigent le code famille exact (impossible de lister
-- ou d'énumérer les sauvegardes des autres familles).
alter table public.backups enable row level security;
revoke all on table public.backups from anon, authenticated;

-- Écriture (création ou mise à jour) d'une sauvegarde
create or replace function public.put_backup(p_code uuid, p_data jsonb)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  -- garde-fou anti-abus : une sauvegarde AtlasQuest fait quelques Ko
  if length(p_data::text) > 200000 then
    raise exception 'payload too large';
  end if;
  insert into backups(code, data, updated_at)
  values (p_code, p_data, now())
  on conflict (code) do update
    set data = excluded.data, updated_at = now();
end;
$$;

-- Lecture d'une sauvegarde (null si le code n'existe pas)
create or replace function public.get_backup(p_code uuid)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select data from backups where code = p_code;
$$;

grant execute on function public.put_backup(uuid, jsonb) to anon;
grant execute on function public.get_backup(uuid) to anon;
