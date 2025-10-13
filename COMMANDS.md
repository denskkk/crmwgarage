# ⚡ Команди для швидкого запуску CRM

## 1️⃣ Перший запуск (з нуля)

```powershell
# Клонувати репо (якщо ще не зроблено)
git clone https://github.com/denskkk/crmwgarage.git
cd crmwgarage

# Встановити залежності
npm install

# Створити .env.local
Copy-Item .env.example .env.local

# Відкрити .env.local і вставити credentials з Supabase
notepad .env.local
```

## 2️⃣ Налаштування Supabase

1. Створити проект на https://supabase.com
2. Settings → API → скопіювати:
   - Project URL
   - anon public key
   - service_role key
3. SQL Editor → вставити весь `supabase-setup.sql` → Run

## 3️⃣ Міграція користувачів (автоматично)

```powershell
# Створити організацію + всіх 33 користувачів
npm run migrate
```

Скопіюйте Organization ID з виводу!

## 4️⃣ Додати Organization ID

```powershell
# Відкрити .env.local і додати рядок:
notepad .env.local
# VITE_ORGANIZATION_ID=<ваш-org-id>
```

## 5️⃣ Запуск

```powershell
# Dev режим
npm run dev

# Білд для продакшена
npm run build

# Попередній перегляд білда
npm run preview
```

---

## Корисні команди

### Перевірити build
```powershell
npm run build
```

### Очистити node_modules (якщо проблеми)
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Оновити Supabase клієнт
```powershell
npm update @supabase/supabase-js
```

### Перезапустити міграцію (якщо помилка)
```powershell
npm run migrate
```

---

## Логіни для тесту

### Адміністратори:
- admin@wgarage.com / admin123
- dandali.v@gmail.com / Boss2024

### Інспектори:
- 7355797@gmail.com / Inspector2024

### Співробітники:
- konstantinborcenko@gmail.com / Emp2024_001

Всі 33 користувачі: `RESET_DATABASE.md`

---

## Структура проекту

```
crmwgarage/
├── src/
│   ├── supabaseClient.ts      # Клієнт Supabase
│   ├── components/
│   │   └── LoginForm.tsx      # Приклад логіна
│   └── App.supabase-example.tsx  # Приклад Auth
├── scripts/
│   └── migrate-users.ts       # Скрипт міграції
├── docs/
│   ├── SUPABASE_SETUP.md      # Повна документація
│   ├── supabase-cheatsheet.md # Приклади CRUD
│   └── crm-schema.md          # Опис схеми
├── supabase-setup.sql         # SQL схема
├── MIGRATION_GUIDE.md         # Готова інструкція
└── .env.local                 # Credentials (не в Git!)
```

---

## Troubleshooting

### Помилка "Cannot find module"
```powershell
npm install
```

### "Invalid JWT" під час міграції
Перевірте SUPABASE_SERVICE_ROLE_KEY в .env.local

### "Permission denied" в Supabase
Перевірте, що SQL-схема застосована (SQL Editor)

### TypeScript помилки
```powershell
npm run build
```

---

## 🎯 Що далі?

1. ✅ База даних готова
2. ✅ Користувачі створені
3. ✅ Авторізація працює

**Наступні кроки:**
- Додати UI для компаній/контактів/угод
- Інтегрувати LoginForm у App.tsx
- Створити дашборд з аналітикою
- Налаштувати Kanban для deals

**Документація:**
- `docs/supabase-cheatsheet.md` — приклади запитів
- `docs/SUPABASE_SETUP.md` — повна документація
- `MIGRATION_GUIDE.md` — готова інструкція
