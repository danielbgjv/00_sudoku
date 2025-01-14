import React from 'react';
import Cell from './Cell';

const Board = ( { board, handleCellChange, isValid } ) => {
    return (
        <div className="board">
            { board.map( ( row, rowIndex ) => (
                <div className="row" key={ rowIndex }>
                    { row.map( ( cell, colIndex ) => (
                        <Cell
                            key={ `${ rowIndex }-${ colIndex }` }
                            value={ cell }
                            isClue={ board[ rowIndex ][ colIndex ] !== 0 }
                            onCellChange={ ( newValue ) =>
                                handleCellChange( rowIndex, colIndex, parseInt( newValue ) || 0 )
                            }
                            isValid={ isValid && isValid[ rowIndex ] && isValid[ rowIndex ][ colIndex ] }
                        />
                    ) ) }
                </div>
            ) ) }
        </div>
    );
};

export default Board;