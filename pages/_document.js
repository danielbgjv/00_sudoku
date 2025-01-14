import en from "@/public/locales/en/common.json";
import pt from "@/public/locales/pt/common.json";
import es from "@/public/locales/es/common.json";

import { Html, Head, Main, NextScript } from "next/document";

export default function Document( { lang, translations } ) {
  return (
    <Html lang={ lang || "en" }>
      <Head>
        {/* Meta Básicos */ }
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content={ translations.description } />
        <meta name="keywords" content={ translations.keywords } />
        <meta name="author" content="SudokuDan" />

        {/* Open Graph para Redes Sociais */ }
        <meta property="og:type" content="website" />
        <meta property="og:title" content={ translations.title } />
        <meta property="og:description" content={ translations.description } />
        <meta property="og:url" content="https://sudokodan.vercel.app" />
        <meta property="og:image" content="https://sudokodan.vercel.app/logo.png" />
        <meta property="og:site_name" content="SudokuDan" />

        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Twitter Meta Tags */ }
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ translations.title } />
        <meta name="twitter:description" content={ translations.description } />
        <meta name="twitter:image" content="https://sudokodan.vercel.app/logo.png" />

        {/* Meta Adicionais */ }
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://sudokodan.vercel.app" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async ( ctx ) => {
  const initialProps = await ctx.defaultGetInitialProps( ctx );

  const lang = ctx.locale || "en"; // Pega o idioma da configuração i18n
  const translations = {
    en,
    pt,
    es,
  }[ lang ] || en; // Traduções com fallback para inglês

  console.log( "lang", lang );

  return {
    ...initialProps,
    lang,
    translations,
  };
};




// Detecta o idioma do usuário e seleciona as traduções apropriadas
/* Document.getInitialProps = async ( ctx ) => {
  const initialProps = await ctx.defaultGetInitialProps( ctx );

  const req = ctx.req;
  const acceptLanguage = req?.headers[ "accept-language" ];
  let lang = "en"; // Idioma padrão

  if ( acceptLanguage ) {
    const supportedLanguages = [ "en", "pt", "es" ];
    const preferredLanguage = acceptLanguage.split( "," )[ 0 ].split( "-" )[ 0 ];
    if ( supportedLanguages.includes( preferredLanguage ) ) {
      lang = preferredLanguage;
    }
  }

  // Seleciona as traduções apropriadas com base no idioma
  const translations = {
    en,
    pt,
    es,
  }[ lang ];

  return {
    ...initialProps,
    lang,
    translations,
  };
};
 */