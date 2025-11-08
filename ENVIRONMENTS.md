# 🔧 Робота з Dev та Prod середовищами

Цей проект налаштований для роботи з **окремими середовищами** для development та production, щоб вони не заважали одне одному.

---

## 📋 Структура середовищ

### **Development (Локальна розробка)**
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:1337`
- **Database**: SQLite (локальна база `.tmp/data.db`)
- **CORS**: дозволено `localhost:3000`, `localhost:3001`

### **Production (Vercel + Railway)**
- **Frontend**: `https://webbie-tau.vercel.app`
- **Backend**: `https://webstudio-landingpage-production.up.railway.app`
- **Database**: PostgreSQL (Railway)
- **CORS**: дозволено production домени

---

## 🚀 Як запустити Development

### 1. Backend (Strapi)

```bash
cd backend

# Встанови залежності (якщо ще не встановлено)
npm install

# Створи .env файл (якщо ще не створено)
# Скопіюй backend/.env.example як .env

# Запусти Strapi в dev режимі
npm run dev
# або
npm run develop
```

**Що відбувається:**
- ✅ Автоматично використовується **SQLite** база даних
- ✅ Сервер запускається на `http://localhost:1337`
- ✅ CORS дозволяє запити з `localhost:3000`
- ✅ База даних зберігається в `backend/.tmp/data.db`

### 2. Frontend (Next.js)

```bash
cd frontend

# Встанови залежності (якщо ще не встановлено)
yarn install
# або
npm install

# Створи .env.local файл (якщо ще не створено)
# Скопіюй frontend/.env.example як .env.local

# Запусти Next.js в dev режимі
yarn dev
# або
npm run dev
```

**Що відбувається:**
- ✅ Автоматично підключається до `http://localhost:1337` (локальний Strapi)
- ✅ Сайт доступний на `http://localhost:3000`
- ✅ Next.js Image Optimization дозволяє зображення з `localhost:1337`

---

## 🌐 Як працює Production

### Автоматичне визначення середовища

Проект автоматично визначає середовище через змінну `NODE_ENV`:

- **Development**: `NODE_ENV=development` (або не встановлено)
- **Production**: `NODE_ENV=production`

### Backend (Railway)

**Environment Variables на Railway:**
```
NODE_ENV=production
USE_POSTGRES=true
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=true
HOST=0.0.0.0
PORT=8080
PUBLIC_URL=https://webstudio-landingpage-production.up.railway.app
FRONTEND_URL=https://webbie-tau.vercel.app
NEXT_PUBLIC_SITE_URL=https://webbie-tau.vercel.app
# + Strapi secrets (APP_KEYS, JWT_SECRET, тощо)
```

**Що відбувається:**
- ✅ Автоматично використовується **PostgreSQL** база даних
- ✅ CORS дозволяє запити тільки з production frontend
- ✅ Сервер налаштований для Railway

### Frontend (Vercel)

**Environment Variables на Vercel:**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://webstudio-landingpage-production.up.railway.app
NEXT_PUBLIC_SITE_URL=https://webbie-tau.vercel.app
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=shimakunjp@gmail.com
```

**Що відбувається:**
- ✅ Підключається до production Strapi на Railway
- ✅ Next.js Image Optimization дозволяє зображення з production доменів
- ✅ Використовує production URL для всіх запитів

---

## 🔄 Перемикання між середовищами

### Локальне тестування з Production API

Якщо хочеш протестувати frontend локально, але з production API:

**Frontend `.env.local`:**
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=https://webstudio-landingpage-production.up.railway.app
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend `.env`:**
```env
NODE_ENV=development
USE_POSTGRES=true
DATABASE_URL=your_production_database_url
PUBLIC_URL=https://webstudio-landingpage-production.up.railway.app
```

⚠️ **Увага**: Не змінюй production базу даних під час локальної розробки!

---

## 📁 Файли конфігурації

### Backend
- `backend/config/database.ts` - автоматично вибирає SQLite (dev) або PostgreSQL (prod)
- `backend/config/server.ts` - налаштовує порт та URL залежно від середовища
- `backend/config/middlewares.ts` - налаштовує CORS для різних середовищ

### Frontend
- `frontend/src/config/env.ts` - централізована конфігурація змінних середовища
- `frontend/next.config.ts` - дозволяє localhost для зображень в dev режимі

---

## ✅ Перевірка налаштувань

### Development
```bash
# Backend
cd backend && npm run dev
# Має запуститись на http://localhost:1337
# Має використовувати SQLite

# Frontend
cd frontend && yarn dev
# Має запуститись на http://localhost:3000
# Має підключатись до http://localhost:1337
```

### Production
- Перевір, що на Railway встановлено `NODE_ENV=production`
- Перевір, що на Vercel встановлено `NODE_ENV=production`
- Перевір, що всі змінні середовища встановлені правильно

---

## 🐛 Troubleshooting

### Проблема: Backend не підключається до бази даних

**Рішення:**
- Перевір, чи встановлено `NODE_ENV` правильно
- Для dev: переконайся, що `USE_POSTGRES=false` або не встановлено
- Для prod: переконайся, що `USE_POSTGRES=true` та `DATABASE_URL` встановлено

### Проблема: CORS помилки

**Рішення:**
- Для dev: перевір, що frontend запущений на `localhost:3000`
- Для prod: додай свій Vercel URL до `FRONTEND_URL` на Railway

### Проблема: Зображення не завантажуються

**Рішення:**
- Для dev: перевір, що `localhost:1337` додано до `next.config.ts` domains
- Для prod: перевір, що production домени додані до `next.config.ts`

---

## 📝 Додаткові нотатки

- **SQLite база даних** (`backend/.tmp/data.db`) не комітиться в Git (в `.gitignore`)
- **Environment variables** не комітяться в Git (в `.gitignore`)
- Використовуй `.env.example` файли як шаблони для налаштування
- Для production завжди використовуй окремі бази даних та секрети

---

**Готово!** Тепер ти можеш працювати з dev та prod середовищами окремо, не турбуючись про конфлікти. 🎉

