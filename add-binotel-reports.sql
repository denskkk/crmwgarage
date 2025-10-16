-- Структура для збереження щоденних звітів Binotel у CRM

CREATE TABLE IF NOT EXISTS public.binotel_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  payload JSONB NOT NULL, -- агреговані дані звіту (метрики, топ-5, тощо)
  html TEXT NOT NULL,     -- HTML-версія звіту (як на скріні)
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_binotel_reports_org_date
  ON public.binotel_reports(organization_id, report_date DESC);

ALTER TABLE public.binotel_reports ENABLE ROW LEVEL SECURITY;

-- Читати можуть всі учасники організації
CREATE POLICY binotel_reports_select ON public.binotel_reports
  FOR SELECT
  USING (public.is_org_member(organization_id));

-- Додавати можуть owner/admin/manager (або скрипт через service role)
CREATE POLICY binotel_reports_insert ON public.binotel_reports
  FOR INSERT
  WITH CHECK (
    public.is_org_member(organization_id)
    AND public.current_user_role(organization_id) IN ('owner','admin','manager')
  );

-- Оновлення/видалення тільки для owner/admin
CREATE POLICY binotel_reports_update ON public.binotel_reports
  FOR UPDATE
  USING (
    public.is_org_member(organization_id)
    AND public.current_user_role(organization_id) IN ('owner','admin')
  );

CREATE POLICY binotel_reports_delete ON public.binotel_reports
  FOR DELETE
  USING (
    public.is_org_member(organization_id)
    AND public.current_user_role(organization_id) IN ('owner','admin')
  );
