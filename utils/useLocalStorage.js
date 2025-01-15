import { useState, useEffect } from 'react';

const useLocalStorage = ( storageName ) => {
    const [ localStorageValue, setLocalStorageValue ] = useState( null );

    useEffect( () => {
        // Verifica se o código está sendo executado no navegador
        if ( typeof window !== 'undefined' ) {
            setLocalStorageValue( localStorage?.getItem( storageName ) );

            const handleLocalStorageChange = () => {
                setLocalStorageValue( localStorage?.getItem( storageName ) );
            };

            // Usa setInterval para verificar mudanças no localStorage
            const interval = setInterval( handleLocalStorageChange, 1000 );

            return () => clearInterval( interval );
        }
    }, [ storageName ] );

    return localStorageValue;
};

export default useLocalStorage;
