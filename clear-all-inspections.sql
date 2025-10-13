-- ОЧИСТИТИ ВСІ СТАРІ ПЕРЕВІРКИ (якщо потрібно почати з нуля)

-- 1. Подивитися скільки перевірок є
SELECT 
  COUNT(*) as total_inspections,
  COUNT(DISTINCT employee_id) as employees_with_inspections
FROM inspections;

-- 2. Подивитися деталі останніх 10 перевірок
SELECT 
  i.id,
  i.date,
  i.score,
  p.full_name as employee_name,
  COUNT(ii.id) as items_count
FROM inspections i
LEFT JOIN profiles p ON i.employee_id = p.id
LEFT JOIN inspection_items ii ON i.id = ii.inspection_id
GROUP BY i.id, i.date, i.score, p.full_name
ORDER BY i.date DESC
LIMIT 10;

-- 3. ВИДАЛИТИ ВСІ ПЕРЕВІРКИ (якщо хочете почати з нуля)
-- УВАГА: Це видалить ВСІ дані!
-- DELETE FROM inspection_items;
-- DELETE FROM inspections;

-- 4. Перевірити що таблиці порожні
-- SELECT COUNT(*) FROM inspections;
-- SELECT COUNT(*) FROM inspection_items;
