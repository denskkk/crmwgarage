-- Дозволити інспектору видаляти СВОЇ інспекції (щоб очищати попередні перед створенням нової)

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;

-- Видалити можливі конфліктні політики DELETE
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='inspections' AND cmd='DELETE'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS inspection_delete ON public.inspections';
    EXECUTE 'DROP POLICY IF EXISTS delete_inspections_policy ON public.inspections';
  END IF;
END $$;

-- Політика: видаляти inspection може автор (inspector_id) або адміністратор/власник
CREATE POLICY inspection_delete_owner_or_admin ON public.inspections
  FOR DELETE
  USING (
    (
      auth.uid() = inspector_id
    )
    OR (
      public.is_org_member(organization_id)
      AND public.current_user_role(organization_id) IN ('owner','admin')
    )
  );
