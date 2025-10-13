-- W-Garage CRM Database Schema для Supabase

-- 1. Таблица пользователей (Users)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'inspector', 'employee')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Таблица сотрудников (Employees)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  hire_date DATE NOT NULL,
  checklist JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Таблица проверок (Inspections)
CREATE TABLE inspections (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  score INTEGER NOT NULL,
  inspector TEXT NOT NULL,
  inspector_role TEXT NOT NULL,
  checked_items JSONB NOT NULL DEFAULT '{}',
  errors JSONB NOT NULL DEFAULT '[]',
  total_items INTEGER NOT NULL,
  comments JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Таблица фотографий (Photos) - отдельно для экономии места
CREATE TABLE inspection_photos (
  id SERIAL PRIMARY KEY,
  inspection_id INTEGER REFERENCES inspections(id) ON DELETE CASCADE,
  item_index INTEGER NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Таблица логов активности (Activity Log)
CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_name TEXT
);

-- 6. Индексы для быстрого поиска
CREATE INDEX idx_inspections_employee ON inspections(employee_id);
CREATE INDEX idx_inspections_date ON inspections(date DESC);
CREATE INDEX idx_photos_inspection ON inspection_photos(inspection_id);
CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp DESC);

-- 7. Включить Row Level Security (безопасность)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- 8. Политики доступа (разрешить всем читать/писать для начала)
-- ВАЖНО: В продакшене нужны более строгие политики!
CREATE POLICY "Enable all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for employees" ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for inspections" ON inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for photos" ON inspection_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for activity_log" ON activity_log FOR ALL USING (true) WITH CHECK (true);

-- 9. Добавим реальных пользователей W-Garage
INSERT INTO users (username, password, name, role) VALUES
  ('admin', 'admin123', 'Адміністратор', 'admin'),
  ('pustovoi', 'pustovoi123', 'Пустовой Ігор', 'admin'),
  ('moloda', 'moloda123', 'Молода Юлія', 'admin'),
  ('halyant', 'halyant123', 'Галянт Володимир', 'admin'),
  ('inspector1', 'inspector123', 'Інспектор 1', 'inspector'),
  ('inspector2', 'inspector123', 'Інспектор 2', 'inspector'),
  ('inspector3', 'inspector123', 'Інспектор 3', 'inspector');

