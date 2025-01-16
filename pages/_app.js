import "@/styles/globals.css";
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '@/next-i18next.config';
import "../i18n";
import { Analytics } from "@vercel/analytics/react";

function App( { Component, pageProps } ) {
  return (
    <>
      <Analytics />
      <Component { ...pageProps } />;
    </> );
}

export default appWithTranslation( App, nextI18NextConfig );
