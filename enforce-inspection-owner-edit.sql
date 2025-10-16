-- Обмеження редагування перевірок: лише автор (inspector_id) може редагувати
-- Запускати в Supabase SQL editor після застосування таблиць та RLS

-- Увімкнути RLS (на випадок якщо вимкнуто)
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;

-- Видалити існуючі політики UPDATE, щоб уникнути конфліктів
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='inspections' AND cmd='UPDATE'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS inspection_update ON public.inspections';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update org inspections" ON public.inspections';
    EXECUTE 'DROP POLICY IF EXISTS update_inspections_policy ON public.inspections';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='inspection_items' AND cmd='UPDATE'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS inspection_items_update ON public.inspection_items';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update org inspection items" ON public.inspection_items';
    EXECUTE 'DROP POLICY IF EXISTS update_inspection_items_policy ON public.inspection_items';
  END IF;
END $$;

-- Політика: редагувати inspection може тільки автор (inspector_id)
CREATE POLICY inspection_update_owner_only ON public.inspections
  FOR UPDATE
  USING (
    auth.uid() = inspector_id
    AND public.is_org_member(organization_id)
  )
  WITH CHECK (
    auth.uid() = inspector_id
    AND public.is_org_member(organization_id)
  );

-- Політика: редагувати пункти може тільки автор відповідної перевірки
CREATE POLICY inspection_items_update_owner_only ON public.inspection_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_items.inspection_id
      AND i.inspector_id = auth.uid()
      AND public.is_org_member(i.organization_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_items.inspection_id
      AND i.inspector_id = auth.uid()
      AND public.is_org_member(i.organization_id)
    )
  );

-- Примітка: INSERT для inspections/items залишається за існуючими політиками (інспектори/адміни),
-- а DELETE краще лишити тільки для адміністраторів.
