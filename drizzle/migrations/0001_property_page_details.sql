CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  photo_url text,
  phone text,
  whatsapp text,
  telegram text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.agents TO anon, authenticated;
GRANT ALL ON public.agents TO service_role;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents are public" ON public.agents FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.properties
  ADD COLUMN year_built int,
  ADD COLUMN deal_type text CHECK (deal_type IN ('free','alternative')),
  ADD COLUMN encumbrances text,
  ADD COLUMN availability_verified_at timestamptz,
  ADD COLUMN checks_done jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN checks_pending jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.properties
  ADD CONSTRAINT properties_agent_fk FOREIGN KEY (responsible_agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;

CREATE TABLE public.viewing_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 30),
  preferred_date date,
  preferred_time text CHECK (preferred_time IS NULL OR char_length(preferred_time) <= 50),
  consent boolean NOT NULL CHECK (consent),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.viewing_requests TO anon, authenticated;
GRANT ALL ON public.viewing_requests TO service_role;
ALTER TABLE public.viewing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a viewing" ON public.viewing_requests FOR INSERT TO anon, authenticated WITH CHECK (consent);