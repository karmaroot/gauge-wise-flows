
-- Enums
CREATE TYPE public.institution_type AS ENUM ('public', 'private', 'autonomous');
CREATE TYPE public.indicator_type AS ENUM ('quantitative', 'qualitative');
CREATE TYPE public.reporting_frequency AS ENUM ('monthly', 'quarterly', 'annually');
CREATE TYPE public.period_status AS ENUM ('open', 'closed');
CREATE TYPE public.report_status AS ENUM ('draft', 'submitted', 'under_review', 'observed', 'responded', 'approved', 'rejected');
CREATE TYPE public.observation_status AS ENUM ('open', 'answered', 'closed');
CREATE TYPE public.app_role AS ENUM ('admin', 'reviewer', 'informant');

-- Institutions
CREATE TABLE public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.institution_type NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  institution_id UUID REFERENCES public.institutions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Indicators
CREATE TABLE public.indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'percentage',
  target_value NUMERIC NOT NULL DEFAULT 0,
  indicator_type public.indicator_type NOT NULL DEFAULT 'quantitative',
  reporting_frequency public.reporting_frequency NOT NULL DEFAULT 'quarterly',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;

-- Periods
CREATE TABLE public.periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status public.period_status NOT NULL DEFAULT 'open'
);
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;

-- Indicator Reports
CREATE TABLE public.indicator_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id UUID NOT NULL REFERENCES public.indicators(id),
  institution_id UUID NOT NULL REFERENCES public.institutions(id),
  period_id UUID NOT NULL REFERENCES public.periods(id),
  reported_value NUMERIC,
  comment TEXT,
  status public.report_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.indicator_reports ENABLE ROW LEVEL SECURITY;

-- Observations
CREATE TABLE public.observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.indicator_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  comment TEXT NOT NULL,
  status public.observation_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;

-- Observation Responses
CREATE TABLE public.observation_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id UUID NOT NULL REFERENCES public.observations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.observation_responses ENABLE ROW LEVEL SECURITY;

-- Attachments
CREATE TABLE public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.indicator_reports(id) ON DELETE CASCADE,
  observation_id UUID REFERENCES public.observations(id),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  -- Default role: informant
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'informant');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- Institutions: readable by all authenticated
CREATE POLICY "Authenticated can read institutions" ON public.institutions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage institutions" ON public.institutions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles: readable by all authenticated, users can update own
CREATE POLICY "Authenticated can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- User roles: readable by all authenticated, only admins can manage
CREATE POLICY "Authenticated can read roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indicators: readable by all authenticated, admins manage
CREATE POLICY "Authenticated can read indicators" ON public.indicators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage indicators" ON public.indicators FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Periods: readable by all authenticated, admins manage
CREATE POLICY "Authenticated can read periods" ON public.periods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage periods" ON public.periods FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indicator Reports: readable by all authenticated, informants create/update own, reviewers/admins can update
CREATE POLICY "Authenticated can read reports" ON public.indicator_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Informants can insert reports" ON public.indicator_reports FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Creators can update own reports" ON public.indicator_reports FOR UPDATE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin'));

-- Observations: readable by all authenticated, reviewers create
CREATE POLICY "Authenticated can read observations" ON public.observations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Reviewers can create observations" ON public.observations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Reviewers can update observations" ON public.observations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin'));

-- Observation Responses: readable by all authenticated, any authenticated can respond
CREATE POLICY "Authenticated can read responses" ON public.observation_responses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create responses" ON public.observation_responses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Attachments: readable by all authenticated, users can upload
CREATE POLICY "Authenticated can read attachments" ON public.attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can upload attachments" ON public.attachments FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid());

-- Audit logs: only admins can read
CREATE POLICY "Admins can read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Enable realtime for reports
ALTER PUBLICATION supabase_realtime ADD TABLE public.indicator_reports;
