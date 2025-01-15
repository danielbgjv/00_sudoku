import CryptoJS from 'crypto-js';

// Chave secreta para criptografia
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// Função para salvar dados encriptados no localStorage
export function saveEncryptedToLocalStorage( key, data ) {
    const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify( data ),
        SECRET_KEY
    ).toString();
    localStorage.setItem( key, encryptedData );
}

// Função para recuperar e desencriptar dados do localStorage
export function getDecryptedFromLocalStorage( encryptedData ) {

    if ( !encryptedData ) return null;

    try {
        const bytes = CryptoJS.AES.decrypt( encryptedData, SECRET_KEY );
        const decryptedData = JSON.parse( bytes.toString( CryptoJS.enc.Utf8 ) );
        return decryptedData;
    } catch ( e ) {


        try {

            const decryptedData = JSON.parse( encryptedData );
            return decryptedData;
        } catch ( e ) {
            console.error( 'Erro ao desencriptar os dados:', e );
            return null;
        }

    }
}
