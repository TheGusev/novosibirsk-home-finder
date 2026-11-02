CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('resale','new')),
  rooms int NOT NULL DEFAULT 1,
  area_total numeric(7,2) NOT NULL,
  area_kitchen numeric(6,2),
  floor int,
  floors_total int,
  price bigint NOT NULL,
  price_per_m2 bigint GENERATED ALWAYS AS (round(price / NULLIF(area_total,0))::bigint) STORED,
  district text NOT NULL,
  metro text,
  address text,
  lat double precision,
  lng double precision,
  house_type text,
  finish text,
  description text,
  source_type text NOT NULL DEFAULT 'agency' CHECK (source_type IN ('owner','agency','developer')),
  responsible_agent_id uuid,
  price_verified_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','reserved','sold','hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  images jsonb NOT NULL DEFAULT '[]'::jsonb
);
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view listed properties" ON public.properties FOR SELECT TO anon, authenticated USING (status IN ('active','reserved'));

INSERT INTO public.properties (slug,title,type,rooms,area_total,area_kitchen,floor,floors_total,price,district,metro,address,lat,lng,house_type,finish,description,source_type,price_verified_at,created_at,images) VALUES
('demo-1','Демо · 2-комнатная у площади Ленина','resale',2,58,10,12,17,8200000,'Центральный','Площадь Ленина','ул. Демо-Центральная, 1',55.0302,82.9204,'Монолит','Евроремонт','Демо-объект. [заполнить]','agency',now()-interval '2 days',now()-interval '20 days','["/images/hero.jpg","/images/interior.jpg"]'),
('demo-2','Демо · 1-комнатная у Октябрьской','resale',1,39,8,5,10,5100000,'Октябрьский','Октябрьская','ул. Демо-Октябрьская, 5',55.0186,82.9390,'Панель','Косметический','Демо-объект. [заполнить]','owner',now()-interval '5 days',now()-interval '15 days','["/images/interior.jpg"]'),
('demo-3','Демо · 3-комнатная в Академгородке','new',3,76,14,4,9,9800000,'Советский',NULL,'Демо-проспект, 12',54.8460,83.0920,'Кирпич','Чистовая','Демо-объект. [заполнить]','developer',now()-interval '1 day',now()-interval '3 days','["/images/building.jpg"]'),
('demo-4','Демо · студия на левом берегу','new',0,26,NULL,8,24,3600000,'Ленинский','Студенческая','ул. Демо-Левобережная, 3',54.9890,82.8970,'Монолит','White box','Демо-объект. [заполнить]','developer',now()-interval '3 days',now()-interval '2 days','["/images/interior.jpg"]'),
('demo-5','Демо · 2-комнатная у Заельцовской','resale',2,54,7,3,5,6300000,'Заельцовский','Заельцовская','ул. Демо-Заельцовская, 8',55.0590,82.9120,'Кирпич','Требует ремонта','Демо-объект. [заполнить]','owner',now()-interval '10 days',now()-interval '40 days','["/images/hero.jpg"]'),
('demo-6','Демо · 4-комнатная в Калининском','new',4,98,16,14,19,11900000,'Калининский','Заельцовская','ул. Демо-Калининская, 20',55.0840,82.9590,'Монолит','Чистовая','Демо-объект. [заполнить]','developer',now()-interval '4 days',now()-interval '6 days','["/images/building.jpg"]'),
('demo-7','Демо · 1-комнатная у Речного вокзала','resale',1,42,9,9,16,5600000,'Октябрьский','Речной вокзал','ул. Демо-Набережная, 2',55.0090,82.9380,'Монолит','Евроремонт','Демо-объект. [заполнить]','agency',now()-interval '6 days',now()-interval '12 days','["/images/interior.jpg"]'),
('demo-8','Демо · 2-комнатная в Кировском','resale',2,51,8,7,9,5400000,'Кировский','Площадь Маркса','ул. Демо-Кировская, 14',54.9830,82.8960,'Панель','Косметический','Демо-объект. [заполнить]','agency',now()-interval '8 days',now()-interval '25 days','["/images/hero.jpg"]'),
('demo-9','Демо · 3-комнатная у Гагаринской','resale',3,68,10,6,10,8100000,'Заельцовский','Гагаринская','ул. Демо-Красный проспект, 77',55.0510,82.9150,'Кирпич','Евроремонт','Демо-объект. [заполнить]','owner',now()-interval '2 days',now()-interval '9 days','["/images/interior.jpg"]'),
('demo-10','Демо · студия у Маршала Покрышкина','new',0,28,NULL,15,25,4200000,'Железнодорожный','Маршала Покрышкина','ул. Демо-Железнодорожная, 4',55.0430,82.9330,'Монолит','Чистовая','Демо-объект. [заполнить]','developer',now()-interval '1 day',now()-interval '1 day','["/images/building.jpg"]'),
('demo-11','Демо · 2-комнатная у Берёзовой рощи','new',2,60,12,10,18,7400000,'Дзержинский','Берёзовая роща','ул. Демо-Дзержинская, 30',55.0430,82.9730,'Монолит','White box','Демо-объект. [заполнить]','developer',now()-interval '3 days',now()-interval '4 days','["/images/building.jpg","/images/interior.jpg"]'),
('demo-12','Демо · 1-комнатная в Первомайском','resale',1,36,7,2,5,3500000,'Первомайский',NULL,'ул. Демо-Первомайская, 9',54.9600,83.0920,'Панель','Косметический','Демо-объект. [заполнить]','owner',now()-interval '12 days',now()-interval '30 days','["/images/hero.jpg"]');