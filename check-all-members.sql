-- Перевірка: показати ВСІХ членів організації W-Garage

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
ORDER BY m.created_at ASC;  -- Від старих до нових

-- Підрахунок по ролях
SELECT 
  role,
  COUNT(*) as кількість
FROM public.memberships
WHERE organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7'
GROUP BY role
ORDER BY role;

-- Загальна кількість учасників
SELECT COUNT(*) as "Всього учасників"
FROM public.memberships
WHERE organization_id = '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7';