-- 10. Добавим 30 реальных сотрудников W-Garage
INSERT INTO employees (name, position, department, phone, email, hire_date, checklist) VALUES
  -- Керівництво
  ('Пустовой Ігор', 'Нач. відділу |6|HR|', 'Керівництво', '+380501111111', 'pustovoi@wgarage.ua', '2020-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Порядок на столі"]'),
  ('Молода Юлія', 'Зам. дир. |РО1|РО3|', 'Керівництво', '+380501111112', 'moloda@wgarage.ua', '2020-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Порядок на столі"]'),
  ('Галянт Володимир', 'Зам. дір. |РО2|РО4|РО5|', 'Керівництво', '+380501111113', 'halyant@wgarage.ua', '2020-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Порядок на столі"]'),
  ('Щукін Володимир', 'Нач. відділу |7|РОМ|', 'Керівництво', '+380501111114', 'shchukin@wgarage.ua', '2020-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Порядок на столі"]'),
  ('Вірченко Ігор', 'Нач. відділу |2|РОП|', 'Керівництво', '+380501111115', 'virchenko@wgarage.ua', '2020-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Порядок на столі"]'),
   
  -- Топливщики Т1
  ('Борченко Костянтин', 'Топливщик', 'Топливщик Т|1|', '+380502222221', 'borchenko.k@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Резниченко Сергій', 'Топливщик', 'Топливщик Т|1|', '+380502222222', 'reznichenko@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Шелест Анатолій', 'Топливщик', 'Топливщик Т|1|', '+380502222223', 'shelest@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Топал Станіслав', 'Топливщик', 'Топливщик Т|1|', '+380502222224', 'topal@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Герасимов Артем', 'Топливщик', 'Топливщик Т|1|', '+380502222225', 'gerasimov@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Борченко Артем', 'Топливщик', 'Топливщик Т|1|', '+380502222226', 'borchenko.a@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
   
  -- Топливщики Т2
  ('Чернишов Євген', 'Топливщик', 'Топливщик Т|2|', '+380502222231', 'chernyshov@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Радченко Владислав', 'Топливщик', 'Топливщик Т|2|', '+380502222232', 'radchenko@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
   
  -- Топливщики Т3
  ('Беденков Микола', 'Топливщик', 'Топливщик Т|3|', '+380502222241', 'bedenkov@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Усач Іван', 'Топливщик', 'Топливщик Т|3|', '+380502222242', 'usach@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
  ('Давидов Сергій', 'Топливщик', 'Топливщик Т|3|', '+380502222243', 'davydov@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Порядок на території"]'),
   
  -- Менеджери
  ('Маклашевський Сергій', 'Менеджер з продажу', 'Менеджери', '+380503333331', 'maklashevsky@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Робота з клієнтами"]'),
  ('Трофименко Данило', 'Менеджер з продажу', 'Менеджери', '+380503333332', 'trofimenko@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Робота з клієнтами"]'),
  ('Сусленков Віктор', 'Менеджер з продажу', 'Менеджери', '+380503333333', 'suslenkov@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Робота з клієнтами"]'),
   
  -- Склад
  ('Гузенко Даніїл', 'Приймальник агрегатів', 'Склад', '+380504444441', 'guzenko@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Порядок на складі", "Облік товарів", "Дотримання техніки безпеки"]'),
  ('Яковлєв Олег', 'Спеціаліст складу', 'Склад', '+380504444442', 'yakovlev@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Порядок на складі", "Облік товарів", "Дотримання техніки безпеки"]'),
   
  -- Автомеханіки
  ('Лисий Олег', 'Автомеханік', 'Автомеханіки', '+380505555551', 'lysyi@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Якість ремонту"]'),
  ('Юрчак Олег', 'Автомеханік', 'Автомеханіки', '+380505555552', 'yurchak@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Якість ремонту"]'),
  ('Коринецький Євген', 'Автомеханік', 'Автомеханіки', '+380505555553', 'korynetsky@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Якість ремонту"]'),
  ('Нікоаре Аурел', 'Автомеханік', 'Автомеханіки', '+380505555554', 'nikoare@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Якість ремонту"]'),
   
  -- Бухгалтерія
  ('Смик Стефанія', 'Бухгалтер-касир', 'Бухгалтерія', '+380506666661', 'smyk@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Робота з каса"]'),
  ('Алексєєва Валентина', 'Бухгалтер ФОП', 'Бухгалтерія', '+380506666662', 'alekseeva@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Ведення обліку"]'),
  ('Кортунова Тетяна', 'Бухгалтер ТОВ', 'Бухгалтерія', '+380506666663', 'kortunova@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Організація документів", "Дотримання дрес-коду", "Ведення обліку"]'),
   
  -- Технічні спеціалісти
  ('Литвинов Олексій', 'Ремонтник електроніки', 'Технічні спеціалісти', '+380507777771', 'lytvynov@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Якість ремонту"]'),
  ('Токар', 'Токар-універсал', 'Технічні спеціалісти', '+380507777772', 'tokar@wgarage.ua', '2021-01-01',
   '["Чистота робочого місця", "Наявність інструменту", "Дотримання техніки безпеки", "Форма одягу", "Якість роботи"]');

-- Выведем сообщение об успехе
SELECT 'База данных успешно создана! ✅' as status;


-- =====================================================================================
-- v2: Multi-tenant, Role-based CRM Schema for Supabase (safe to run multiple times)
-- =====================================================================================
-- Notes:
-- - This section defines a full-featured CRM schema with organizations, memberships,
--   roles, pipelines, deals, contacts, activities, tags, files, and audit logs.
-- - Uses RLS with helper functions so every table is organization-scoped and protected.
-- - Works with Supabase Auth (auth.users) via a public.profiles table.
-- - Keep the legacy W-Garage tables above if you still need them; this is additive.

-- Extensions
create extension if not exists pgcrypto;

-- 0) Helpers: current user id for Supabase or generic PostgREST/Hasura JWT
create or replace function public.current_user_id()
returns uuid
language plpgsql
stable
as $$
declare
  uid uuid;
  raw text;
  sub text;
begin
  -- Try Supabase auth.uid()
  begin
    uid := auth.uid();
  exception when others then
    uid := null;
  end;
  if uid is not null then
    return uid;
  end if;

  -- Try PostgREST/Hasura style JWT claims in GUC 'request.jwt.claims'
  begin
    raw := current_setting('request.jwt.claims', true);
  exception when others then
    raw := null;
  end;
  if raw is not null then
    begin
      sub := (raw::jsonb ->> 'sub');
      if sub is not null then
        return sub::uuid;
      end if;
    exception when others then
      return null;
    end;
  end if;

  return null;
end;$$;

-- 1) Profiles (link to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_profile_updated()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
before update on public.profiles
for each row execute procedure public.handle_profile_updated();

-- Create profile on auth.users insert (always create function and trigger)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $func$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'avatar_url', ''))
  on conflict (id) do nothing;
  return new;
