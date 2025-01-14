/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: [ 'en', 'pt', 'es' ], // Idiomas suportados
    defaultLocale: 'en', // Idioma padrão
  },
};

export default nextConfig;
