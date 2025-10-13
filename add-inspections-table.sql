-- =====================================================
-- Додавання таблиць для інспекцій співробітників
-- =====================================================

-- Видалити старі таблиці якщо існують
DROP TABLE IF EXISTS public.inspection_items CASCADE;
DROP TABLE IF EXISTS public.inspections CASCADE;

-- =====================================================
-- Допоміжні функції для RLS
-- =====================================================

-- Функція для отримання ролі користувача в організації
CREATE OR REPLACE FUNCTION public.current_user_role(org_id UUID)
RETURNS TEXT AS $$
  SELECT role 
  FROM public.memberships 
  WHERE organization_id = org_id 
    AND user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Таблиця інспекцій
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'warning')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблиця пунктів чекліста для інспекції
CREATE TABLE public.inspection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_inspections_org ON public.inspections(organization_id);
CREATE INDEX IF NOT EXISTS idx_inspections_employee ON public.inspections(employee_id);
CREATE INDEX IF NOT EXISTS idx_inspections_date ON public.inspections(date);
CREATE INDEX IF NOT EXISTS idx_inspection_items_inspection ON public.inspection_items(inspection_id);

-- Тригер для оновлення updated_at
CREATE OR REPLACE FUNCTION update_inspections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inspections_updated_at
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_inspections_updated_at();

-- =====================================================
-- RLS Policies для inspections
-- =====================================================

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- Всі члени організації можуть бачити інспекції
CREATE POLICY inspection_select ON public.inspections
  FOR SELECT
  USING (public.is_org_member(organization_id));

-- Owner, Admin, Manager, Inspector можуть створювати інспекції
CREATE POLICY inspection_insert ON public.inspections
  FOR INSERT
  WITH CHECK (
    public.is_org_member(organization_id) AND
    public.current_user_role(organization_id) IN ('owner', 'admin', 'manager', 'inspector')
  );

-- Owner, Admin, Manager, Inspector можуть редагувати інспекції
CREATE POLICY inspection_update ON public.inspections
  FOR UPDATE
  USING (
    public.is_org_member(organization_id) AND
    public.current_user_role(organization_id) IN ('owner', 'admin', 'manager', 'inspector')
  );

-- Тільки Owner та Admin можуть видаляти інспекції
CREATE POLICY inspection_delete ON public.inspections
  FOR DELETE
  USING (
    public.is_org_member(organization_id) AND
    public.current_user_role(organization_id) IN ('owner', 'admin')
  );

-- =====================================================
-- RLS Policies для inspection_items
-- =====================================================

ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;

-- Всі члени організації можуть бачити пункти інспекції
CREATE POLICY inspection_items_select ON public.inspection_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections
      WHERE inspections.id = inspection_items.inspection_id
      AND public.is_org_member(inspections.organization_id)
    )
  );

-- Owner, Admin, Manager, Inspector можуть створювати пункти
CREATE POLICY inspection_items_insert ON public.inspection_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inspections
      WHERE inspections.id = inspection_items.inspection_id
      AND public.is_org_member(inspections.organization_id)
      AND public.current_user_role(inspections.organization_id) IN ('owner', 'admin', 'manager', 'inspector')
    )
  );

-- Owner, Admin, Manager, Inspector можуть редагувати пункти
CREATE POLICY inspection_items_update ON public.inspection_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections
      WHERE inspections.id = inspection_items.inspection_id
      AND public.is_org_member(inspections.organization_id)
      AND public.current_user_role(inspections.organization_id) IN ('owner', 'admin', 'manager', 'inspector')
    )
  );

-- Тільки Owner та Admin можуть видаляти пункти
CREATE POLICY inspection_items_delete ON public.inspection_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections
      WHERE inspections.id = inspection_items.inspection_id
      AND public.is_org_member(inspections.organization_id)
      AND public.current_user_role(inspections.organization_id) IN ('owner', 'admin')
    )
  );

-- =====================================================
-- Перевірка створених таблиць
-- =====================================================

SELECT 
  'inspections' as table_name,
  COUNT(*) as row_count
FROM public.inspections
UNION ALL
SELECT 
  'inspection_items' as table_name,
  COUNT(*) as row_count
FROM public.inspection_items;

COMMENT ON TABLE public.inspections IS 'Інспекції співробітників з правами доступу на основі ролей';
COMMENT ON TABLE public.inspection_items IS 'Пункти чекліста для кожної інспекції';
