-- Kodepos Surabaya master table
create table if not exists public.kodepos_surabaya (
  id bigserial primary key,
  kodepos text not null,
  kecamatan text not null,
  kelurahan text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists kodepos_surabaya_unique
  on public.kodepos_surabaya (kodepos, kecamatan, kelurahan);

create index if not exists kodepos_surabaya_kodepos_idx
  on public.kodepos_surabaya (kodepos);
