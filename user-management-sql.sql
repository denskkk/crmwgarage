-- УПРАВЛІННЯ КОРИСТУВАЧАМИ - SQL функції

-- 1. ЗМІНИТИ ПАРОЛЬ користувача (тільки для адміна)
-- ВАЖЛИВО: Пароль зберігається в auth.users, але треба використовувати Supabase Auth API
-- Через SQL можна тільки подивитися хеш, але не змінити безпечно

-- 2. ЗМІНИТИ ПОСАДУ
UPDATE profiles 
SET position = 'Нова Посада'
WHERE id = '[USER_ID]';

-- 3. ЗМІНИТИ ВІДДІЛ
UPDATE profiles 
SET department = 'Новий Відділ'
WHERE id = '[USER_ID]';

-- 4. ЗМІНИТИ РОЛЬ
UPDATE memberships
SET role = 'admin' -- або 'inspector', 'manager', 'employee', 'viewer'
WHERE user_id = '[USER_ID]'
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- 5. ВИДАЛИТИ КОРИСТУВАЧА
-- Спочатку видалити всі дані
DELETE FROM inspection_items 
WHERE inspection_id IN (
  SELECT id FROM inspections WHERE employee_id = '[USER_ID]' OR inspector_id = '[USER_ID]'
);

DELETE FROM inspections WHERE employee_id = '[USER_ID]' OR inspector_id = '[USER_ID]';
DELETE FROM memberships WHERE user_id = '[USER_ID]';
DELETE FROM profiles WHERE id = '[USER_ID]';

-- УВАГА: auth.users видаляти НЕ можна через SQL, тільки через Supabase Dashboard!

-- 6. ПОДИВИТИСЯ ВСІ ДАНІ КОРИСТУВАЧА
SELECT 
  u.id,
  u.email,
  u.created_at,
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
