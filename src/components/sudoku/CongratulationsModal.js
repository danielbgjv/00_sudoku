import React from 'react';

const CongratulationsModal = ( { isOpen, onClose } ) => {
    if ( !isOpen ) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Parabéns!</h2>
                <p>Você completou o Sudoku sem erros!</p>
                <button onClick={ onClose }>Jogar Novamente</button>
            </div>
        </div>
    );
};

export default CongratulationsModal;