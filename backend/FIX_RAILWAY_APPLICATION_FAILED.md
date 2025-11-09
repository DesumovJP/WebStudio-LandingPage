# 🔧 Виправлення: Application failed to respond на Railway

## ⚠️ Проблема

Railway показує помилку:
```
Application failed to respond
This error appears to be caused by the application.
```

## 🔍 Крок 1: Перевірте Railway Logs

1. **Railway → ваш проект → Deployments → останній deployment → Logs**
2. Шукайте помилки:
   - `Error: Missing required environment variable`
   - `Database connection failed`
   - `Cannot read property of undefined`
   - `TypeError`
   - `EADDRINUSE` (порт зайнятий)
   - `ECONNREFUSED` (не може підключитися до БД)

## ✅ Крок 2: Перевірте поточний режим

В `railway.json` зараз встановлено:
```json
"startCommand": "npm run develop"
```

Це **development mode**. Якщо GraphQL вже активований, можна повернутися в **production mode**.

## 🔄 Крок 3: Поверніть Production Mode (якщо GraphQL працює)

### Варіант A: Змінити через Railway Dashboard

1. **Railway → Settings → Deploy → Start Command**
2. Змініть на: `npm start`
3. **Railway → Settings → Variables**
4. Переконайтеся, що є: `NODE_ENV=production`
5. **Redeploy** проект

### Варіант B: Змінити через `railway.json`

1. Змініть `backend/railway.json`:
   ```json
   {
     "deploy": {
       "startCommand": "npm start"
     }
   }
   ```
2. Закомітьте і запуште:
   ```bash
   git add backend/railway.json
   git commit -m "Switch back to production mode"
   git push origin master
   ```

## ✅ Крок 4: Перевірте Environment Variables

Переконайтеся, що всі змінні встановлені в Railway:

### Обов'язкові змінні:

1. **APP_KEYS** (4 ключі через кому)
   ```
   APP_KEYS=key1,key2,key3,key4
   ```

2. **ADMIN_AUTH_SECRET**
   ```
   ADMIN_AUTH_SECRET=your-secret-key
   ```

3. **JWT_SECRET**
   ```
   JWT_SECRET=your-jwt-secret
   ```

4. **API_TOKEN_SALT**
   ```
   API_TOKEN_SALT=your-salt
   ```

5. **TRANSFER_TOKEN_SALT**
   ```
   TRANSFER_TOKEN_SALT=your-transfer-salt
   ```

6. **ENCRYPTION_KEY**
   ```
   ENCRYPTION_KEY=your-encryption-key
   ```

7. **DATABASE_URL**
   ```
   DATABASE_URL=postgresql://postgres:password@host:5432/database
   ```

8. **PUBLIC_URL**
   ```
   PUBLIC_URL=https://webstudio-landingpage-production.up.railway.app
   ```

9. **NODE_ENV**
   ```
   NODE_ENV=production
   ```

10. **CLOUDINARY** (якщо використовуєте)
    ```
    CLOUDINARY_NAME=deirtcyfx
    CLOUDINARY_KEY=your-key
    CLOUDINARY_SECRET=your-secret
    ```

## 🔍 Крок 5: Перевірте Database Connection

1. **Railway → ваш проект → PostgreSQL service**
2. Переконайтеся, що сервіс запущений
3. Перевірте `DATABASE_URL` в Variables

## 🚀 Крок 6: Перезапуск

1. **Railway → Deployments → Redeploy**
2. Дочекайтеся завершення build (2-5 хвилин)
3. Перевірте логи на помилки

## 🐛 Типові проблеми

### Проблема 1: Development mode не працює на Railway

**Рішення:** Поверніться в production mode:
- `NODE_ENV=production`
- `Start Command: npm start`

### Проблема 2: Missing environment variables

**Рішення:** Перевірте всі змінні в Railway → Settings → Variables

### Проблема 3: Database connection failed

**Рішення:**
1. Перевірте `DATABASE_URL`
2. Переконайтеся, що PostgreSQL сервіс запущений
3. Перевірте `DATABASE_SSL=true` (якщо потрібно)

### Проблема 4: Port already in use

**Рішення:**
1. Переконайтеся, що `PORT` встановлений правильно
2. Railway автоматично встановлює `PORT` з env

## 📋 Швидкий чеклист

- [ ] Перевірено Railway Logs
- [ ] Всі Environment Variables встановлені
- [ ] `NODE_ENV=production` (або `development` якщо потрібно)
- [ ] `Start Command` правильний (`npm start` або `npm run develop`)
- [ ] PostgreSQL сервіс запущений
- [ ] `DATABASE_URL` правильний
- [ ] `PUBLIC_URL` правильний
- [ ] Redeploy виконано

## 🎯 Рекомендація

Якщо GraphQL вже працює, поверніться в **production mode**:
1. Змініть `railway.json`: `"startCommand": "npm start"`
2. Встановіть `NODE_ENV=production` в Railway Variables
3. Redeploy

Production mode стабільніший і менш ресурсозатратний на Railway.

