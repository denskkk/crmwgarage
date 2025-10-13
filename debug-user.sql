-- Перевірка статусу користувача failarm13@gmail.com

SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  last_sign_in_at,
  created_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'failarm13@gmail.com';

-- Якщо користувач є, але не підтверджений - підтвердимо його
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'failarm13@gmail.com'
  AND email_confirmed_at IS NULL;

-- Перевірка чи він є в організації
SELECT 
  m.role,
  m.is_active,
  o.name as organization_name,
  p.full_name
FROM public.memberships m
JOIN public.organizations o ON o.id = m.organization_id
LEFT JOIN public.profiles p ON p.id = m.user_id
WHERE m.user_id = (SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com' LIMIT 1);
