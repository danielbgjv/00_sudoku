import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

export default async function handler( req, res ) {
    const name = "pay";
    const es_translation = "Pagar";
    const pt_translation = "Pagar";
    const en_translation = "Pay";

    try {
        // Caminho para os arquivos na pasta /public/locales
        const files = globSync( './public/locales/**/*.{json,js}' );
        const translations = {};

        files.forEach( ( file ) => {
            // Lê o conteúdo do arquivo
            console.log( "file", file );
            const filePath = path.resolve( file );
            let fileContent;

            if ( file.endsWith( '.js' ) ) {
                fileContent = require( filePath );
            } else {
                const fileData = fs.readFileSync( filePath, 'utf-8' );
                fileContent = JSON.parse( fileData );
            }

            // Identifica o idioma com base na estrutura do caminho do arquivo
            const normalizedFilePath = path.normalize( file ); // Normaliza o caminho para o sistema operacional atual
            let lang;

            if (
                normalizedFilePath.includes( path.normalize( 'public/locales/pt/' ) ) ||
                normalizedFilePath.includes( 'pt.json' )
            ) {
                lang = 'pt';
            } else if (
                normalizedFilePath.includes( path.normalize( 'public/locales/es/' ) ) ||
                normalizedFilePath.includes( 'es.json' )
            ) {
                lang = 'es';
            } else if (
                normalizedFilePath.includes( path.normalize( 'public/locales/en/' ) ) ||
                normalizedFilePath.includes( 'en.json' )
            ) {
                lang = 'en';
            }

            console.log( lang );

            translations[ lang ] = fileContent;

            // Verifica se a chave existe
            if ( !fileContent[ name ] ) {
                // Adiciona a chave com a tradução padrão
                const defaultTranslations = {
                    en: en_translation,
                    es: es_translation,
                    pt: pt_translation,
                };

                fileContent[ name ] = defaultTranslations[ lang ] || name;

                // Salva novamente o arquivo com a nova tradução
                if ( file.endsWith( '.json' ) ) {
                    fs.writeFileSync( filePath, JSON.stringify( fileContent, null, 2 ), 'utf-8' );
                } else if ( file.endsWith( '.js' ) ) {
                    // Converte o conteúdo para CommonJS e salva o arquivo
                    const moduleContent = `module.exports = ${ JSON.stringify( fileContent, null, 2 ) };`;
                    fs.writeFileSync( filePath, moduleContent, 'utf-8' );
                }
            }
        } );

        return res.status( 200 ).json( { message: "Translations updated", translations } );
    } catch ( error ) {
        console.error( 'Error updating translations:', error );
        return res.status( 500 ).json( { error: 'Failed to update translations' } );
    }
}
