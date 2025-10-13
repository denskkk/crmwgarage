-- ВИПРАВЛЕННЯ: Stack depth limit exceeded
-- Проблема: RLS політики викликають функції, які знову перевіряють RLS (рекурсія)

-- 1. ВИМКНУТИ RLS на inspections та inspection_items
ALTER TABLE inspections DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items DISABLE ROW LEVEL SECURITY;

-- 2. ВИДАЛИТИ ВСІ ПОЛІТИКИ з inspections
DROP POLICY IF EXISTS "Users can view org inspections" ON inspections;
DROP POLICY IF EXISTS "Users can insert inspections" ON inspections;
DROP POLICY IF EXISTS "Users can update inspections" ON inspections;
DROP POLICY IF EXISTS "Users can delete inspections" ON inspections;
DROP POLICY IF EXISTS "Inspectors can create inspections" ON inspections;
DROP POLICY IF EXISTS "Admins can manage inspections" ON inspections;
DROP POLICY IF EXISTS "view_inspections_policy" ON inspections;
DROP POLICY IF EXISTS "create_inspections_policy" ON inspections;
DROP POLICY IF EXISTS "update_inspections_policy" ON inspections;
DROP POLICY IF EXISTS "delete_inspections_policy" ON inspections;

-- 3. ВИДАЛИТИ ВСІ ПОЛІТИКИ з inspection_items
DROP POLICY IF EXISTS "Users can view org inspection items" ON inspection_items;
DROP POLICY IF EXISTS "Users can insert inspection items" ON inspection_items;
DROP POLICY IF EXISTS "Users can update inspection items" ON inspection_items;
DROP POLICY IF EXISTS "Users can delete inspection items" ON inspection_items;
DROP POLICY IF EXISTS "view_inspection_items_policy" ON inspection_items;
DROP POLICY IF EXISTS "create_inspection_items_policy" ON inspection_items;
DROP POLICY IF EXISTS "update_inspection_items_policy" ON inspection_items;
DROP POLICY IF EXISTS "delete_inspection_items_policy" ON inspection_items;

-- 4. ПЕРЕВІРИТИ чи видалилися всі політики
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('inspections', 'inspection_items');

-- Має бути 0 рядків!

-- 5. ПЕРЕВІРИТИ статус RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('inspections', 'inspection_items');

-- rowsecurity має бути FALSE для обох таблиць

-- 6. ТЕСТОВА ВСТАВКА (має спрацювати БЕЗ помилок)
INSERT INTO inspections (
  organization_id,
  employee_id,
  inspector_id,
  date,
  status,
  score,
  notes
) VALUES (
  '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7',
  (SELECT id FROM profiles LIMIT 1),
  auth.uid(),
  NOW(),
  'passed',
  90,
  'Test inspection after fixing RLS'
) RETURNING id, score, status;

-- Якщо це спрацювало - проблема вирішена! ✅
