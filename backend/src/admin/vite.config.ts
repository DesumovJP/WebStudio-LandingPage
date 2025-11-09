import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      allowedHosts: [
        'webstudio-landingpage-production.up.railway.app',
        'localhost',
        '127.0.0.1',
        '.railway.app', // Allow all Railway subdomains
      ],
      host: '0.0.0.0', // Allow external connections
    },
  });
};

