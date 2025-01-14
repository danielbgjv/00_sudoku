import React from 'react';

const DifficultySelector = ( { onDifficultyChange, selectedDifficulty } ) => {
    return (
        <div className="difficulty-selector">
            <button
                onClick={ () => onDifficultyChange( 'easy' ) }
                className={ selectedDifficulty === 'easy' ? 'selected' : '' }
            >
                Fácil
            </button>
            <button
                onClick={ () => onDifficultyChange( 'medium' ) }
                className={ selectedDifficulty === 'medium' ? 'selected' : '' }
            >
                Médio
            </button>
            <button
                onClick={ () => onDifficultyChange( 'hard' ) }
                className={ selectedDifficulty === 'hard' ? 'selected' : '' }
            >
                Difícil
            </button>
        </div>
    );
};

export default DifficultySelector;