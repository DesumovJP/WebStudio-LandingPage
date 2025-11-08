import path from 'path';

export default ({ env }) => {
  const isDevelopment = env('NODE_ENV') !== 'production';
  
  // ✅ Правильний підхід: Окрема PostgreSQL база для dev
  // Якщо DATABASE_URL встановлено - використовуємо PostgreSQL (для dev або prod)
  // Якщо не встановлено - спробуємо SQLite (може не працювати в Strapi 5)
  const databaseUrl = env('DATABASE_URL');
  
  // Якщо DATABASE_URL не встановлено - спробуємо SQLite
  if (!databaseUrl) {
    // SQLite для локальної розробки (може не працювати в Strapi 5)
    return {
      connection: {
        client: 'better-sqlite3',
        connection: {
          filename: path.join(__dirname, '..', '.tmp', 'data.db'),
        },
        useNullAsDefault: true,
      },
    };
  }

  // PostgreSQL (для dev або prod)
  // ✅ ВАЖЛИВО: Використовуй ОКРЕМУ базу для dev і prod!
  // Для dev: створи окрему PostgreSQL базу на Railway
  // Для prod: використовуй production базу
  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString: databaseUrl,
        ssl: env.bool('DATABASE_SSL', true) // Railway завжди вимагає SSL
          ? { rejectUnauthorized: false } // Railway вимагає SSL без перевірки сертифіката
          : false,
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
