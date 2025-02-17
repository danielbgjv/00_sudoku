// scoring.js
import { saveEncryptedToLocalStorage, getDecryptedFromLocalStorage } from './functions';

const SCORE_KEY = 'sudokuScore';

// Definição dos pontos por nível de dificuldade
const POINTS_BY_DIFFICULTY = {
    easy: 10,
    medium: 20,
    hard: 30,
};

/**
 * Recupera a pontuação atual do localStorage.
 * Se o valor recuperado não for um número válido (por conta de alteração ou corrupção),
 * retorna 0.
 */
export function getScore() {

    if ( typeof window === 'undefined' ) return 0;

    const encryptedScore = localStorage?.getItem( SCORE_KEY );
    const score = getDecryptedFromLocalStorage( encryptedScore );
    return typeof score === 'number' ? score : 0;
}

/**
 * Atualiza a pontuação com base no nível de dificuldade.
 * Soma os pontos correspondentes e salva o novo valor encriptado.
 */
export function updateScore( difficulty ) {
    const points = POINTS_BY_DIFFICULTY[ difficulty ] || 0;
    const currentScore = getScore();
    const newScore = currentScore + points;
    saveEncryptedToLocalStorage( SCORE_KEY, newScore );
    return newScore;
}

/**
 * Reinicia a pontuação (por exemplo, se o usuário desejar zerar seu histórico).
 */
export function resetScore() {
    saveEncryptedToLocalStorage( SCORE_KEY, 0 );
}
