# ⚡ Швидкий старт для деплою Backend (Strapi)

## 🎯 Рекомендовано: Railway.app (5 хвилин)

### Крок 1: Підготовка

```bash
cd backend
git add .
git commit -m "Ready for production"
git push origin main
```

### Крок 2: Створення проекту на Railway

1. Зайдіть на [railway.app](https://railway.app)
2. Увійдіть через GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Виберіть ваш репозиторій
5. **Root Directory**: `backend`

### Крок 3: Додайте PostgreSQL

1. В проекті: **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway автоматично створить базу даних
3. Отримайте `DATABASE_URL` з змінних середовища

### Крок 4: Environment Variables

Додайте в Settings → Variables:

```
# Database
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Strapi Secrets (згенеруйте випадкові рядки)
ADMIN_JWT_SECRET=your-random-secret-here
APP_KEYS=secret1,secret2,secret3,secret4
API_TOKEN_SALT=your-random-secret-here
TRANSFER_TOKEN_SALT=your-random-secret-here
JWT_SECRET=your-random-secret-here

# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# CORS (ваш frontend URL)
FRONTEND_URL=https://your-frontend.vercel.app
```

**Генерація секретів:**
```bash
# Виконайте в терміналі для генерації випадкових рядків:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Виконайте 5 разів для генерації всіх секретів.

### Крок 5: Deploy

Railway автоматично зібере та запустить проект після push в GitHub.

### Крок 6: Отримайте URL

Після деплою Railway надасть URL типу: `your-project.up.railway.app`

**Додайте його в Vercel:**
- Зайдіть в Vercel → Settings → Environment Variables
- Додайте: `NEXT_PUBLIC_API_URL=https://your-project.up.railway.app`
- Перезапустіть деплой

---

## ✅ Чеклист

- [ ] PostgreSQL база даних створена
- [ ] Всі секрети згенеровані та додані
- [ ] Environment variables налаштовані
- [ ] CORS налаштований (FRONTEND_URL)
- [ ] DATABASE_URL налаштований
- [ ] Код закомічений та запушений

---

## 🔗 Оновлення Frontend після деплою Backend

1. Отримайте URL вашого backend (наприклад: `https://your-project.up.railway.app`)
2. Додайте в Vercel Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-project.up.railway.app
   ```
3. Перезапустіть деплой на Vercel

---

## 📚 Детальні інструкції

Для детальнішої інформації дивіться [DEPLOY.md](./DEPLOY.md)

