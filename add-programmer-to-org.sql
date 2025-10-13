-- ВИПРАВЛЕННЯ: Додати програміста до організації W-Garage

-- User ID з помилки: b146a7e0-adeb-4862-94ec-34b06156e055
-- Organization ID: 6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7

-- 1. Спочатку перевіримо чи користувач існує
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'failarm13@gmail.com';

-- 2. Перевіримо чи він вже в memberships
SELECT 
  m.*,
  au.email
FROM public.memberships m
JOIN auth.users au ON au.id = m.user_id
WHERE au.email = 'failarm13@gmail.com';

-- 3. Додати до організації (якщо немає)
INSERT INTO public.memberships (organization_id, user_id, role, is_active)
SELECT 
  '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'::uuid,
  id,
  'admin',
  true
FROM auth.users
WHERE email = 'failarm13@gmail.com'
ON CONFLICT (organization_id, user_id) DO UPDATE 
SET role = 'admin', is_active = true;

-- 4. Додати профіль (якщо немає)
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT 
  id,
  'Програміст W-Garage',
  ''
FROM auth.users
WHERE email = 'failarm13@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET full_name = 'Програміст W-Garage';

-- 5. ПЕРЕВІРКА РЕЗУЛЬТАТУ
SELECT 
  '✅ УСПІХ!' as status,
  au.id as user_id,
  au.email,
  p.full_name,
  m.role,
  m.is_active,
  o.name as organization,
  CASE 
    WHEN m.role = 'admin' THEN '✅ ADMIN - повні права'
    ELSE '⚠️ НЕ ADMIN'
  END as права
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
LEFT JOIN public.memberships m ON m.user_id = au.id
LEFT JOIN public.organizations o ON o.id = m.organization_id
WHERE au.email = 'failarm13@gmail.com';

-- 6. Показати ВСІ memberships для перевірки
SELECT 
  COUNT(*) as total_members,
  COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'inspector' THEN 1 END) as inspectors,
  COUNT(CASE WHEN role = 'employee' THEN 1 END) as employees
FROM public.memberships
WHERE organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';
