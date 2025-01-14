// components/SudokuBoard.js
import { useState, useEffect } from 'react';
import { isBoardCorrect } from '@/utils/sudokuGenerator';
import { useTranslation } from 'react-i18next';

export default function SudokuBoard( { puzzle, solution, onComplete } ) {
  const [ board, setBoard ] = useState( [] );
  const { t } = useTranslation( 'common' ); // Use o namespace 'common'

  useEffect( () => {
    // Copiar o puzzle inicial para o state
    const boardCopy = puzzle.map( row => [ ...row ] );
    setBoard( boardCopy );
  }, [ puzzle ] );

  const handleChange = ( rowIndex, colIndex, value ) => {
    const newBoard = board.map( row => [ ...row ] );
    const parsed = parseInt( value, 10 );

    if ( isNaN( parsed ) ) {
      newBoard[ rowIndex ][ colIndex ] = 0;
    } else {
      newBoard[ rowIndex ][ colIndex ] = parsed;
    }
    setBoard( newBoard );
  };

  const checkSolution = () => {
    if ( isBoardCorrect( board, solution ) ) {
      onComplete();
    } else {
      alert( t( 'errorsMessage' ) );
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="grid grid-cols-9 gap-1 bg-gray-900 p-2 rounded-md">

        { board.map( ( row, rowIndex ) =>
          row.map( ( cellValue, colIndex ) => {
            const originalValue = puzzle[ rowIndex ][ colIndex ];
            const isFixed = originalValue !== 0;

            return (
              <div
                key={ `${ rowIndex }-${ colIndex }` }
                className={ [
                  'w-10 h-10 flex items-center justify-center',
                  'border border-gray-600 bg-gray-800 text-white', // borda padrão
                  // Adiciona borda grossa horizontal (superior)
                  rowIndex % 3 === 0 && rowIndex !== 0 ? 'border-t-2 border-t-white' : '',
                  // Adiciona borda grossa vertical (esquerda)
                  colIndex % 3 === 0 && colIndex !== 0 ? 'border-l-2 border-l-white' : '',
                  // Remove borda duplicada entre células vizinhas
                  colIndex === 8 ? 'border-r-0' : '',
                  rowIndex === 8 ? 'border-b-0' : '',
                  isFixed ? 'bg-gray-700' : '', // destaca células fixas
                ].join( ' ' ) }
              >
                { isFixed ? (
                  <span className="font-bold">{ cellValue }</span>
                ) : (
                  <input
                    className="w-full h-full text-center bg-inherit outline-none no-spin"
                    type="number"
                    maxLength={ 1 }
                    value={ cellValue === 0 ? '' : cellValue }
                    onChange={ ( e ) => handleChange( rowIndex, colIndex, e.target.value ) }
                  />
                ) }
              </div>
            );
          } )
        ) }
      </div>

      <button
        onClick={ checkSolution }
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
      >
        { t( 'checkSudoku' ) }
      </button>
    </div>
  );
}
