ALTER TABLE public.leads ADD CONSTRAINT leads_type_values CHECK (type IN ('viewing','question','valuation','selection','mortgage','callback')) NOT VALID;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_values CHECK (status IN ('new','in_progress','viewing_booked','deal','lost')) NOT VALID;
ALTER TABLE public.leads VALIDATE CONSTRAINT leads_type_values;
ALTER TABLE public.leads VALIDATE CONSTRAINT leads_status_values;