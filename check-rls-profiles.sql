-- Перевірка RLS політик для profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Вимкнути RLS для profiles (тимчасово для тестування)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Перевірити чи RLS увімкнений
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'profiles';
