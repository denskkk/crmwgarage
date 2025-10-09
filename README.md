# W-Garage Inspection System

Система інспекції співробітників з базою даних на 1000+ користувачів.

## 🚀 Швидкий старт

```bash
npm install
npm run dev
```

## 📦 Деплой

### Vercel (рекомендовано)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Завантажте папку dist на Netlify
```

### GitHub Pages
```bash
npm run build
# Налаштуйте GitHub Pages для папки dist
```

## 🔐 Тестові акаунти

**Адміністратори:**
- admin@wgarage.com / admin123
- dandali.v@gmail.com / Boss2024
- viktoria.turuta@gmail.com / Boss2024

**Інспектори:**
- Будь-який email зі списку згенерованих інспекторів / Inspector2024

**Співробітники:**
- Згенеровано 1000 користувачів
- Формат паролю: Emp2024_XXXX (де XXXX - ID)

## 📊 База даних

- **Користувачів:** 1000+
- **Співробітників:** 1000+
- **Відділів:** 15
- **Зберігання:** LocalStorage (автоматично ініціалізується)

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
