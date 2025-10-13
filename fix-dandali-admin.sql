-- ЗНАЙТИ ПРАВИЛЬНИЙ ID ОРГАНІЗАЦІЇ

-- 1. Подивитися всі організації
SELECT id, name, created_at FROM organizations;

-- 2. Якщо W-Garage не існує - створити
INSERT INTO organizations (id, name)
VALUES ('6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7', 'W-Garage')
ON CONFLICT (id) DO NOTHING;

-- 3. Перевірити що існує
SELECT * FROM organizations WHERE name = 'W-Garage';

-- 4. ТЕПЕР додати dandali.v як адміна
INSERT INTO memberships (user_id, organization_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'dandali.v@gmail.com'),
  '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7',
  'admin'
)
ON CONFLICT (user_id, organization_id) 
DO UPDATE SET role = 'admin';

-- 5. Перевірити результат
SELECT 
  u.email,
  m.role,
  o.name as organization
FROM auth.users u
JOIN memberships m ON u.id = m.user_id
JOIN organizations o ON m.organization_id = o.id
WHERE u.email IN ('dandali.v@gmail.com', 'failarm13@gmail.com');
