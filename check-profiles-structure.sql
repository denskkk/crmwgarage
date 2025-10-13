-- Перевірка структури таблиці profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- Перевірка даних
SELECT * FROM public.profiles LIMIT 5;
