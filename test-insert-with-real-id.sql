-- ТЕСТОВА ВСТАВКА з реальним inspector_id
-- Спочатку знайдемо ID вашого користувача

SELECT id, email, raw_user_meta_data->>'full_name' as name
FROM auth.users
WHERE email = 'failarm13@gmail.com';

-- Скопіюйте ID з результату вище і вставте нижче замість auth.uid()

INSERT INTO inspections (
  organization_id,
  employee_id,
  inspector_id,
  date,
  status,
  score,
  notes
) VALUES (
  '6e4d87c7-5fe4-488f-aa55-ec36ae7cd5b7',
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM auth.users WHERE email = 'failarm13@gmail.com'), -- Ваш реальний ID
  NOW(),
  'passed',
  95,
  'Тест після виправлення RLS'
) RETURNING id, score, status, inspector_id;

-- Якщо спрацювало - перевіримо що записалося:
SELECT 
  i.id,
  i.score,
  i.status,
  i.date,
  p.full_name as employee_name,
  u.email as inspector_email
FROM inspections i
LEFT JOIN profiles p ON i.employee_id = p.id
LEFT JOIN auth.users u ON i.inspector_id = u.id
ORDER BY i.created_at DESC
LIMIT 5;
