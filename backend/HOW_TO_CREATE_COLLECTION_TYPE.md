# 📝 Як створити новий Collection Type в Strapi

## 🎯 Варіант 1: Локально в Development Mode (Рекомендовано)

### Крок 1: Запустіть Strapi локально в development mode

```bash
cd backend
npm run develop
# або
yarn develop
```

### Крок 2: Створіть Collection Type через адмін-панель

1. Відкрийте `http://localhost:1337/admin`
2. Зайдіть в **Content-Type Builder** (ліва панель)
3. Натисніть **"+ Create new collection type"**
4. Введіть назву (наприклад: `Blog`, `Service`, `Testimonial`)
5. Додайте поля:
   - Text, Rich Text, Number, Date, Media, Relation тощо
6. Натисніть **Save**

### Крок 3: Закомітьте зміни

```bash
git add backend/src/api/
git commit -m "Add new collection type: [назва]"
git push origin master
```

### Крок 4: Задеплойте на Railway

Railway автоматично побачить зміни після push.

---

## 🛠️ Варіант 2: Створення вручну через файли

Якщо не можете запустити локально, можна створити вручну:

### Структура файлів:

```
backend/src/api/[collection-name]/
├── content-types/
│   └── [collection-name]/
│       └── schema.json          # Схема полів
├── controllers/
│   └── [collection-name].ts     # Контролери
├── routes/
│   └── [collection-name].ts     # Маршрути
└── services/
    └── [collection-name].ts     # Сервіси
```

### Приклад: Створення "Blog" collection type

#### 1. Створіть `backend/src/api/blog/content-types/blog/schema.json`:

```json
{
  "kind": "collectionType",
  "collectionName": "blogs",
  "info": {
    "singularName": "blog",
    "pluralName": "blogs",
    "displayName": "Blog",
    "description": "Blog posts"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "string",
      "unique": true
    },
    "content": {
      "type": "richtext"
    },
    "excerpt": {
      "type": "text"
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "publishedAt": {
      "type": "datetime"
    }
  }
}
```

#### 2. Створіть `backend/src/api/blog/controllers/blog.ts`:

```typescript
'use strict';

/**
 * blog controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog.blog');
```

#### 3. Створіть `backend/src/api/blog/routes/blog.ts`:

```typescript
'use strict';

/**
 * blog router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::blog.blog');
```

#### 4. Створіть `backend/src/api/blog/services/blog.ts`:

```typescript
'use strict';

/**
 * blog service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::blog.blog');
```

### Після створення:

1. Закомітьте файли:
```bash
git add backend/src/api/blog/
git commit -m "Add Blog collection type"
git push origin master
```

2. Railway автоматично побачить зміни та перезапустить Strapi

3. В адмін-панелі Railway з'явиться новий collection type

---

## 📋 Типи полів в schema.json:

### Текстові поля:
```json
"title": {
  "type": "string",
  "required": true,
  "unique": false,
  "minLength": 0,
  "maxLength": 255
}
```

### Rich Text:
```json
"content": {
  "type": "richtext"
}
```

### Числа:
```json
"price": {
  "type": "decimal",
  "required": false,
  "min": 0
}
```

### Дата:
```json
"publishedAt": {
  "type": "datetime"
}
```

### Медіа:
```json
"image": {
  "type": "media",
  "multiple": false,
  "required": false,
  "allowedTypes": ["images"]
}
```

### JSON:
```json
"metadata": {
  "type": "json"
}
```

### Boolean:
```json
"isPublished": {
  "type": "boolean",
  "default": false
}
```

### Enumeration:
```json
"status": {
  "type": "enumeration",
  "enum": ["draft", "published", "archived"],
  "default": "draft"
}
```

### Relation (один до багатьох):
```json
"author": {
  "type": "relation",
  "relation": "manyToOne",
  "target": "plugin::users-permissions.user"
}
```

---

## ⚠️ Важливо:

1. **Після створення collection type** потрібно налаштувати **Permissions**:
   - Settings → Users & Permissions → Roles → Public
   - Увімкнути `find` та `findOne` для нового collection type

2. **Для GraphQL** (якщо використовуєте):
   - Переконайтеся, що GraphQL plugin встановлено
   - Collection type автоматично з'явиться в GraphQL схемі

3. **Draft & Publish**:
   - Якщо `draftAndPublish: true`, записи мають бути опубліковані
   - Інакше вони не будуть доступні через API

---

## 🔍 Перевірка:

Після створення перевірте:

1. В адмін-панелі з'явився новий collection type
2. Можна створити новий entry
3. API доступний: `https://webstudio-landingpage-production.up.railway.app/api/[collection-name]`
4. GraphQL доступний (якщо використовуєте)

