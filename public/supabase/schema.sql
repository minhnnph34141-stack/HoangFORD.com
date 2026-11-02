-- HOANG FORD AUTO: Supabase schema
-- Run this file in Supabase > SQL Editor > New query.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'SUV',
  badge text,
  short_description text,
  description text,
  image_url text,
  gallery text[] not null default '{}',
  versions text[] not null default '{}',
  seats text,
  engine text,
  transmission text,
  drivetrain text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_prices (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  version_name text not null,
  model_year integer,
  list_price numeric(15,2),
  promotion_price numeric(15,2),
  effective_from date,
  effective_to date,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicle_prices_valid_price check (
    (list_price is null or list_price >= 0) and
    (promotion_price is null or promotion_price >= 0)
  )
);

create table if not exists public.customer_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  vehicle_name text,
  lead_type text not null default 'Tư vấn',
  message text,
  status text not null default 'Mới'
    check (status in ('Mới','Đã liên hệ','Đang tư vấn','Đã chốt','Không thành công')),
  source text not null default 'Website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_drive_appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  vehicle_name text not null,
  scheduled_at timestamptz not null,
  location text,
  note text,
  status text not null default 'Chờ xác nhận'
    check (status in ('Chờ xác nhận','Đã xác nhận','Đã hoàn thành','Đã hủy')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade compatibility: an earlier quick-start version may already have created
-- customer_leads with a smaller column set. Add the fields used by this app safely.
alter table public.customer_leads add column if not exists vehicle_id uuid references public.vehicles(id) on delete set null;
alter table public.customer_leads add column if not exists vehicle_name text;
alter table public.customer_leads add column if not exists source text not null default 'Website';
alter table public.customer_leads add column if not exists updated_at timestamptz not null default now();
alter table public.customer_leads add column if not exists email text;
alter table public.customer_leads add column if not exists lead_type text not null default 'Tư vấn';
alter table public.customer_leads add column if not exists message text;
alter table public.customer_leads add column if not exists status text not null default 'Mới';

create index if not exists idx_leads_created_at on public.customer_leads(created_at desc);
create index if not exists idx_leads_status on public.customer_leads(status);
create index if not exists idx_appointments_scheduled_at on public.test_drive_appointments(scheduled_at);
create index if not exists idx_prices_vehicle on public.vehicle_prices(vehicle_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_vehicles_updated_at on public.vehicles;
create trigger trg_vehicles_updated_at before update on public.vehicles
for each row execute function public.set_updated_at();
drop trigger if exists trg_prices_updated_at on public.vehicle_prices;
create trigger trg_prices_updated_at before update on public.vehicle_prices
for each row execute function public.set_updated_at();
drop trigger if exists trg_leads_updated_at on public.customer_leads;
create trigger trg_leads_updated_at before update on public.customer_leads
for each row execute function public.set_updated_at();
drop trigger if exists trg_appointments_updated_at on public.test_drive_appointments;
create trigger trg_appointments_updated_at before update on public.test_drive_appointments
for each row execute function public.set_updated_at();

-- Create a profile automatically whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Security-definer helper avoids recursive RLS checks on profiles.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_prices enable row level security;
alter table public.customer_leads enable row level security;
alter table public.test_drive_appointments enable row level security;

-- Profiles: users can read their own profile; only admins can manage profiles.
drop policy if exists "profile_read_self_or_admin" on public.profiles;
create policy "profile_read_self_or_admin" on public.profiles
for select to authenticated using (id = (select auth.uid()) or public.is_admin());
drop policy if exists "profile_admin_manage" on public.profiles;
create policy "profile_admin_manage" on public.profiles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public visitors can only read active vehicle catalogue and active prices.
drop policy if exists "public_read_active_vehicles" on public.vehicles;
create policy "public_read_active_vehicles" on public.vehicles
for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists "admin_manage_vehicles" on public.vehicles;
create policy "admin_manage_vehicles" on public.vehicles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public_read_active_prices" on public.vehicle_prices;
create policy "public_read_active_prices" on public.vehicle_prices
for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists "admin_manage_prices" on public.vehicle_prices;
create policy "admin_manage_prices" on public.vehicle_prices
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public may submit a lead but cannot read/update customer records.
-- Remove the permissive policy name used by the previous quick-start SQL, if present.
drop policy if exists "Allow public lead submissions" on public.customer_leads;
drop policy if exists "public_submit_leads" on public.customer_leads;
create policy "public_submit_leads" on public.customer_leads
for insert to anon, authenticated with check (
  length(trim(full_name)) between 2 and 120 and
  length(regexp_replace(phone, '[^0-9]', '', 'g')) between 9 and 15 and
  status = 'Mới' and source = 'Website'
);
drop policy if exists "admin_manage_leads" on public.customer_leads;
create policy "admin_manage_leads" on public.customer_leads
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public may submit test-drive requests but only admins can view/manage them.
drop policy if exists "public_submit_test_drive" on public.test_drive_appointments;
create policy "public_submit_test_drive" on public.test_drive_appointments
for insert to anon, authenticated with check (
  length(trim(full_name)) between 2 and 120 and
  length(regexp_replace(phone, '[^0-9]', '', 'g')) between 9 and 15 and
  length(trim(vehicle_name)) between 2 and 120 and
  status = 'Chờ xác nhận' and scheduled_at > now()
);
drop policy if exists "admin_manage_test_drives" on public.test_drive_appointments;
create policy "admin_manage_test_drives" on public.test_drive_appointments
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Initial catalogue only. Prices and technical specifications are intentionally blank
-- until verified against the current official price list / exact vehicle version.
insert into public.vehicles (name, slug, category, badge, short_description, description, versions, sort_order)
values
 ('Ford Ranger','ranger','Bán tải','BÁN CHẠY','Mẫu bán tải đa dụng cho công việc và hành trình xa.','Thông tin chi tiết cần xác nhận theo phiên bản và năm sản xuất.','{"XL","XLS","Sport","Wildtrak","Stormtrak"}',1),
 ('Ford Everest','everest','SUV','SUV 7 CHỖ','SUV 7 chỗ dành cho gia đình và những chuyến đi dài.','Thông tin chi tiết cần xác nhận theo phiên bản và năm sản xuất.','{"Ambient","Sport","Titanium","Platinum"}',2),
 ('Ford Territory','territory','SUV','SUV ĐÔ THỊ','SUV đô thị hướng đến sự tiện nghi và nhu cầu hằng ngày.','Thông tin chi tiết cần xác nhận theo phiên bản và năm sản xuất.','{"Trend","Titanium","Titanium X"}',3),
 ('Ford Transit','transit','Thương mại','XE THƯƠNG MẠI','Xe thương mại phục vụ vận chuyển hành khách và doanh nghiệp.','Thông tin chi tiết cần xác nhận theo cấu hình xe.','{"Transit"}',4),
 ('Ford Ranger Raptor','ranger-raptor','Bán tải','HIỆU NĂNG CAO','Phiên bản bán tải hiệu năng cao.','Thông tin chi tiết cần xác nhận theo phiên bản và năm sản xuất.','{"Ranger Raptor"}',5),
 ('Ford Explorer','explorer','SUV','SUV CAO CẤP','SUV cỡ lớn; tình trạng phân phối cần xác nhận theo thời điểm.','Thông tin chi tiết cần xác nhận theo nguồn xe và năm sản xuất.','{"Explorer"}',6)
on conflict (slug) do nothing;
