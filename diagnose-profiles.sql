-- Перевірка скільки профілів є в базі
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Перевірка скільки з organization_id
SELECT 
  COUNT(*) as with_org,
  organization_id
FROM public.profiles
GROUP BY organization_id;

-- Показати всі профілі
SELECT 
  p.id,
  p.full_name,
  p.position,
  p.department,
  p.organization_id,
  m.role
FROM public.profiles p
LEFT JOIN public.memberships m ON p.id = m.user_id
ORDER BY p.full_name
LIMIT 50;

-- Перевірка auth.users
SELECT COUNT(*) as total_auth_users FROM auth.users;

-- Показати користувачів без профілів
SELECT 
  u.id,
  u.email,
  u.created_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ORDER BY u.email;
