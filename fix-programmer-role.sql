-- Детальна перевірка ролі програміста

-- 1. Перевірити роль в memberships
SELECT 
  m.user_id,
  m.organization_id,
  m.role,
  m.is_active,
  m.created_at
FROM public.memberships m
WHERE m.user_id = (
  SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com'
);

-- 2. Перевірити користувача в auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  user_metadata
FROM auth.users
WHERE email = 'failarm13@gmail.com';

-- 3. Перевірити профіль
SELECT 
  id,
  full_name,
  avatar_url,
  created_at
FROM public.profiles
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com'
);

-- 4. Повна інформація (об'єднана)
SELECT 
  au.id as user_id,
  au.email,
  p.full_name,
  m.role,
  m.is_active,
  o.name as organization,
  o.id as org_id,
  CASE 
    WHEN m.role IN ('owner', 'admin') THEN '✅ ПОВНИЙ ДОСТУП'
    WHEN m.role IN ('manager', 'inspector') THEN '📝 РЕДАГУВАННЯ'
    ELSE '👁️ ПЕРЕГЛЯД'
  END as права
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.memberships m ON m.user_id = au.id
LEFT JOIN public.organizations o ON o.id = m.organization_id
WHERE au.email = 'failarm13@gmail.com';

-- 5. Якщо роль НЕ admin - примусово встановити
UPDATE public.memberships
SET role = 'admin', is_active = true
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com'
);

-- 6. Перевірити ще раз після UPDATE
SELECT 
  'РЕЗУЛЬТАТ:' as status,
  au.email,
  m.role,
  m.is_active,
  CASE 
    WHEN m.role = 'admin' THEN '✅ УСПІХ - роль admin встановлено!'
    ELSE '❌ ПОМИЛКА - роль не змінилася'
  END as результат
FROM public.memberships m
JOIN auth.users au ON au.id = m.user_id
WHERE au.email = 'failarm13@gmail.com';
