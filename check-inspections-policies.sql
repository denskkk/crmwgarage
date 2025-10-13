-- Перевірити чи є RLS на таблиці inspections
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('inspections', 'inspection_items');

-- Подивитися всі політики на inspections
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('inspections', 'inspection_items');

-- Перевірити чи працює функція current_user_role()
SELECT current_user_role();

-- Спробувати вставити тестову інспекцію
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
  (SELECT id FROM profiles LIMIT 1), -- Перший співробітник
  auth.uid(), -- Поточний користувач
  NOW(),
  'passed',
  85,
  'Test inspection'
) RETURNING id;

-- Якщо помилка - тимчасово вимкнути RLS для тестування
-- ALTER TABLE inspections DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE inspection_items DISABLE ROW LEVEL SECURITY;
