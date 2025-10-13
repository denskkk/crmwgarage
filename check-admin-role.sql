-- Перевірка ролі для dandali.v@gmail.com

-- 1. Перевірити чи користувач існує в auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'dandali.v@gmail.com';

-- 2. Перевірити membership і роль
SELECT 
  m.user_id,
  m.organization_id,
  m.role,
  o.name as organization_name
FROM memberships m
LEFT JOIN organizations o ON m.organization_id = o.id
WHERE m.user_id = (SELECT id FROM auth.users WHERE email = 'dandali.v@gmail.com');

-- 3. Повна інформація про користувача
SELECT 
  u.email,
  p.full_name,
  p.position,
  p.department,
  m.role,
  o.name as organization
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN memberships m ON u.id = m.user_id
LEFT JOIN organizations o ON m.organization_id = o.id
WHERE u.email = 'dandali.v@gmail.com';

-- Має показати:
-- email: dandali.v@gmail.com
-- role: admin
-- organization: W-Garage
