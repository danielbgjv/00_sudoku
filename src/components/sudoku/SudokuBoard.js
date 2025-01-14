import { useState, useEffect } from 'react';
import { isBoardCorrect } from '@/utils/sudokuGenerator';
import { useTranslation } from 'react-i18next';

export default function SudokuBoard( { puzzle, solution, onComplete } ) {
  const [ board, setBoard ] = useState( [] );
  const [ selectedCell, setSelectedCell ] = useState( null ); // Armazena a célula selecionada
  const { t } = useTranslation( 'common' );

  useEffect( () => {
    const boardCopy = puzzle.map( row => [ ...row ] );
    setBoard( boardCopy );
  }, [ puzzle ] );

  const handleChange = ( rowIndex, colIndex, value ) => {
    const newBoard = board.map( row => [ ...row ] );
    newBoard[ rowIndex ][ colIndex ] = value;
    setBoard( newBoard );
    setSelectedCell( null ); // Fecha o seletor após selecionar o número
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
      <div className="relative">
        {/* Tabuleiro */ }
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
                    'border border-gray-600 bg-gray-800 text-white',
                    rowIndex % 3 === 0 && rowIndex !== 0 ? 'border-t-2 border-t-white' : '',
                    colIndex % 3 === 0 && colIndex !== 0 ? 'border-l-2 border-l-white' : '',
                    colIndex === 8 ? 'border-r-0' : '',
                    rowIndex === 8 ? 'border-b-0' : '',
                    isFixed ? 'bg-gray-500' : 'bg-gray-800',
                  ].join( ' ' ) }
                  onClick={ () => {
                    if ( !isFixed ) setSelectedCell( { rowIndex, colIndex } );
                  } }
                >
                  { isFixed ? (
                    <span className="font-bold">{ cellValue }</span>
                  ) : (
                    <span>{ cellValue === 0 ? '' : cellValue }</span>
                  ) }
                </div>
              );
            } )
          ) }
        </div>

        {/* Selecionador de números */ }
        { selectedCell && (
          <div
            className="absolute bg-gray-800 border border-gray-600 p-2 rounded-md grid grid-cols-3 gap-2 min-w-[152px] max-w-[152px]"
            style={ {
              top: selectedCell.rowIndex < 4 ? `${ selectedCell.rowIndex * 44 }px` : `${ selectedCell.rowIndex * 44 + 44 }px`,
              left: selectedCell.colIndex < 4
                ? `${ selectedCell.colIndex * 44 + 44 + 84 }px`
                : `${ selectedCell.colIndex * 44 - 44 - 44 }px`,
              transform: selectedCell.rowIndex < 4 ? 'translate(-50%, 25%)' : 'translate(-50%, -120%)',
              zIndex: 10,
            } }


          >
            { Array.from( { length: 9 }, ( _, i ) => i + 1 ).map( number => (
              <button
                key={ number }
                className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                onClick={ () => handleChange( selectedCell.rowIndex, selectedCell.colIndex, number ) }
              >
                { number }
              </button>
            ) ) }
            <div>
              <button
                className="p-1 flex items-center justify-center bg-red-700 hover:bg-red-600 text-white rounded-md"
                onClick={ () => handleChange( selectedCell.rowIndex, selectedCell.colIndex, 0 ) }
              >
                { t( 'close' ) }
              </button>
            </div>
          </div>
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
