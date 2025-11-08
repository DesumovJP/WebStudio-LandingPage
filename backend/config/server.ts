export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8080),
  url: env('PUBLIC_URL', 'https://webstudio-landingpage-production.up.railway.app'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
