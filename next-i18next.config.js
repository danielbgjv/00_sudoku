const path = require( 'path' );

module.exports = {
    i18n: {
        locales: [ 'en', 'pt', 'es' ],
        defaultLocale: 'en',
        localePath: path.resolve( './public/locales' ),
        react: { useSuspense: false },//this line
    },
};