end;
$func$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists profiles_self_access on public.profiles;
create policy profiles_self_access on public.profiles
  using (id = public.current_user_id())
  with check (id = public.current_user_id());

-- 2) Organizations and Memberships
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','inspector','sales','support','employee','viewer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

-- Helper functions for RLS
create or replace function public.is_org_member(org_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org_id
      and m.user_id = public.current_user_id()
      and m.is_active = true
  );
$$;

create or replace function public.has_org_role(org_id uuid, roles text[])
returns boolean language sql stable as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org_id
      and m.user_id = public.current_user_id()
      and m.is_active = true
      and m.role = any(roles)
  );
$$;

create or replace function public.is_org_admin(org_id uuid)
returns boolean language sql stable as $$
  select public.has_org_role(org_id, array['owner','admin']);
$$;

-- RLS for organizations and memberships
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;

drop policy if exists org_select on public.organizations;
create policy org_select on public.organizations
  for select using (public.is_org_member(id));

drop policy if exists org_insert on public.organizations;
create policy org_insert on public.organizations
  for insert with check (public.current_user_id() is not null);

drop policy if exists org_update on public.organizations;
create policy org_update on public.organizations
  for update using (public.is_org_admin(id)) with check (public.is_org_admin(id));

drop policy if exists org_delete on public.organizations;
create policy org_delete on public.organizations
  for delete using (public.is_org_admin(id));

drop policy if exists member_select on public.memberships;
create policy member_select on public.memberships
  for select using (public.is_org_member(organization_id));

drop policy if exists member_insert on public.memberships;
create policy member_insert on public.memberships
  for insert with check (public.is_org_admin(organization_id));

drop policy if exists member_update on public.memberships;
create policy member_update on public.memberships
  for update using (public.is_org_admin(organization_id)) with check (public.is_org_admin(organization_id));

drop policy if exists member_delete on public.memberships;
create policy member_delete on public.memberships
  for delete using (public.is_org_admin(organization_id));

-- 3) Pipelines and Stages
create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.deal_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.pipelines enable row level security;
alter table public.deal_stages enable row level security;

drop policy if exists pipeline_select on public.pipelines;
create policy pipeline_select on public.pipelines for select using (public.is_org_member(organization_id));

drop policy if exists pipeline_cud on public.pipelines;
create policy pipeline_cud on public.pipelines for all using (public.is_org_member(organization_id)) with check (public.has_org_role(organization_id, array['owner','admin','manager']));

drop policy if exists stage_select on public.deal_stages;
create policy stage_select on public.deal_stages for select using (public.is_org_member(organization_id));

drop policy if exists stage_cud on public.deal_stages;
create policy stage_cud on public.deal_stages for all using (public.is_org_member(organization_id)) with check (public.has_org_role(organization_id, array['owner','admin','manager']));

-- 4) Accounts (Companies) and Contacts
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  domain text,
  phone text,
  email text,
  address jsonb not null default '{}',
  owner_id uuid references public.profiles(id) on delete set null,
  custom_fields jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;$$;

drop trigger if exists trg_companies_updated on public.companies;
create trigger trg_companies_updated before update on public.companies
for each row execute procedure public.handle_updated_timestamp();

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  first_name text,
  last_name text,
  email text,
  phone text,
  position text,
  owner_id uuid references public.profiles(id) on delete set null,
  custom_fields jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_contacts_updated on public.contacts;
create trigger trg_contacts_updated before update on public.contacts
for each row execute procedure public.handle_updated_timestamp();

alter table public.companies enable row level security;
alter table public.contacts enable row level security;

