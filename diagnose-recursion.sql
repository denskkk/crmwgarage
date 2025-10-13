-- ДІАГНОСТИКА функції current_user_role()
-- Ця функція може викликати рекурсію якщо вона сама перевіряє RLS на memberships

-- Подивитися код функції
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE proname = 'current_user_role';

-- Перевірити чи є RLS на memberships
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'memberships';

-- Якщо є - краще тимчасово вимкнути
ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;

-- Подивитися які є тригери на inspections
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('inspections', 'inspection_items');

-- Тимчасово видалити ВСІ тригери на inspections якщо є
-- DROP TRIGGER IF EXISTS [trigger_name] ON inspections;
