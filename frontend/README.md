# Webbie - Web & App Development Studio

Modern Next.js website with Ukrainian and English language support.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn 4.9.4+ (package manager)

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Configure `.env.local`:
```env
# API & Backend URL
NEXT_PUBLIC_API_URL=http://localhost:1337

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

4. Start development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
yarn build
yarn start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: Material-UI (MUI) v7
- **Styling**: CSS with CSS Variables
- **i18n**: Custom implementation with JSON dictionaries
- **Email**: Resend API
- **Language**: TypeScript

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   ├── config/                # Configuration files
│   ├── i18n/                  # Internationalization
│   ├── theme/                 # MUI theme
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── .env.local                 # Environment variables (not committed)
```

## 🌍 Internationalization

The site supports Ukrainian (`uk`) and English (`en`) languages.

- Language files: `src/i18n/locales/`
- Language switcher: `src/components/LanguageSwitcher.tsx`
- Default locale: Ukrainian

## 📧 Contact Form

The contact form uses Resend API for email delivery.

1. Sign up at [Resend](https://resend.com)
2. Get your API key from [Resend API Keys](https://resend.com/api-keys)
3. Add `RESEND_API_KEY` to `.env.local`

**Note**: For test accounts, emails can only be sent to the email registered in Resend.

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Strapi backend URL
- `RESEND_API_KEY`: Resend API key for email
- `CONTACT_EMAIL`: Email address to receive form submissions

### Next.js Config

Optimizations are configured in `next.config.ts`:
- Image optimization with AVIF and WebP
- Compression enabled
- React Strict Mode
- Source maps disabled in production

## 🎨 Styling

- CSS Variables for theming
- Responsive design with viewport-based units
- Glassmorphism effects
- Custom animations

## 📝 Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🚢 Deployment

**📖 Детальна інструкція:** Дивіться [DEPLOY.md](./DEPLOY.md) для повної інструкції по деплою.

### Швидкий старт (Vercel)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. **Import project in Vercel**
   - Зайдіть на [vercel.com](https://vercel.com)
   - "Add New Project" → виберіть ваш репозиторій
   - Root Directory: `frontend` (якщо репозиторій в корені)

3. **Add environment variables** в Vercel Settings:
   ```
   NEXT_PUBLIC_API_URL=https://your-strapi-backend.com
   RESEND_API_KEY=re_your_resend_api_key
   CONTACT_EMAIL=your-email@example.com
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy** - Vercel автоматично зіббере проект

### Environment Variables для Production

**Обов'язкові:**
- `NEXT_PUBLIC_API_URL` - URL вашого Strapi backend (production)
- `RESEND_API_KEY` - API ключ з [resend.com/api-keys](https://resend.com/api-keys)
- `CONTACT_EMAIL` - Email для отримання форм

**Рекомендовані:**
- `NEXT_PUBLIC_SITE_URL` - URL вашого сайту (для SEO)

### Детальні інструкції

- [Vercel Deployment](./DEPLOY.md#варіант-1-vercel-рекомендовано-для-nextjs)
- [Netlify Deployment](./DEPLOY.md#варіант-2-netlify)
- [Self-hosted (VPS)](./DEPLOY.md#варіант-3-self-hosted-vps)

## 📄 License

Private project - All rights reserved.
