const isProd = process.env.NODE_ENV === 'production';

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    autoprefixer: {},
    ...(isProd ? { cssnano: {} } : {}),
  },
};
