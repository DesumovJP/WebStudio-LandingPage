# 📦 Встановлення GraphQL Plugin в Strapi

## ⚠️ Проблема

GraphQL endpoint повертає 404 - плагін не встановлений.

---

## ✅ Рішення

### Крок 1: Встановіть GraphQL plugin

```bash
cd backend
npm install @strapi/plugin-graphql
```

### Крок 2: Налаштуйте GraphQL в `config/plugins.ts`

Додано конфігурацію GraphQL в `config/plugins.ts`.

### Крок 3: Перезапустіть Strapi

**На Railway:**
1. Railway → ваш проект → Deployments → Redeploy

**Локально:**
```bash
cd backend
npm run develop
```

### Крок 4: Перевірте GraphQL

1. Відкрийте: `https://webstudio-landingpage-production.up.railway.app/graphql`
2. Має з'явитися GraphQL Playground

---

## 🔍 Після встановлення

Перевірте локалізацію через GraphQL:

```graphql
query {
  projects(locale: "uk") {
    data {
      attributes {
        locale
        title
      }
    }
  }
}
```

Якщо повертає правильні дані - проблема була в GraphQL.
Якщо все ще неправильні дані - проблема в Strapi i18n.

