# 🚀 Інструкція по деплою сайту

## Варіант 1: Vercel (Рекомендовано для Next.js)

### Крок 1: Підготовка GitHub репозиторію

1. Створіть репозиторій на GitHub (якщо ще не створено)
2. Закомітьте та запуште код:
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### Крок 2: Налаштування Vercel

1. Зайдіть на [vercel.com](https://vercel.com)
2. Увійдіть через GitHub акаунт
3. Натисніть "Add New Project"
4. Виберіть ваш репозиторій
5. Налаштуйте проект:
   - **Framework Preset**: Next.js (визначиться автоматично)
   - **Root Directory**: `frontend` (якщо репозиторій в корені)
   - **Build Command**: `yarn build` (або `npm run build`)
   - **Output Directory**: `.next` (за замовчуванням)

### ⚠️ Важливо: Production Branch

**Якщо після підключення репозиторію Vercel не показує поле "Production Branch":**

#### 🔍 Причини:
- Репозиторій **порожній або без комітів у `master`**
- Або **немає коміту після підключення до Vercel**

#### ✅ Виправлення:

1. **Перевір, чи є коміт у `master`:**
```bash
git status
git branch -a  # Перевір наявність master гілки
git log --oneline -5  # Перевір останні коміти
```

2. **Запуш коміт у GitHub:**
```bash
git add .
git commit -m "Initial commit for Vercel"
git push origin master
```

> Це активує гілку і Vercel побачить її

3. **Перезайди в Vercel → Settings → Git:**
   - Тепер має з'явитись поле **Production Branch**
   - Вибери `master` → натисни **Save**

4. **Перевір білд:**
   - У Vercel → вкладка **Deployments**
   - Має з'явитись новий білд зі статусом `Ready`

**Якщо не спрацює:**
- Створи новий проект у Vercel → підключи той самий репозиторій
- Це часто швидше, ніж лагодити старий

### Крок 3: Environment Variables в Vercel

Додайте в Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-strapi-backend.com
RESEND_API_KEY=re_your_resend_api_key
CONTACT_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

**Важливо:**
- `NEXT_PUBLIC_API_URL` - URL вашого Strapi backend (production)
- `RESEND_API_KEY` - API ключ з [resend.com/api-keys](https://resend.com/api-keys)
- `CONTACT_EMAIL` - Email для отримання форм
- `NEXT_PUBLIC_SITE_URL` - URL вашого сайту на Vercel

### Крок 4: Деплой

1. Натисніть "Deploy"
2. Vercel автоматично зіббере проект
3. Після успішного деплою отримаєте URL типу: `your-project.vercel.app`

### Крок 5: Налаштування домену (опціонально)

1. В Settings → Domains додайте ваш домен
2. Налаштуйте DNS записи згідно інструкцій Vercel
3. Очікуйте активації (до 24 годин)

---

## Варіант 2: Netlify

### Крок 1: Підготовка

1. Створіть `netlify.toml` в корені `frontend/`:
```toml
[build]
  command = "yarn build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Крок 2: Налаштування

1. Зайдіть на [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Виберіть GitHub репозиторій
4. Додайте environment variables в Site settings → Environment variables

### Крок 3: Environment Variables

```
NEXT_PUBLIC_API_URL=https://your-strapi-backend.com
RESEND_API_KEY=re_your_resend_api_key
CONTACT_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

---

## Варіант 3: Self-hosted (VPS)

### Підготовка

1. Встановіть Node.js 18+ на сервер
2. Клонуйте репозиторій
3. Встановіть залежності:
```bash
cd frontend
yarn install
```

4. Створіть `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.com
RESEND_API_KEY=re_your_api_key
CONTACT_EMAIL=your-email@example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

5. Зберіть проект:
```bash
yarn build
```

6. Запустіть production server:
```bash
yarn start
```

### Налаштування PM2 (для постійної роботи)

```bash
npm install -g pm2
pm2 start yarn --name "webbie" -- start
pm2 save
pm2 startup
```

### Налаштування Nginx (реверс-проксі)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ⚙️ Налаштування Backend (Strapi)

### Production URL

1. Запустіть Strapi на production сервері
2. Налаштуйте CORS для вашого frontend домену
3. Оновіть `NEXT_PUBLIC_API_URL` в environment variables

### CORS налаштування в Strapi

В `backend/config/middlewares.ts`:
```js
module.exports = [
  // ...
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://your-frontend-domain.com'],
      credentials: true,
    },
  },
];
```

---

## 📧 Налаштування Resend

1. Зареєструйтесь на [resend.com](https://resend.com)
2. Отримайте API ключ в [API Keys](https://resend.com/api-keys)
3. Додайте в environment variables як `RESEND_API_KEY`

**Для production:**
- Налаштуйте домен в Resend для відправки з власного домену
- Оновіть `from` в `/src/app/api/contact/route.ts`

---

## ✅ Чеклист перед деплоєм

- [ ] Всі environment variables налаштовані
- [ ] Backend (Strapi) запущений і доступний
- [ ] CORS налаштований в Strapi
- [ ] Resend API ключ додано
- [ ] `NEXT_PUBLIC_SITE_URL` вказує на правильний домен
- [ ] Тестові запити проходять (контактна форма)
- [ ] Зображення завантажуються з backend
- [ ] Мультимовність працює

---

## 🐛 Troubleshooting

### Проблема: Зображення не завантажуються
**Рішення:** Перевірте `NEXT_PUBLIC_API_URL` та налаштування CORS в Strapi

### Проблема: Контактна форма не працює
**Рішення:** Перевірте `RESEND_API_KEY` та `CONTACT_EMAIL` в environment variables

### Проблема: 404 на локалізованих роутах
**Рішення:** Перевірте middleware та налаштування i18n

### Проблема: Build fails
**Рішення:** Перевірте логи build в Vercel/Netlify, переконайтесь що всі залежності встановлені

---

## 📝 Після деплою

1. Протестуйте всі функції:
   - Перемикання мов
   - Контактна форма
   - Завантаження зображень
   - Модальні вікна

2. Перевірте SEO:
   - Open Graph прев'ю в соцмережах
   - Метадані в браузері
   - Robots.txt

3. Налаштуйте моніторинг (опціонально):
   - Vercel Analytics
   - Sentry для error tracking
   - Google Analytics

---

## 🔗 Корисні посилання

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Resend Documentation](https://resend.com/docs)
- [Strapi Deployment](https://docs.strapi.io/dev-docs/deployment)