drop policy if exists company_select on public.companies;
create policy company_select on public.companies for select using (public.is_org_member(organization_id));

drop policy if exists company_insert on public.companies;
create policy company_insert on public.companies for insert with check (public.has_org_role(organization_id, array['owner','admin','manager','sales']));

drop policy if exists company_update on public.companies;
create policy company_update on public.companies for update using (public.is_org_member(organization_id)) with check (
  public.is_org_admin(organization_id) or owner_id = public.current_user_id()
);

drop policy if exists company_delete on public.companies;
create policy company_delete on public.companies for delete using (public.is_org_admin(organization_id));

drop policy if exists contact_select on public.contacts;
create policy contact_select on public.contacts for select using (public.is_org_member(organization_id));

drop policy if exists contact_insert on public.contacts;
create policy contact_insert on public.contacts for insert with check (public.has_org_role(organization_id, array['owner','admin','manager','sales','support']));

drop policy if exists contact_update on public.contacts;
create policy contact_update on public.contacts for update using (public.is_org_member(organization_id)) with check (
  public.is_org_admin(organization_id) or owner_id = public.current_user_id()
);

drop policy if exists contact_delete on public.contacts;
create policy contact_delete on public.contacts for delete using (public.is_org_admin(organization_id));

-- 5) Deals
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  pipeline_id uuid not null references public.pipelines(id) on delete restrict,
  stage_id uuid not null references public.deal_stages(id) on delete restrict,
  amount numeric(14,2) not null default 0,
  currency text not null default 'UAH',
  status text not null check (status in ('open','won','lost','deleted')) default 'open',
  owner_id uuid references public.profiles(id) on delete set null,
  close_date date,
  custom_fields jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_deals_updated on public.deals;
create trigger trg_deals_updated before update on public.deals
for each row execute procedure public.handle_updated_timestamp();

alter table public.deals enable row level security;

drop policy if exists deals_select on public.deals;
create policy deals_select on public.deals for select using (public.is_org_member(organization_id));

drop policy if exists deals_insert on public.deals;
create policy deals_insert on public.deals for insert with check (public.has_org_role(organization_id, array['owner','admin','manager','sales']));

drop policy if exists deals_update on public.deals;
create policy deals_update on public.deals for update using (public.is_org_member(organization_id)) with check (
  public.is_org_admin(organization_id) or owner_id = public.current_user_id()
);

drop policy if exists deals_delete on public.deals;
create policy deals_delete on public.deals for delete using (public.is_org_admin(organization_id));

-- 6) Activities (tasks, calls, meetings, emails, notes)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  type text not null check (type in ('task','call','meeting','email','note')),
  deal_id uuid references public.deals(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete cascade,
  title text,
  content text,
  due_at timestamptz,
  completed_at timestamptz,
  assigned_to uuid references public.profiles(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_activities_updated on public.activities;
create trigger trg_activities_updated before update on public.activities
for each row execute procedure public.handle_updated_timestamp();

alter table public.activities enable row level security;

drop policy if exists activities_select on public.activities;
create policy activities_select on public.activities for select using (public.is_org_member(organization_id));

drop policy if exists activities_insert on public.activities;
create policy activities_insert on public.activities for insert with check (public.has_org_role(organization_id, array['owner','admin','manager','sales','support','inspector']));

drop policy if exists activities_update on public.activities;
create policy activities_update on public.activities for update using (public.is_org_member(organization_id)) with check (
  public.is_org_admin(organization_id) or owner_id = public.current_user_id() or assigned_to = public.current_user_id()
);

drop policy if exists activities_delete on public.activities;
create policy activities_delete on public.activities for delete using (
  public.is_org_admin(organization_id) or owner_id = public.current_user_id()
);

-- 7) Tags
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.taggings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  target_type text not null check (target_type in ('company','contact','deal')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (organization_id, tag_id, target_type, target_id)
);

alter table public.tags enable row level security;
alter table public.taggings enable row level security;

drop policy if exists tag_select on public.tags;
create policy tag_select on public.tags for select using (public.is_org_member(organization_id));

drop policy if exists tag_cud on public.tags;
create policy tag_cud on public.tags for all using (public.is_org_member(organization_id)) with check (public.has_org_role(organization_id, array['owner','admin','manager','sales','support']));

drop policy if exists tagging_select on public.taggings;
create policy tagging_select on public.taggings for select using (public.is_org_member(organization_id));

drop policy if exists tagging_cud on public.taggings;
create policy tagging_cud on public.taggings for all using (public.is_org_member(organization_id)) with check (public.has_org_role(organization_id, array['owner','admin','manager','sales','support']));

-- 8) Files (metadata only; store payloads in Supabase Storage)
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  record_type text not null check (record_type in ('company','contact','deal','activity')),
  record_id uuid not null,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.files enable row level security;

