import React from 'react';

const Cell = ( { value, isClue, onCellChange, isValid } ) => {
    const handleChange = ( e ) => {
        const newValue = e.target.value;
        if ( newValue === "" || /^[1-9]$/.test( newValue ) ) {
            onCellChange( newValue );
        }
    };

    return (
        <input
            type="text"
            className={ `cell ${ isClue ? 'clue' : '' } ${ isValid === false ? 'invalid' : '' }` }
            value={ value === 0 ? '' : value }
            onChange={ handleChange }
            disabled={ isClue }
            maxLength="1"
            tabIndex={ isClue ? -1 : 0 }
        />
    );
};

export default Cell;