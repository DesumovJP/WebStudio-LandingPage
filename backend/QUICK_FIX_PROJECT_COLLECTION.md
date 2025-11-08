# ⚡ Швидке виправлення: Project Collection не з'являється

## 🎯 Швидке рішення (5 хвилин)

### Крок 1: Тимчасово переключіть Railway в development mode

1. Зайдіть в **Railway** → ваш проект → **Settings** → **Variables**
2. Знайдіть або додайте:
   ```
   NODE_ENV=development
   ```
3. Зайдіть в **Settings** → **Deploy** → **Start Command**
4. Змініть на:
   ```
   npm run develop
   ```
5. **Redeploy** проект (Railway → Deployments → Redeploy)

### Крок 2: Дочекайтеся запуску

- Railway перезапустить Strapi в development mode
- Strapi прочитає `schema.json` файли з git
- Застосує їх до production БД
- Collection type "Project" з'явиться в адмін-панелі

### Крок 3: Перевірте в адмін-панелі

Відкрийте: `https://webstudio-landingpage-production.up.railway.app/admin`

- Має з'явитися "Project" в **Content-Type Builder**
- Можна створювати entries в **Content Manager**

### Крок 4: Поверніть production mode

1. В Railway → Settings → Variables:
   ```
   NODE_ENV=production
   ```

2. В Railway → Settings → Deploy → Start Command:
   ```
   npm start
   ```

3. **Redeploy** проект

**Важливо**: Collection type залишиться в БД навіть після повернення в production mode!

---

## ✅ Після цього:

1. Налаштуйте **Permissions**:
   - Settings → Users & Permissions → Roles → Public
   - Увімкніть `find` та `findOne` для Project

2. Створюйте entries:
   - Content Manager → Project → Create new entry
   - Заповніть поля та **Publish**

---

## 🔍 Чому це працює?

- В **development mode** Strapi синхронізує `schema.json` файли з БД
- В **production mode** Strapi не синхронізує автоматично (безпека)
- Після синхронізації в dev mode, структура залишається в БД навіть в production

