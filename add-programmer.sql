-- Скрипт для додавання програміста до W-Garage
-- Виконайте в Supabase SQL Editor після створення користувача

-- 1. Спочатку знайдемо ID новоствореного користувача
-- Замініть EMAIL на той, що ви використали при створенні
DO $$
DECLARE
  user_uuid uuid;
  org_uuid uuid := '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'; -- ПРАВИЛЬНИЙ ID організації W-Garage
BEGIN
  -- Знайти ID користувача за email
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'failarm13@gmail.com'
  LIMIT 1;

  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Користувача з email failarm13@gmail.com не знайдено. Спочатку створіть його через Authentication → Add user';
  END IF;

  -- Додати профіль (якщо не створився автоматично)
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (user_uuid, 'Програміст W-Garage', '')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name;

  -- Додати до організації з роллю admin (може все налаштовувати)
  INSERT INTO public.memberships (organization_id, user_id, role, is_active)
  VALUES (org_uuid, user_uuid, 'admin', true)
  ON CONFLICT (organization_id, user_id) DO UPDATE SET
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

  RAISE NOTICE 'Успішно! Програміст доданий до організації W-Garage з роллю admin';
END $$;

-- 2. Перевірка: показати всіх членів організації
SELECT 
  p.full_name,
  au.email,
  m.role,
  m.is_active,
  m.created_at
FROM public.memberships m
JOIN public.profiles p ON p.id = m.user_id
JOIN auth.users au ON au.id = m.user_id
WHERE m.organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'
ORDER BY m.created_at DESC
LIMIT 5;
