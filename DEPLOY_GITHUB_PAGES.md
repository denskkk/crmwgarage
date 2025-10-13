# 🚀 Деплой на GitHub Pages

## Як це працює:

```
┌─────────────────┐
│  GitHub Pages   │  ← Статичний frontend (HTML/CSS/JS)
│  (docs/)        │
└────────┬────────┘
         │
         │ API запити (з ключами в config.ts)
         ↓
┌─────────────────┐
│   Supabase      │  ← База даних (PostgreSQL + Auth)
│  joxayhsn...    │
└─────────────────┘
```

## ✅ Що вже налаштовано:

1. **База даних Supabase** - працює на https://joxayhsnchiijuhxvfli.supabase.co
2. **33 користувачі** - всі мігровані та готові до входу
3. **Ключі доступу** - вбудовані в `src/config.ts` (anon key безпечний для фронтенду)
4. **Білд** - йде в папку `docs/` для GitHub Pages

## 📝 Інструкція:

### 1. Commit та Push:

```bash
git add .
git commit -m "🚀 Deploy CRM with Supabase integration"
git push origin main
```

### 2. Налаштуйте GitHub Pages:

1. Відкрийте репозиторій на GitHub: https://github.com/denskkk/crmwgarage
2. Перейдіть до **Settings** → **Pages**
3. У розділі **Source** виберіть:
   - Branch: `main`
   - Folder: `/docs`
4. Натисніть **Save**
5. Зачекайте 1-2 хвилини

### 3. Ваш сайт буде доступний:

**https://denskkk.github.io/crmwgarage/**

## 🔐 Безпека:

### ✅ Безпечно (в Git):
- `VITE_SUPABASE_URL` - публічний URL
- `VITE_SUPABASE_ANON_KEY` - публічний ключ (захищений RLS політиками)
- `VITE_ORGANIZATION_ID` - UUID організації

### ❌ НЕ комітити:
- `SUPABASE_SERVICE_ROLE_KEY` - адмін ключ (вже в `.gitignore`)

**Anon Key безпечний**, тому що:
- Всі дані захищені Row Level Security (RLS)
- Користувачі бачать тільки свою організацію
- Права доступу контролюються ролями

## 🧪 Тестування:

Після деплою спробуйте увійти:

**Owner:**
- Email: `dandali.v@gmail.com`
- Пароль: `admin123`

**Inspector:**
- Email: `7355797@gmail.com`
- Пароль: `pustovoi123`

## 🔄 Оновлення:

Після змін у коді:

```bash
npm run build    # Білд в docs/
git add docs/
git commit -m "Update: опис змін"
git push
```

GitHub Pages автоматично оновиться за 1-2 хвилини.

## 📊 Моніторинг Supabase:

- **Users**: https://supabase.com/dashboard/project/joxayhsnchiijuhxvfli/auth/users
- **Tables**: https://supabase.com/dashboard/project/joxayhsnchiijuhxvfli/editor
- **Logs**: https://supabase.com/dashboard/project/joxayhsnchiijuhxvfli/logs/explorer

## 🆘 Troubleshooting:

**Проблема:** Не працює авторизація
- Перевірте консоль браузера (F12)
- Переконайтеся що Supabase Auth включений
- Перевірте URL та ключі в `src/config.ts`

**Проблема:** Не бачу даних
- Перевірте що користувач є членом організації
- Перегляньте RLS політики в Supabase
- Перевірте `ORGANIZATION_ID` в конфігурації

**Проблема:** GitHub Pages показує 404
- Переконайтеся що `/docs` вибрано як source
- Перевірте що `index.html` є в `docs/`
- Зачекайте 2-3 хвилини після push

## 🎯 Готово!

Після `git push` ваш CRM буде доступний онлайн з повною інтеграцією Supabase! 🎉
