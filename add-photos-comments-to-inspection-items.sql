-- СТВОРЕННЯ STORAGE ДЛЯ ФОТО ПОРУШЕНЬ

-- 1. Створити bucket (виконайте через Supabase Dashboard -> Storage)
-- Назва: inspection-photos
-- Public: true (щоб можна було завантажувати зображення)

-- 2. Додати колонки до inspection_items для зберігання коментарів та фото
ALTER TABLE inspection_items
ADD COLUMN IF NOT EXISTS comment TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 3. Перевірити структуру таблиці
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'inspection_items'
ORDER BY ordinal_position;

-- 4. Тестова вставка з коментарем та фото
INSERT INTO inspection_items (
  inspection_id,
  item_name,
  is_checked,
  comment,
  photo_url
) VALUES (
  (SELECT id FROM inspections LIMIT 1),
  'Тестовий пункт',
  false,
  'Це тестовий коментар про порушення',
  'https://example.com/photo.jpg'
) RETURNING *;
