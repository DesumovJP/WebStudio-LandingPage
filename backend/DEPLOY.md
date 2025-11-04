# 🚀 Інструкція по деплою Strapi Backend

Vercel хостить тільки frontend (Next.js), а для Strapi backend потрібен окремий хостинг.

## 🎯 Рекомендовані варіанти

### 1. Railway.app (Найпростіший) ⭐ РЕКОМЕНДОВАНО

**Переваги:**
- Простий деплой з GitHub
- Автоматичний SSL
- Безкоштовний tier на 500 годин/місяць
- Підтримка PostgreSQL
- Автоматичні backups

**Крок 1: Підготовка**
```bash
# Переконайтесь що backend готовий
cd backend
git add .
git commit -m "Ready for production"
git push origin main
```

**Крок 2: Створення проекту**
1. Зайдіть на [railway.app](https://railway.app)
2. Увійдіть через GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Виберіть ваш репозиторій
5. Виберіть папку `backend` або встановіть Root Directory: `backend`

**Крок 3: Додайте PostgreSQL**
1. В проекті: "New" → "Database" → "PostgreSQL"
2. Railway автоматично створить базу даних
3. Отримайте Connection URL з змінних середовища

**Крок 4: Environment Variables**
Додайте в Settings → Variables:

```
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=railway
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password
DATABASE_SSL=true
# Або використайте DATABASE_URL (Railway автоматично додає)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Strapi Admin
ADMIN_JWT_SECRET=your-random-secret-here
APP_KEYS=your-random-secret-here-1,your-random-secret-here-2,your-random-secret-here-3,your-random-secret-here-4
API_TOKEN_SALT=your-random-secret-here
TRANSFER_TOKEN_SALT=your-random-secret-here
JWT_SECRET=your-random-secret-here

# CORS (ваш frontend URL)
HOST=0.0.0.0
PORT=1337
```

**Генерація секретів:**
```bash
# Виконайте в терміналі для генерації випадкових рядків:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Крок 5: Налаштування database.ts**
В `backend/config/database.ts`:
```typescript
export default {
  connection: {
    client: 'postgres',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
  },
};
```

**Крок 6: Deploy**
Railway автоматично зібере та запустить проект після push в GitHub.

**Крок 7: Отримайте URL**
Після деплою Railway надасть URL типу: `your-project.up.railway.app`
Додайте його в `NEXT_PUBLIC_API_URL` на Vercel.

---

### 2. Render.com (Безкоштовний tier)

**Переваги:**
- Безкоштовний tier (закривається після бездіяльності)
- Автоматичний SSL
- Простий деплой з GitHub

**Крок 1: Створення проекту**
1. Зайдіть на [render.com](https://render.com)
2. Увійдіть через GitHub
3. "New" → "Web Service"
4. Виберіть репозиторій та папку `backend`

**Крок 2: Налаштування**
- **Build Command**: `yarn install && yarn build`
- **Start Command**: `yarn start`
- **Environment**: `Node`

**Крок 3: Додайте PostgreSQL**
1. "New" → "PostgreSQL"
2. Створіть базу даних
3. Отримайте Connection String

**Крок 4: Environment Variables**
Додайте ті самі змінні що і для Railway.

**Крок 5: Deploy**
Render автоматично деплоїть після push.

---

### 3. DigitalOcean App Platform

**Переваги:**
- Стабільність
- Хороша документація
- Платно (від $5/місяць)

**Крок 1: Створення**
1. Зайдіть на [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. "Create" → "Apps"
3. Підключіть GitHub репозиторій

**Крок 2: Налаштування**
- **Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `yarn install && yarn build`
- **Run Command**: `yarn start`

**Крок 3: Додайте Database**
- "Add Resource" → "Database" → "PostgreSQL"

---

### 4. Self-hosted VPS (DigitalOcean, Hetzner, AWS EC2)

**Крок 1: Підготовка сервера**
```bash
# Підключіться до сервера
ssh root@your-server-ip

# Встановіть Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Встановіть PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Встановіть PM2
npm install -g pm2
```

**Крок 2: Налаштування PostgreSQL**
```bash
# Створіть користувача та базу даних
sudo -u postgres psql
CREATE DATABASE strapi;
CREATE USER strapiuser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapiuser;
\q
```

**Крок 3: Деплой коду**
```bash
# Клонуйте репозиторій
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend

# Встановіть залежності
yarn install

# Створіть .env
nano .env
```

**.env файл:**
```
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapiuser
DATABASE_PASSWORD=your-password
DATABASE_SSL=false
HOST=0.0.0.0
PORT=1337
ADMIN_JWT_SECRET=your-secret
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
TRANSFER_TOKEN_SALT=your-salt
JWT_SECRET=your-secret
```

**Крок 4: Запуск**
```bash
# Build
yarn build

# Запуск з PM2
pm2 start yarn --name "strapi" -- start
pm2 save
pm2 startup
```

**Крок 5: Nginx (реверс-проксі)**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Крок 6: SSL (Let's Encrypt)**
```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d api.yourdomain.com
```

---

## 🔧 Налаштування CORS для Frontend

Після деплою backend потрібно налаштувати CORS.

**В `backend/config/middlewares.ts`:**
```typescript
export default [
  // ...
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'https://your-frontend-domain.vercel.app',
        'https://your-custom-domain.com',
      ],
      credentials: true,
    },
  },
];
```

---

## 📝 Чеклист перед деплоєм

- [ ] PostgreSQL база даних створена
- [ ] Всі секрети згенеровані та додані
- [ ] Environment variables налаштовані
- [ ] CORS налаштований для frontend домену
- [ ] Database connection налаштований
- [ ] Код закомічений та запушений

---

## 🔗 Оновлення Frontend після деплою Backend

1. Отримайте URL вашого backend (наприклад: `https://your-backend.railway.app`)
2. Додайте в Vercel Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
3. Перезапустіть деплой на Vercel

---

## 🐛 Troubleshooting

### Проблема: Database connection failed
**Рішення:** Перевірте DATABASE_URL та SSL налаштування

### Проблема: CORS errors
**Рішення:** Додайте frontend URL в CORS налаштування в Strapi

### Проблема: Strapi не запускається
**Рішення:** Перевірте логи в Railway/Render, переконайтесь що всі секрети налаштовані

---

## 📚 Корисні посилання

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

