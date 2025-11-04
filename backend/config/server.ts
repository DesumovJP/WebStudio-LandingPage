export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8080),
  url: env('PUBLIC_URL', 'https://your-app-name.up.railway.app'), // заміни на свій домен
  app: {
    keys: env.array('APP_KEYS'),
  },
});
