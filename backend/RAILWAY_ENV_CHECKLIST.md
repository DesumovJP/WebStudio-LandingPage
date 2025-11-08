# ✅ Railway Environment Variables Checklist

## 🔧 Встановлені змінні:

### ✅ Database
- `DATABASE_URL=postgresql://postgres:tngLYZuJRWNpYJOYTIkazIhnngfWoFuY@postgres.railway.internal:5432/railway` ✅
- `DATABASE_SSL=true` (за замовчуванням в коді)

**Примітка:** `postgres.railway.internal` - це внутрішній Railway домен, це нормально і правильно для Railway.

### ✅ Server
- `PUBLIC_URL=https://webstudio-landingpage-production.up.railway.app` ✅
- `HOST=0.0.0.0` (за замовчуванням)
- `PORT=8080` (за замовчуванням, Railway може використовувати PORT з env)

### ✅ Cloudinary
- `CLOUDINARY_NAME=deirtcyfx` ✅
- `CLOUDINARY_KEY=` (потрібно встановити в Railway)
- `CLOUDINARY_SECRET=` (потрібно встановити в Railway)

### ⚠️ Strapi Secrets (обов'язково встановити в Railway)
- `APP_KEYS=` (4 ключі через кому, наприклад: `key1,key2,key3,key4`)
- `ADMIN_AUTH_SECRET=` (для admin панелі)
- `JWT_SECRET=` (для users-permissions plugin)
- `API_TOKEN_SALT=` (для API токенів)
- `TRANSFER_TOKEN_SALT=` (для transfer токенів)
- `ENCRYPTION_KEY=` (для шифрування)

### ✅ Environment
- `NODE_ENV=production` (рекомендовано)

---

## 🚀 Як встановити в Railway:

1. Зайдіть в Railway → ваш проект → Settings → Variables
2. Додайте всі змінні з вище
3. Для генерації секретів виконайте:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Виконайте 6 разів для всіх секретів.

---

## ✅ Перевірка конфігурації:

### `backend/config/server.ts`
- ✅ `PUBLIC_URL` fallback встановлено правильно
- ✅ `HOST` та `PORT` мають значення за замовчуванням

### `backend/config/database.ts`
- ✅ `DATABASE_URL` читається з env
- ✅ `DATABASE_SSL=true` за замовчуванням (правильно для Railway)
- ✅ `rejectUnauthorized: false` для Railway SSL

### `backend/config/middlewares.ts`
- ✅ CORS налаштовано для Vercel доменів
- ✅ Додано regex для всіх Vercel preview deployments

### `backend/config/plugins.ts`
- ✅ Cloudinary налаштовано правильно
- ✅ JWT_SECRET читається з env

### `backend/config/admin.ts`
- ✅ ADMIN_AUTH_SECRET читається з env
- ✅ API_TOKEN_SALT, TRANSFER_TOKEN_SALT, ENCRYPTION_KEY читаються з env

---

## 📝 Підсумок:

**Встановлено:**
- ✅ PUBLIC_URL
- ✅ DATABASE_URL
- ✅ CLOUDINARY_NAME

**Потрібно встановити в Railway:**
- ⚠️ CLOUDINARY_KEY
- ⚠️ CLOUDINARY_SECRET
- ⚠️ APP_KEYS (4 ключі)
- ⚠️ ADMIN_AUTH_SECRET
- ⚠️ JWT_SECRET
- ⚠️ API_TOKEN_SALT
- ⚠️ TRANSFER_TOKEN_SALT
- ⚠️ ENCRYPTION_KEY
- ⚠️ NODE_ENV=production (рекомендовано)

**Конфігурація коду:**
- ✅ Всі файли налаштовані правильно
- ✅ Fallback значення встановлені для production
- ✅ CORS налаштовано для Vercel

