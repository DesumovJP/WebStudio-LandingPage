# 🔧 Railway Start Command Configuration

## ⚠️ Важливо

Railway використовує `startCommand` з `railway.json` **пріоритетніше**, ніж налаштування в Dashboard.

Якщо ви встановили `npm run develop` в Dashboard, але в `railway.json` є `"startCommand": "npm start"`, Railway все одно використає `npm start` з файлу.

## ✅ Рішення

### Для Development Mode (тимчасово):

В `backend/railway.json`:
```json
{
  "deploy": {
    "startCommand": "npm run develop"
  }
}
```

**Також встановіть в Railway Variables:**
```
NODE_ENV=development
```

### Для Production Mode (після активації GraphQL):

В `backend/railway.json`:
```json
{
  "deploy": {
    "startCommand": "npm start"
  }
}
```

**Також встановіть в Railway Variables:**
```
NODE_ENV=production
```

## 📝 Workflow для активації GraphQL

1. **Змініть `railway.json`:**
   ```json
   "startCommand": "npm run develop"
   ```

2. **Встановіть в Railway Variables:**
   ```
   NODE_ENV=development
   ```

3. **Закомітьте і запуште:**
   ```bash
   git add backend/railway.json
   git commit -m "Switch to development mode for GraphQL activation"
   git push origin main  # або dev
   ```

4. **Дочекайтеся deploy** (2-5 хвилин)

5. **Перевірте GraphQL:**
   ```
   https://webstudio-landingpage-production.up.railway.app/graphql
   ```

6. **Після активації поверніть назад:**
   - `railway.json`: `"startCommand": "npm start"`
   - Railway Variables: `NODE_ENV=production`
   - Закомітьте і запуште знову

## 🎯 Поточний стан

- ✅ `railway.json` змінено на `npm run develop`
- ⚠️ Потрібно встановити `NODE_ENV=development` в Railway Variables
- ⚠️ Потрібно закомітити і запушити зміни

