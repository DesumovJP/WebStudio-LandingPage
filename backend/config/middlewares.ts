export default ({ env }) => {
  const isDevelopment = env('NODE_ENV') !== 'production';
  
  // CORS origins для різних середовищ
  const corsOrigins = isDevelopment
    ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ]
    : [
        'http://localhost:3000', // для локального тестування
        'https://webbie-tau.vercel.app', // production frontend
        env('FRONTEND_URL', ''),
        env('NEXT_PUBLIC_SITE_URL', ''),
      ].filter(Boolean); // прибираємо порожні значення

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: corsOrigins,
        credentials: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
