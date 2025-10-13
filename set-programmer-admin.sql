-- Швидка зміна ролі програміста на ADMIN

-- Змінити роль програміста на admin (якщо у вас інша роль)
UPDATE public.memberships
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com'
)
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- Перевірити
SELECT 
  au.email,
  p.full_name,
  m.role,
  CASE 
    WHEN m.role IN ('owner', 'admin') THEN '✅ ПОВНИЙ ДОСТУП - може все редагувати'
    WHEN m.role IN ('manager', 'inspector') THEN '📝 Може редагувати'
    ELSE '👁️ Тільки перегляд'
  END as права
FROM public.memberships m
JOIN auth.users au ON au.id = m.user_id
LEFT JOIN public.profiles p ON p.id = m.user_id
WHERE au.email = 'failarm13@gmail.com';
