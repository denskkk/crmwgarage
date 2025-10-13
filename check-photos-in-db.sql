-- ДІАГНОСТИКА: Перевірити чи зберігаються фото

-- 1. Подивитися останні inspection_items з фото
SELECT 
  ii.id,
  ii.item_name,
  ii.is_checked,
  LENGTH(ii.comment) as comment_length,
  LENGTH(ii.photo_url) as photo_length,
  SUBSTRING(ii.photo_url, 1, 50) as photo_preview
FROM inspection_items ii
JOIN inspections i ON ii.inspection_id = i.id
ORDER BY i.created_at DESC
LIMIT 10;

-- 2. Порахувати скільки items мають фото
SELECT 
  COUNT(*) as total_items,
  COUNT(comment) as items_with_comment,
  COUNT(photo_url) as items_with_photo
FROM inspection_items;

-- 3. Показати повну інспекцію з фото
SELECT 
  i.id as inspection_id,
  i.score,
  i.date,
  ii.item_name,
  ii.comment,
  ii.photo_url
FROM inspections i
JOIN inspection_items ii ON i.id = ii.inspection_id
WHERE ii.photo_url IS NOT NULL
ORDER BY i.created_at DESC
LIMIT 5;
