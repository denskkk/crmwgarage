-- Зміна ролі користувача в W-Garage CRM

-- 1. Змінити роль для конкретного email
UPDATE public.memberships
SET role = 'admin'  -- Можливі значення: 'owner', 'admin', 'manager', 'inspector', 'sales', 'support', 'employee', 'viewer'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com'
)
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- 2. Перевірити результат
SELECT 
  au.email,
  p.full_name,
  m.role,
  m.is_active,
  o.name as organization
FROM public.memberships m
JOIN auth.users au ON au.id = m.user_id
JOIN public.profiles p ON p.id = m.user_id
JOIN public.organizations o ON o.id = m.organization_id
WHERE au.email = 'failarm13@gmail.com';

-- =============================================
-- Швидкі команди для зміни ролі:
-- =============================================

-- Зробити owner (максимальні права)
UPDATE public.memberships
SET role = 'owner'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- Зробити admin (повні права на редагування)
UPDATE public.memberships
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- Зробити manager (може керувати даними)
UPDATE public.memberships
SET role = 'manager'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- Зробити inspector (може проводити інспекції)
UPDATE public.memberships
SET role = 'inspector'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- Зробити employee (базовий доступ)
UPDATE public.memberships
SET role = 'employee'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- =============================================
-- Масова зміна ролей
-- =============================================

-- Зробити всіх інспекторів адмінами
UPDATE public.memberships
SET role = 'admin'
WHERE role = 'inspector'
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- Деактивувати користувача
UPDATE public.memberships
SET is_active = false
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- Активувати користувача назад
UPDATE public.memberships
SET is_active = true
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';

-- =============================================
-- Перегляд всіх ролей
-- =============================================

-- Показати всіх користувачів з їх ролями
SELECT 
  au.email,
  p.full_name,
  m.role,
  m.is_active,
  m.created_at,
  CASE 
    WHEN m.role IN ('owner', 'admin') THEN '✅ Повний доступ'
    WHEN m.role IN ('manager', 'inspector') THEN '📝 Може редагувати'
    ELSE '👁️ Тільки перегляд'
  END as rights
FROM public.memberships m
JOIN auth.users au ON au.id = m.user_id
JOIN public.profiles p ON p.id = m.user_id
WHERE m.organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'
ORDER BY 
  CASE m.role
    WHEN 'owner' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'manager' THEN 3
    WHEN 'inspector' THEN 4
    WHEN 'sales' THEN 5
    WHEN 'support' THEN 6
    WHEN 'employee' THEN 7
    WHEN 'viewer' THEN 8
  END,
  au.email;

-- =============================================
-- Статистика по ролях
-- =============================================

SELECT 
  role,
  COUNT(*) as кількість,
  CASE 
    WHEN role IN ('owner', 'admin') THEN '✅ Повний доступ'
    WHEN role IN ('manager', 'inspector') THEN '📝 Може редагувати'
    ELSE '👁️ Тільки перегляд'
  END as права
FROM public.memberships
WHERE organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'
GROUP BY role
ORDER BY COUNT(*) DESC;
