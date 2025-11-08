# 🔧 Виправлення: Collection Type "Project" не з'являється на Production

## ⚠️ Проблема

Collection type створено локально, файли закомічені в git, але на production (Railway) він не з'являється.

## 🔍 Причини

1. **Strapi в production mode** не синхронізує автоматично `schema.json` файли
2. Railway виконує `strapi start` (production), а не `strapi develop`
3. В production mode Content-Type Builder заблокований

## ✅ Рішення

### Варіант 1: Тимчасово переключитися в development mode (Рекомендовано)

1. **В Railway Settings → Variables** додайте/змініть:
   ```
   NODE_ENV=development
   ```

2. **Змініть Start Command** в Railway:
   - Settings → Deploy → Start Command
   - Змініть на: `npm run develop` або `yarn develop`

3. **Redeploy** - Railway перезапустить Strapi в development mode

4. **Після синхронізації** поверніть назад:
   ```
   NODE_ENV=production
   Start Command: npm start
   ```

### Варіант 2: Використати команду build для синхронізації

Додайте в Railway **Build Command**:
```bash
npm run build
```

Це синхронізує schema.json файли з БД під час build.

### Варіант 3: Створити через Strapi CLI (якщо маєте доступ до Railway shell)

```bash
# Підключіться до Railway shell
railway shell

# Запустіть Strapi в development mode
cd backend
npm run develop
```

### Варіант 4: Використати Strapi Admin API (якщо доступний)

Можна створити collection type через API, але це складніше.

---

## 🎯 Рекомендований Workflow

### Крок 1: Перевірте Railway налаштування

1. Зайдіть в Railway → ваш проект → Settings
2. Перевірте **Variables**:
   - `NODE_ENV` має бути `production` (але для синхронізації тимчасово `development`)
3. Перевірте **Deploy**:
   - **Build Command**: `npm run build` (додайте якщо немає)
   - **Start Command**: `npm start` (production) або `npm run develop` (для синхронізації)

### Крок 2: Тимчасово переключіть в development mode

1. В Railway → Settings → Variables:
   ```
   NODE_ENV=development
   ```

2. В Railway → Settings → Deploy → Start Command:
   ```
   npm run develop
   ```

3. **Redeploy** проект

4. Дочекайтеся, поки Strapi запуститься

5. Перевірте в адмін-панелі: `https://webstudio-landingpage-production.up.railway.app/admin`
   - Має з'явитися "Project" в Content-Type Builder

### Крок 3: Після синхронізації поверніть production mode

1. В Railway → Settings → Variables:
   ```
   NODE_ENV=production
   ```

2. В Railway → Settings → Deploy → Start Command:
   ```
   npm start
   ```

3. **Redeploy** проект

---

## 🔍 Перевірка

### Чи файли в git?
```bash
git ls-files | grep "api/project.*schema.json"
# Має показати: backend/src/api/project/content-types/project/schema.json
```

### Чи Railway бачить файли?
- Railway → Deployments → останній deploy → View Logs
- Шукайте помилки про schema.json або content types

### Чи правильно налаштований Build Command?
Railway має виконувати `npm run build` перед стартом, це синхронізує schema.

---

## 🚨 Важливо

**Після синхронізації в development mode:**
- Collection type з'явиться в БД
- Потім можна повернутися в production mode
- Content types залишаться в БД навіть після переключення назад

**Не забудьте:**
- Налаштувати Permissions для Public role після появи collection type
- Опублікувати проекти (не залишати в draft)

