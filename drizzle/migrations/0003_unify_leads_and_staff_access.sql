ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'question', ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id), ADD COLUMN IF NOT EXISTS message text, ADD COLUMN IF NOT EXISTS budget numeric, ADD COLUMN IF NOT EXISTS rooms text, ADD COLUMN IF NOT EXISTS district text, ADD COLUMN IF NOT EXISTS source_page text, ADD COLUMN IF NOT EXISTS utm_source text, ADD COLUMN IF NOT EXISTS utm_medium text, ADD COLUMN IF NOT EXISTS utm_campaign text, ADD COLUMN IF NOT EXISTS utm_term text, ADD COLUMN IF NOT EXISTS referrer text, ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS consent_at timestamptz, ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new', ADD COLUMN IF NOT EXISTS assigned_to uuid, ADD COLUMN IF NOT EXISTS notes text;
UPDATE public.leads SET type = CASE kind WHEN 'valuation' THEN 'valuation' WHEN 'complex_selection' THEN 'selection' WHEN 'rent' THEN 'selection' ELSE 'question' END, consent_given=consent, consent_at=CASE WHEN consent THEN created_at ELSE NULL END, message=details->>'comment';
CREATE TABLE IF NOT EXISTS public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,role text NOT NULL CHECK(role IN ('staff','admin')),UNIQUE(user_id,role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own staff role" ON public.user_roles FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE OR REPLACE FUNCTION public.is_lead_staff() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=auth.uid() AND role IN ('staff','admin')) $$;
REVOKE ALL ON FUNCTION public.is_lead_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_lead_staff() TO authenticated;
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
REVOKE ALL ON public.leads FROM anon,authenticated;
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read leads" ON public.leads FOR SELECT TO authenticated USING(public.is_lead_staff());
CREATE INDEX IF NOT EXISTS leads_phone_created_idx ON public.leads(phone,created_at);
CREATE OR REPLACE FUNCTION public.validate_lead_insert() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
IF NEW.phone !~ '^\+7[3489][0-9]{9}$' THEN RAISE EXCEPTION 'INVALID_PHONE'; END IF;
IF NEW.consent_given IS DISTINCT FROM true THEN RAISE EXCEPTION 'CONSENT_REQUIRED'; END IF;
IF NEW.type NOT IN ('viewing','question','valuation','selection','mortgage','callback') THEN RAISE EXCEPTION 'INVALID_TYPE'; END IF;
IF NEW.status <> 'new' OR NEW.assigned_to IS NOT NULL OR NEW.notes IS NOT NULL THEN RAISE EXCEPTION 'INVALID_INITIAL_STATE'; END IF;
IF length(NEW.name)>100 OR length(NEW.message)>3000 OR length(NEW.rooms)>50 OR length(NEW.district)>100 OR length(NEW.source_page)>500 OR length(NEW.referrer)>500 OR length(NEW.utm_source)>200 OR length(NEW.utm_medium)>200 OR length(NEW.utm_campaign)>200 OR length(NEW.utm_term)>200 OR NEW.budget<0 OR NEW.budget>100000000000 THEN RAISE EXCEPTION 'INVALID_INPUT'; END IF;
NEW.consent:=true; NEW.consent_at:=now(); NEW.created_at:=now(); RETURN NEW;
END $$;
CREATE TRIGGER validate_new_lead BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.validate_lead_insert();
CREATE OR REPLACE FUNCTION public.create_lead(payload jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE result uuid; normalized text; BEGIN
IF COALESCE(payload->>'website','') <> '' THEN RAISE EXCEPTION 'SPAM_BLOCKED'; END IF;
IF octet_length(payload::text)>18000 THEN RAISE EXCEPTION 'INVALID_INPUT'; END IF;
normalized:=payload->>'phone';
PERFORM pg_advisory_xact_lock(hashtextextended(normalized,0));
IF (SELECT count(*) FROM public.leads WHERE phone=normalized AND created_at>now()-interval '15 minutes')>=3 THEN RAISE EXCEPTION 'RATE_LIMIT'; END IF;
INSERT INTO public.leads(kind,type,name,phone,consent,consent_given,property_id,message,budget,rooms,district,source_page,utm_source,utm_medium,utm_campaign,utm_term,referrer,details)
VALUES(COALESCE(payload->>'kind','general'),payload->>'type',NULLIF(payload->>'name',''),normalized,true,(payload->>'consent')::boolean,NULLIF(payload->>'property_id','')::uuid,payload->>'message',NULLIF(payload->>'budget','')::numeric,payload->>'rooms',payload->>'district',payload->>'source_page',payload->>'utm_source',payload->>'utm_medium',payload->>'utm_campaign',payload->>'utm_term',payload->>'referrer',COALESCE(payload->'details','{}'::jsonb)) RETURNING id INTO result;
RETURN result; END $$;
REVOKE ALL ON FUNCTION public.create_lead(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_lead(jsonb) TO anon,authenticated,service_role;
COMMENT ON COLUMN public.leads.kind IS 'Legacy form category retained for compatibility; type is the canonical lead category.';
COMMENT ON COLUMN public.leads.consent IS 'Legacy consent mirror retained for compatibility; consent_given and consent_at are canonical.';