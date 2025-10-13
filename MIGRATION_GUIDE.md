# 🎯 Готова інструкція: Запуск CRM з усіма користувачами

Ця інструкція автоматично створить всіх 33 співробітників W-Garage у Supabase з їхніми паролями та ролями.

---

## Крок 1: Створіть проект у Supabase

1. Перейдіть на [supabase.com](https://supabase.com) → **New Project**
2. Заповніть:
   - **Name**: `crmwgarage`
   - **Database Password**: створіть надійний пароль (збережіть!)
   - **Region**: Europe West (або найближчий)
3. Натисніть **Create new project**
4. Дочекайтеся статусу "Active" (~2 хвилини)

---

## Крок 2: Скопіюйте облікові дані

1. У проекті: **Settings** → **API**
2. Скопіюйте:
   - **Project URL** (наприклад: `https://abcdefgh.supabase.co`)
   - **anon public** key
   - **service_role** key ⚠️ (для міграції, тримайте в секреті!)

3. Створіть `.env.local` у корені проекту:

```powershell
Copy-Item .env.example .env.local
```

4. Відкрийте `.env.local` і вставте:

```
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-anon-key
SUPABASE_SERVICE_ROLE_KEY=ваш-service-role-key
```

---

## Крок 3: Застосуйте SQL-схему

1. У Supabase: **SQL Editor** → **New query**
2. Скопіюйте **весь файл** `supabase-setup.sql` з репозиторію
3. Вставте в SQL Editor → **Run** (або F5)

Ви побачите:
```
✅ База данных успешно создана!
✅ v2 multi-tenant CRM schema applied
```

---

## Крок 4: Запустіть міграцію користувачів (автоматично)

Цей крок автоматично створить:
- ✅ Організацію "W-Garage"
- ✅ 33 користувачів зі справжніми email/паролями
- ✅ Призначення ролей (owner/inspector/employee)
- ✅ Дефолтний pipeline продажів

Виконайте:

```powershell
npm install
npm run migrate
```

Ви побачите прогрес:

```
🚀 Starting W-Garage user migration to Supabase...

📦 Creating W-Garage organization...
✅ Organization created: abc-123-def

📊 Creating default sales pipeline...
✅ Pipeline and stages created

👥 Creating 33 users...

✅ Валерій Іванович (dandali.v@gmail.com) - роль: owner
✅ Вікторія Олександрівна (viktoria.turuta@gmail.com) - роль: owner
✅ Адміністратор (admin@wgarage.com) - роль: owner
✅ Пустовой Ігор (7355797@gmail.com) - роль: inspector
... (ще 29 користувачів)

============================================================
✅ Успішно створено: 33 користувачів
❌ Помилок: 0
🏢 Organization ID: abc-123-def-456
============================================================
```

**Збережіть Organization ID!**

---

## Крок 5: Додайте Organization ID у фронтенд

Відкрийте `.env.local` і додайте рядок:

```
VITE_ORGANIZATION_ID=abc-123-def-456
```

(вставте ваш справжній Organization ID зі скрипта)

---

## Крок 6: Запустіть додаток

```powershell
npm run dev
```

Відкрийте http://localhost:5173

---

## Крок 7: Увійдіть під будь-яким користувачем

Тепер усі 33 співробітники можуть увійти зі своїми облікових даних:

### Адміністратори (власники):
- **dandali.v@gmail.com** / Boss2024
- **viktoria.turuta@gmail.com** / Boss2024
- **admin@wgarage.com** / admin123

### Інспектори:
- **7355797@gmail.com** / Inspector2024 (Пустовой Ігор)
- **juliamolodaya@ukr.net** / Inspector2024 (Молода Юлія)
- **gvv1510@gmail.com** / Inspector2024 (Галянт Володимир)
- **schukinvova@ukr.net** / Inspector2024 (Щукін Володимир)
- **ig.vir555@gmail.com** / Inspector2024 (Вірченко Ігор)

### Співробітники:
- **konstantinborcenko@gmail.com** / Emp2024_001
- **serhii53@gmail.com** / Emp2024_002
- ... (всі інші зі списку в `RESET_DATABASE.md`)

---

## Перевірка в Supabase Dashboard

1. **Authentication** → **Users** — побачите всіх 33 користувачів
2. **Table Editor** → `organizations` — побачите "W-Garage"
3. **Table Editor** → `memberships` — побачите роль кожного користувача

---

## Що далі?

Тепер у вас повністю готова CRM:

✅ База даних з RLS  
✅ Усі користувачі з паролями  
✅ Організація та ролі  
✅ Pipeline продажів  
✅ Авторізація працює  

**Наступні кроки:**
1. Додайте компонент логіну (приклад: `src/App.supabase-example.tsx`)
2. Створіть сторінки для компаній/контактів/угод
3. Налаштуйте дашборд

**Документація:**
- Приклади CRUD: `docs/supabase-cheatsheet.md`
- Повна документація: `docs/SUPABASE_SETUP.md`

---

## Troubleshooting

### "Error: Invalid JWT" під час міграції
- Перевірте, що `SUPABASE_SERVICE_ROLE_KEY` правильний (Settings → API → service_role)

### "Email already registered"
- Користувач вже існує. Це нормально, якщо запускаєте скрипт повторно.
- Видаліть користувачів у Dashboard → Authentication → Users або пропустіть помилку

### "Permission denied"
- Перевірте, що SQL-схема застосована (крок 3)
- Перезапустіть проект у Supabase (Settings → General → Pause/Resume)

---

## 🎉 Готово!

Ваш CRM W-Garage повністю налаштований і готовий до роботи!
