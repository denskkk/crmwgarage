-- НАДАТИ ПРАВА АДМІНІСТРАТОРА для dandali.v@gmail.com

-- 1. Знайти ID користувача
SELECT id, email FROM auth.users WHERE email = 'dandali.v@gmail.com';

-- 2. Перевірити чи є запис в memberships
SELECT * FROM memberships WHERE user_id = (SELECT id FROM auth.users WHERE email = 'dandali.v@gmail.com');

-- 3. Якщо НЕ має - додати
INSERT INTO memberships (user_id, organization_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'dandali.v@gmail.com'),
  '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7', -- W-Garage
  'admin'
)
ON CONFLICT (user_id, organization_id) 
DO UPDATE SET role = 'admin';

-- 4. Перевірити що змінилося
SELECT 
  u.email,
  m.role,
  o.name as organization
FROM auth.users u
JOIN memberships m ON u.id = m.user_id
JOIN organizations o ON m.organization_id = o.id
WHERE u.email = 'dandali.v@gmail.com';

-- Має бути: email = dandali.v@gmail.com, role = admin
