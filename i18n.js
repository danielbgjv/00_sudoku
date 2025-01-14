import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Configuração do i18next
i18n
    .use( HttpBackend ) // Carrega traduções a partir de arquivos JSON
    .use( LanguageDetector ) // Detecta o idioma do navegador
    .use( initReactI18next ) // Integra com React
    .init( {
        fallbackLng: "en", // Idioma padrão
        supportedLngs: [ "en", "pt", "es" ], // Idiomas suportados
        backend: {
            loadPath: "/locales/{{lng}}.json", // Caminho para os arquivos de tradução
        },
        interpolation: {
            escapeValue: false, // React já escapa valores por padrão
        },
        detection: {
            order: [ "querystring", "cookie", "localStorage", "navigator" ], // Ordem de detecção do idioma
            caches: [ "cookie", "localStorage" ], // Onde salvar o idioma detectado
        },
    } );

export default i18n;
