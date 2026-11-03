CREATE TABLE public.complexes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  developer text NOT NULL,
  district text NOT NULL,
  completion_year integer,
  completion_quarter integer,
  price_from bigint,
  finish text,
  address text,
  description text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  commission_note text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN public.complexes.commission_note IS 'Filled manually by admin only (e.g. developer pays commission). Never auto-generated.';
GRANT SELECT ON public.complexes TO anon, authenticated;
GRANT ALL ON public.complexes TO service_role;
ALTER TABLE public.complexes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active complexes" ON public.complexes FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE TABLE public.complex_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complex_id uuid NOT NULL REFERENCES public.complexes(id) ON DELETE CASCADE,
  rooms integer NOT NULL,
  area numeric NOT NULL,
  price_from bigint,
  image text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.complex_layouts TO anon, authenticated;
GRANT ALL ON public.complex_layouts TO service_role;
ALTER TABLE public.complex_layouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view layouts" ON public.complex_layouts FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_settings (key, value) VALUES ('rental_catalog_enabled', 'false'::jsonb);

CREATE TABLE public.rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  rooms integer NOT NULL DEFAULT 1,
  area_total numeric,
  price_month bigint NOT NULL,
  district text,
  address text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  verified_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rentals TO anon, authenticated;
GRANT ALL ON public.rentals TO service_role;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active rentals" ON public.rentals FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  name text,
  phone text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  consent boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_kind_chk CHECK (kind IN ('valuation','complex_selection','rent','let','general')),
  CONSTRAINT leads_phone_len CHECK (char_length(phone) BETWEEN 5 AND 30)
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (consent);

INSERT INTO public.complexes (slug, name, developer, district, completion_year, completion_quarter, price_from, finish, address, description, images) VALUES
('demo-zhk-1','Демо ЖК «Северный»','[заполнить застройщика]','Заельцовский',2026,4,5200000,'Без отделки','[заполнить адрес]','[заполнить]','["/images/building.jpg"]'),
('demo-zhk-2','Демо ЖК «Речной»','[заполнить застройщика]','Октябрьский',2027,2,6100000,'White box','[заполнить адрес]','[заполнить]','["/images/building.jpg"]'),
('demo-zhk-3','Демо ЖК «Академ Парк»','[заполнить застройщика]','Советский',2026,2,4800000,'Чистовая','[заполнить адрес]','[заполнить]','["/images/building.jpg"]'),
('demo-zhk-4','Демо ЖК «Левый берег»','[заполнить застройщика]','Ленинский',2027,4,4300000,'Без отделки','[заполнить адрес]','[заполнить]','["/images/building.jpg"]'),
('demo-zhk-5','Демо ЖК «Центр»','[заполнить застройщика]','Центральный',2025,4,8900000,'Чистовая','[заполнить адрес]','[заполнить]','["/images/building.jpg"]'),
('demo-zhk-6','Демо ЖК «Калинка»','[заполнить застройщика]','Калининский',2028,1,4500000,'White box','[заполнить адрес]','[заполнить]','["/images/building.jpg"]');

INSERT INTO public.complex_layouts (complex_id, rooms, area, price_from)
SELECT c.id, l.rooms, l.area, (c.price_from * l.k)::bigint
FROM public.complexes c
CROSS JOIN (VALUES (0, 26.0, 1.0), (1, 38.5, 1.35), (2, 56.0, 1.85), (3, 78.0, 2.5)) AS l(rooms, area, k)
WHERE c.slug LIKE 'demo-zhk-%';