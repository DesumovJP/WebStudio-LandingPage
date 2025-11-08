export default ({ env }) => {
  const isDevelopment = env('NODE_ENV') !== 'production';
  const hasCloudinary = env('CLOUDINARY_NAME') && env('CLOUDINARY_KEY') && env('CLOUDINARY_SECRET');
  
  // Development: використовуй локальне зберігання, якщо Cloudinary не налаштовано
  // Production: використовуй Cloudinary
  const uploadProvider = (isDevelopment && !hasCloudinary) ? 'local' : 'cloudinary';
  
  return {
    upload: {
      config: {
        provider: uploadProvider,
        ...(uploadProvider === 'cloudinary' ? {
          providerOptions: {
            cloud_name: env('CLOUDINARY_NAME'),
            api_key: env('CLOUDINARY_KEY'),
            api_secret: env('CLOUDINARY_SECRET'),
          },
          actionOptions: {
            upload: {},
            delete: {},
          },
        } : {
          // Локальне зберігання для dev
          sizeLimit: 100 * 1024 * 1024, // 100MB
        }),
      },
    },
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET'),
      },
    },
    graphql: {
      config: {
        endpoint: '/graphql',
        shadowCRUD: true,
        playgroundAlways: isDevelopment, // Enable GraphQL playground in dev
        depthLimit: 7,
        amountLimit: 100,
        apolloServer: {
          tracing: isDevelopment,
        },
      },
    },
  };
};
  