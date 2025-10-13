-- Скинути пароль для failarm13@gmail.com на programmer123

-- ВАЖЛИВО: Supabase зберігає паролі у хешованому вигляді
-- Потрібно використовувати функцію crypt() для хешування

-- Оновити пароль
UPDATE auth.users
SET 
  encrypted_password = crypt('programmer123', gen_salt('bf')),
  updated_at = now()
WHERE email = 'failarm13@gmail.com';

-- Перевірити що користувач існує
SELECT 
  email,
  email_confirmed_at,
  created_at,
  'Пароль змінено на: programmer123' as status
FROM auth.users
WHERE email = 'failarm13@gmail.com';
