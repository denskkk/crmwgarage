-- ОБОВ'ЯЗКОВО ВИКОНАТИ: Додати колонки для коментарів та фото

ALTER TABLE inspection_items
ADD COLUMN IF NOT EXISTS comment TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Перевірити що додалося
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'inspection_items'
ORDER BY ordinal_position;

-- Має бути приблизно так:
-- id               | uuid      | NO  | gen_random_uuid()
-- inspection_id    | uuid      | NO  | NULL
-- item_name        | text      | NO  | NULL
-- is_checked       | boolean   | NO  | NULL
-- created_at       | timestamp | YES | now()
-- comment          | text      | YES | NULL    <-- НОВА КОЛОНКА
-- photo_url        | text      | YES | NULL    <-- НОВА КОЛОНКА
