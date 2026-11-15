-- Propuesta lógica PostgreSQL para ForgeLock Admin Core.
-- Solo documentación: no ejecutar ni conectar en demos. No usa credenciales.

create table businesses (
  id uuid primary key,
  slug text not null unique,
  display_name text not null,
  sector text not null,
  status text not null default 'draft' check (status in ('draft','active','archived')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table business_members (
  business_id uuid not null references businesses(id) on delete cascade,
  identity_subject uuid not null,
  role text not null check (role in ('owner','administrator','editor','viewer')),
  created_at timestamptz not null default now(),
  primary key (business_id, identity_subject)
);

create table categories (
  id uuid primary key,
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  unique (business_id, name),
  unique (business_id, id)
);

create table media_assets (
  id uuid primary key,
  business_id uuid not null references businesses(id) on delete cascade,
  source_url text not null,
  alt_text text not null,
  rights_note text not null,
  mime_type text,
  width integer,
  height integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, id)
);

create table content_items (
  id uuid primary key,
  business_id uuid not null references businesses(id) on delete cascade,
  category_id uuid,
  content_type text not null check (content_type in (
    'product','service','professional','course','promotion','portfolio_piece'
  )),
  title text not null,
  slug text not null,
  description text not null default '',
  price_amount numeric(12,2),
  price_currency char(3),
  attributes jsonb not null default '{}'::jsonb,
  image_asset_id uuid,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, slug),
  unique (business_id, id),
  foreign key (business_id, category_id) references categories(business_id, id),
  foreign key (business_id, image_asset_id) references media_assets(business_id, id)
);

create table business_hours (
  id uuid primary key,
  business_id uuid not null references businesses(id) on delete cascade,
  content_item_id uuid,
  weekday smallint not null check (weekday between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  foreign key (business_id, content_item_id) references content_items(business_id, id),
  check ((is_closed and opens_at is null and closes_at is null)
      or (not is_closed and opens_at is not null and closes_at is not null))
);

create table marketplace_channels (
  id uuid primary key,
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  store_url text not null,
  logo_asset_id uuid not null,
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (business_id, logo_asset_id) references media_assets(business_id, id)
);

create index content_items_public_order on content_items (business_id, content_type, is_active, sort_order);
create index marketplace_channels_public_order on marketplace_channels (business_id, is_active, sort_order);

-- Tenant authorization/RLS, storage rules, image allowlists and identity-provider
-- foreign keys must be designed and reviewed before any real deployment.
