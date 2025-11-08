export default ({ env }) => {
  const isDevelopment = env('NODE_ENV') !== 'production';
  
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', isDevelopment ? 1337 : 8080),
    url: env(
      'PUBLIC_URL',
      isDevelopment
        ? 'http://localhost:1337'
        : 'https://webstudio-landingpage-production.up.railway.app'
    ),
    app: {
      keys: env.array('APP_KEYS'),
    },
  };
};
