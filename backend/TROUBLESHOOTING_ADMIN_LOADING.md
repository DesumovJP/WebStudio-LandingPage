# 🔧 Troubleshooting: Strapi Admin не завантажується (крутиться лоадінг)

## ⚠️ Симптоми

- Strapi Admin показує лоадінг і не завантажується
- Railway каже що deploy успішний
- Сторінка просто крутиться без помилок

---

## 🔍 Крок 1: Перевірте Railway Logs

1. **Railway → ваш проект → Deployments → [останній deploy] → View Logs**
2. Шукайте помилки:
   - `Error: Missing required environment variable`
   - `Database connection failed`
   - `Cannot read property of undefined`
   - `TypeError`

### Типові помилки:

```
❌ Error: Missing required environment variable: ADMIN_AUTH_SECRET
❌ Error: Database connection failed
❌ Error: APP_KEYS must be an array
```

---

## ✅ Крок 2: Перевірте Environment Variables

### Обов'язкові змінні для Strapi:

1. **APP_KEYS** (масив з 4 ключів)
   ```
   APP_KEYS=key1,key2,key3,key4
   ```

2. **ADMIN_AUTH_SECRET** (один ключ)
   ```
   ADMIN_AUTH_SECRET=your-secret-key-here
   ```

3. **API_TOKEN_SALT** (один ключ)
   ```
   API_TOKEN_SALT=your-salt-here
   ```

4. **TRANSFER_TOKEN_SALT** (один ключ)
   ```
   TRANSFER_TOKEN_SALT=your-transfer-salt-here
   ```

5. **ENCRYPTION_KEY** (один ключ)
   ```
   ENCRYPTION_KEY=your-encryption-key-here
   ```

6. **JWT_SECRET** (один ключ)
   ```
   JWT_SECRET=your-jwt-secret-here
   ```

7. **DATABASE_URL** (PostgreSQL connection string)
   ```
   DATABASE_URL=postgresql://postgres:password@host:5432/database
   ```

8. **PUBLIC_URL** (URL вашого Strapi)
   ```
   PUBLIC_URL=https://webstudio-landingpage-production.up.railway.app
   ```

9. **NODE_ENV**
   ```
   NODE_ENV=production
   ```

10. **CLOUDINARY** (якщо використовуєте)
    ```
    CLOUDINARY_NAME=your-cloud-name
    CLOUDINARY_KEY=your-api-key
    CLOUDINARY_SECRET=your-api-secret
    ```

### Як перевірити в Railway:

1. **Railway → Settings → Variables**
2. Перевірте, що всі змінні присутні
3. Переконайтеся, що значення правильні (без пробілів, лапок)

---

## 🔧 Крок 3: Перевірте Database Connection

### Проблема: DATABASE_URL неправильний

1. **Railway → ваш проект → PostgreSQL → Variables**
2. Перевірте `DATABASE_URL`
3. Має бути формату:
   ```
   postgresql://postgres:password@host:5432/database
   ```

### Проблема: SSL налаштування

В `config/database.ts` вже налаштовано:
```typescript
ssl: env.bool('DATABASE_SSL', true)
  ? { rejectUnauthorized: false }
  : false,
```

Якщо все ще не працює, додайте в Railway:
```
DATABASE_SSL=true
```

---

## 🛠️ Крок 4: Перевірте Build Process

### Проблема: Build не завершився

1. **Railway → Deployments → [останній deploy] → Build Logs**
2. Шукайте:
   - `✔ Building admin panel`
   - `✔ Compiling TS`
   - `✔ Building build context`

Якщо build не завершився, можуть бути помилки TypeScript.

### Виправлення:

```bash
# Локально перевірте build
cd backend
npm run build
```

Якщо є помилки, виправте їх перед push.

---

## 🔐 Крок 5: Генерація Secret Keys

Якщо секрети відсутні або неправильні:

### Локально згенеруйте нові:

```bash
cd backend
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Виконайте 4 рази для `APP_KEYS` та по одному разу для інших.

### Або використайте онлайн генератор:

- https://generate-secret.vercel.app/32 (для кожного ключа)

---

## 🌐 Крок 6: Перевірте CORS (якщо Admin завантажується, але API не працює)

В `config/middlewares.ts` додайте Railway domain:

```typescript
origin: [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://webbie-tau.vercel.app',
  'https://webstudio-landingpage-production.up.railway.app', // ← Додайте
  /\.vercel\.app$/,
  /\.railway\.app$/, // ← Додайте для всіх Railway доменів
],
```

---

## 🚀 Крок 7: Перезапуск з чистим build

1. **Railway → Settings → Deploy → Build Command**
   ```
   npm ci && npm run build
   ```

2. **Railway → Settings → Deploy → Start Command**
   ```
   npm start
   ```

3. **Redeploy** проект

---

## 🔍 Крок 8: Перевірка через Railway Shell

1. **Railway → ваш проект → Shell**
2. Виконайте:
   ```bash
   cd backend
   npm start
   ```
3. Подивіться на помилки в реальному часі

---

## 📋 Чеклист для швидкого виправлення

- [ ] Перевірено Railway Logs на помилки
- [ ] Перевірено всі Environment Variables
- [ ] `APP_KEYS` має 4 значення через кому
- [ ] `DATABASE_URL` правильний
- [ ] `PUBLIC_URL` правильний
- [ ] `NODE_ENV=production`
- [ ] Build завершився успішно
- [ ] Перезапущено проект після змін

---

## 🎯 Найчастіші проблеми та рішення

### Проблема 1: "Missing ADMIN_AUTH_SECRET"

**Рішення:**
1. Згенеруйте новий ключ
2. Додайте в Railway → Settings → Variables
3. Redeploy

### Проблема 2: "Database connection failed"

**Рішення:**
1. Перевірте `DATABASE_URL`
2. Перевірте `DATABASE_SSL=true`
3. Перевірте чи PostgreSQL сервіс запущений в Railway

### Проблема 3: "APP_KEYS must be an array"

**Рішення:**
1. `APP_KEYS` має бути через кому: `key1,key2,key3,key4`
2. Без пробілів
3. Без лапок

### Проблема 4: Build помилки TypeScript

**Рішення:**
1. Локально: `cd backend && npm run build`
2. Виправте помилки
3. Commit та push
4. Railway перезапустить

---

## 📞 Якщо нічого не допомагає

1. **Перевірте Railway Status**: https://status.railway.app/
2. **Перевірте Strapi Logs** в Railway → Deployments → Logs
3. **Спробуйте тимчасово development mode**:
   - `NODE_ENV=development`
   - `Start Command: npm run develop`
   - Redeploy
   - Подивіться на детальні логи

---

## 🔗 Корисні посилання

- [Strapi Environment Variables](https://docs.strapi.io/dev-docs/configurations/environment)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Strapi Deployment Guide](https://docs.strapi.io/dev-docs/deployment)

