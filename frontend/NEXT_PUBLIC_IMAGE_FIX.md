# Fixing public/ images with Next.js i18n (uk/en)

When i18n is enabled, routes get a locale prefix (e.g. /uk, /en). Files in public/ remain available only from the root path and are NOT localized.

## Symptoms
- Requesting `/uk/landing-placeholder.svg` returns 404
- Direct `/landing-placeholder.svg` works

## Solutions (pick one)

### 1) Absolute URL via env (recommended for strict i18n setups)
```tsx
<img src={`${process.env.NEXT_PUBLIC_SITE_URL}/landing-placeholder.svg`} alt="Placeholder" />
```
Set in Vercel:
```
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

### 2) Use next/image with unoptimized for public assets
```tsx
import Image from 'next/image';

<Image
  src="/landing-placeholder.svg"
  alt="Placeholder"
  width={300}
  height={200}
  unoptimized
/>
```
This bypasses CDN optimization and avoids locale-prefixed path issues.

### 3) Custom loader (advanced)
Provide a loader that strips locale prefixes or prepends your site root.

### 4) Middleware rewrite (advanced)
Rewrite `/uk/*.svg` → `/*.svg` (be careful to scope only static assets to avoid route conflicts).

## Checklist
- Access public file directly: `https://your-site.vercel.app/landing-placeholder.svg`
- Ensure code uses `/landing-placeholder.svg` or absolute URL
- Avoid `/uk/landing-placeholder.svg` or `/en/landing-placeholder.svg`

## Notes
- public/ files are always served from the root path
- i18n prefixing does not replicate files under locale paths
