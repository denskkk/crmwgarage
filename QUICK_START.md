# ⚡ Швидкий старт з Supabase

## 1️⃣ Створіть проект на Supabase

1. Перейдіть на [supabase.com](https://supabase.com) → **New Project**
2. Заповніть: назва, пароль БД, регіон → **Create**
3. Дочекайтеся "Active" статусу (~2 хв)

## 2️⃣ Скопіюйте credentials

1. **Settings** → **API** → скопіюйте:
   - Project URL
   - anon public key

2. Створіть `.env.local` у корені проекту:

```powershell
Copy-Item .env.example .env.local
```

3. Вставте в `.env.local`:

```
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-anon-key
```

## 3️⃣ Застосуйте SQL-схему

1. У Supabase: **SQL Editor** → **New query**
2. Скопіюйте весь `supabase-setup.sql` з цього репо → вставте → **Run**
3. Маєте побачити: ✅ База даних успішно створена!

## 4️⃣ Створіть користувача

У Supabase: **Authentication** → **Users** → **Add user**
- Email: ваш email
- Password: створіть пароль
- **Create user** → **скопіюйте UUID**

## 5️⃣ Створіть організацію

У **SQL Editor**:

```sql
select public.seed_organization(null, 'W-Garage');
```

Скопіюйте повернутий UUID організації.

## 6️⃣ Запустіть додаток

```powershell
npm install
npm run dev
```

Відкрийте http://localhost:5173

---

**📖 Повна інструкція**: `docs/SUPABASE_SETUP.md`

**🔧 Приклади CRUD та Auth**: `src/App.supabase-example.tsx`
