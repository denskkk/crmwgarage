# W-Garage CRM System

Повноцінна CRM система для W-Garage з підтримкою організацій, ролей та управлінням клієнтами/компаніями/угодами на Supabase.

---

## ⚡ ШВИДКИЙ СТАРТ

### 🎯 ВСЕ ГОТОВО ДО ЗАПУСКУ!

📖 **Почніть тут**: [`START_HERE.md`](START_HERE.md) ⭐

**Що готово:**
- ✅ База даних з RLS та мультитенантністю
- ✅ Автоматична міграція всіх 33 співробітників W-Garage
- ✅ Збереження реальних email/паролів
- ✅ Призначення ролей (owner/inspector/employee)
- ✅ Frontend інтеграція з Supabase

**Запуск за 5 хвилин:**
1. Створіть проект на [supabase.com](https://supabase.com)
2. Скопіюйте credentials → `.env.local`
3. Виконайте `supabase-setup.sql` в SQL Editor
4. Запустіть `npm run migrate` — створить усіх користувачів! ✅
5. `npm run dev` — готово!

### 📚 Документація

| Файл | Опис |
|------|------|
| **[START_HERE.md](START_HERE.md)** | ⭐ Швидкий огляд (почніть тут) |
| **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** | Повна покрокова інструкція |
| **[COMMANDS.md](COMMANDS.md)** | Шпаргалка команд |
| **[SUMMARY.md](SUMMARY.md)** | Повна зведення проекту |
| **[docs/supabase-cheatsheet.md](docs/supabase-cheatsheet.md)** | Приклади CRUD запитів |

---

## 🔄 ВАЖЛИВО: Скидання старої бази даних LocalStorage

Якщо у вас залишилися дані зі старої системи (1000 згенерованих користувачів), **скиньте базу даних**:

### Варіант 1: Через спеціальну сторінку
1. Відкрийте `/reset-db.html` у браузері
2. Натисніть "СКИНУТИ БАЗУ ДАНИХ"
3. База оновиться до 33 реальних користувачів

### Варіант 2: Через консоль браузера
1. Натисніть `F12` → Console
2. Введіть:
```javascript
localStorage.clear();
location.reload();
```

---

## 🚀 Швидкий старт (LocalStorage — для демо)

Для запуску зі старою системою інспекцій (LocalStorage):

```bash
npm install
npm run dev
```

Відкрийте http://localhost:5173/

## 📦 Деплой

### GitHub Pages (налаштовано)
```bash
npm run build
git add .
git commit -m "Update build"
git push origin main
```

Сайт: https://denskkk.github.io/crmwgarage/

### Vercel
```bash
npm install -g vercel
vercel
```

## 🔐 Акаунти для входу (33 користувачі)

**Адміністратори (3):**
- admin@wgarage.com / admin123
- dandali.v@gmail.com / Boss2024
- viktoria.turuta@gmail.com / Boss2024

**Інспектори (5):**
- 7355797@gmail.com / Inspector2024 (Пустовой Ігор)
- juliamolodaya@ukr.net / Inspector2024 (Молода Юлія)
- gvv1510@gmail.com / Inspector2024 (Галянт Володимир)
- schukinvova@ukr.net / Inspector2024 (Щукін Володимир)
- ig.vir555@gmail.com / Inspector2024 (Вірченко Ігор)

**Співробітники (25):**
- Топливщики Т|1-3|: Emp2024_001 - Emp2024_011
- Менеджери: Emp2024_012 - Emp2024_014
- Склад: Emp2024_015 - Emp2024_016
- Автомеханіки: Emp2024_017 - Emp2024_020
- Бухгалтерія: Emp2024_021 - Emp2024_023
- Технічні спеціалісти: Emp2024_024 - Emp2024_025

Детальний список у файлі `RESET_DATABASE.md`

## 📊 База даних

### Supabase (CRM v2 — рекомендовано)
- **Організації**: багатотенантність, кожна організація ізольована
- **Ролі**: owner/admin/manager/inspector/sales/support/employee/viewer
- **Таблиці**: companies, contacts, deals, activities, pipelines, tags, files, audit_logs
- **RLS**: Row Level Security для автоматичного контролю доступу
- **Auth**: вбудована авторізація Supabase
- **Storage**: для завантаження файлів

**Схема**: `supabase-setup.sql`  
**Документація**: `docs/SUPABASE_SETUP.md`

### LocalStorage (стара система інспекцій)
- **Користувачів:** 33
- **Співробітників:** 30 (інспектори + співробітники)
- **Відділів:** 9
- **Зберігання:** LocalStorage (автоматично ініціалізується)

*Примітка: LocalStorage залишається для старої функціональності інспекцій, але для CRM використовуйте Supabase.*

## 🛠 Технології

- React 18
- TypeScript
- Tailwind CSS
- Vite
- LocalStorage API

## 📱 Особливості

- ✅ Адаптивний дизайн
- ✅ Оптимізована робота з великими даними
- ✅ Кешування в пам'яті
- ✅ Експорт даних у JSON
- ✅ Система ролей та прав доступу

## 🔧 Налаштування

База даних автоматично ініціалізується при першому запуску.
Дані зберігаються в LocalStorage браузера.

Для скидання бази даних відкрийте консоль браузера та виконайте:
```javascript
localStorage.clear()
```

## 📄 Ліцензія

MIT