drop policy if exists files_select on public.files;
create policy files_select on public.files for select using (public.is_org_member(organization_id));

drop policy if exists files_insert on public.files;
create policy files_insert on public.files for insert with check (public.has_org_role(organization_id, array['owner','admin','manager','sales','support','inspector']));

drop policy if exists files_delete on public.files;
create policy files_delete on public.files for delete using (public.is_org_admin(organization_id) or uploaded_by = public.current_user_id());

-- 9) Audit Logs (visible to org admins only)
create table if not exists public.audit_logs (
  id bigserial primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

drop policy if exists audit_select on public.audit_logs;
create policy audit_select on public.audit_logs for select using (public.is_org_admin(organization_id));

drop policy if exists audit_insert on public.audit_logs;
create policy audit_insert on public.audit_logs for insert with check (public.is_org_member(organization_id));

-- 10) Seed base roles for a newly created organization (helper optional)
-- Creates a membership for the caller as 'owner' for the provided organization id
create or replace function public.seed_organization(_org_id uuid, _name text)
returns uuid language plpgsql as $$
declare
  org_id uuid;
  p_id uuid;
begin
  if _org_id is null then
    org_id := gen_random_uuid();
  else
    org_id := _org_id;
  end if;

  insert into public.organizations (id, name, created_by)
  values (org_id, coalesce(_name, 'New Organization'), public.current_user_id())
  on conflict (id) do nothing;

  insert into public.memberships (organization_id, user_id, role, is_active)
  values (org_id, public.current_user_id(), 'owner', true)
  on conflict (organization_id, user_id) do update set role = excluded.role, is_active = excluded.is_active;

  -- Create a default pipeline and default stages
  with ins as (
    insert into public.pipelines (organization_id, name, created_by)
    values (org_id, 'Default Pipeline', public.current_user_id())
    on conflict do nothing
    returning id
  )
  select coalesce((select id from ins), (
    select id from public.pipelines where organization_id = org_id and name = 'Default Pipeline' limit 1
  )) into p_id;

  -- Insert default stages if none exist for this pipeline
  if not exists (select 1 from public.deal_stages where pipeline_id = p_id) then
    insert into public.deal_stages (organization_id, pipeline_id, name, position)
    values
      (org_id, p_id, 'Новый', 10),
      (org_id, p_id, 'В работе', 20),
      (org_id, p_id, 'Переговоры', 30),
      (org_id, p_id, 'Закрыто: выиграно', 40),
      (org_id, p_id, 'Закрыто: проиграно', 50);
  end if;

  return org_id;
end;$$;

comment on function public.seed_organization is 'Creates an organization with caller as owner; returns organization id';

-- 11) Convenience views (optional): counts & summaries
create or replace view public.v_deal_summary as
select d.id,
       d.organization_id,
       d.title,
       d.amount,
       d.currency,
       d.status,
       d.owner_id,
       s.name as stage_name,
       p.name as pipeline_name,
       c.name as company_name
from public.deals d
left join public.deal_stages s on s.id = d.stage_id
left join public.pipelines p on p.id = d.pipeline_id
left join public.companies c on c.id = d.company_id;

-- 12) Indexes for performance
create index if not exists idx_memberships_user on public.memberships(user_id);
create index if not exists idx_companies_org on public.companies(organization_id);
create index if not exists idx_contacts_org on public.contacts(organization_id);
create index if not exists idx_deals_org on public.deals(organization_id);
create index if not exists idx_activities_org on public.activities(organization_id);
create index if not exists idx_tags_org on public.tags(organization_id);
create index if not exists idx_taggings_target on public.taggings(target_type, target_id);
create index if not exists idx_files_org on public.files(organization_id);
create index if not exists idx_audit_org on public.audit_logs(organization_id);

-- All done
select 'v2 multi-tenant CRM schema applied ✅' as status;
