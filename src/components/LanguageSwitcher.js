import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
    const router = useRouter();

    const changeLanguage = ( lang ) => {
        router.push( router.pathname, router.asPath, { locale: lang } );
    };

    return (
        <div className="flex gap-2 mt-10">
            <button onClick={ () => changeLanguage( 'en' ) } className="px-4 py-2 bg-gray-600 hover:bg-black transition duration-300 text-white rounded">English</button>
            <button onClick={ () => changeLanguage( 'pt' ) } className="px-4 py-2 bg-gray-600 hover:bg-black transition duration-300 text-white rounded">Português</button>
            <button onClick={ () => changeLanguage( 'es' ) } className="px-4 py-2 bg-gray-600 hover:bg-black transition duration-300 text-white rounded">Español</button>
        </div>
    );
}
