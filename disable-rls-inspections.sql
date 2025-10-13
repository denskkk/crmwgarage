-- ТИМЧАСОВО ВИМКНУТИ RLS для діагностики timeout
-- Це дозволить зберігати інспекції без перевірки прав

ALTER TABLE inspections DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items DISABLE ROW LEVEL SECURITY;

-- Перевірити статус
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('inspections', 'inspection_items');

-- ВАЖЛИВО: Після перевірки можна знову ввімкнути:
-- ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;
