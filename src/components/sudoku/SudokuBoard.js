import { useState, useEffect } from 'react';
import { isBoardCorrect } from '@/utils/sudokuGenerator';
import { useTranslation } from 'react-i18next';
import { saveEncryptedToLocalStorage, getDecryptedFromLocalStorage } from '@/utils/functions';
import { track } from '@vercel/analytics';

export default function SudokuBoard( { puzzle, solution, onComplete, savedGame, showModal2, setShowModal2, canShowErrors, handlePayment } ) {
  const [ board, setBoard ] = useState( savedGame?.board?.map( ( row ) => [ ...row ] ) || [] ); // Armazena o estado atual do tabuleiro
  const [ selectedCell, setSelectedCell ] = useState( null ); // Armazena a célula selecionada
  const { t } = useTranslation( 'common' );
  const [ errors, setErrors ] = useState( [] );
  const [ showErrors, setShowErrors ] = useState( false );
  const [ useSavedGame, setUseSavedGame ] = useState( true );

  useEffect( () => {
    if ( canShowErrors ) {
      const newErrors = [];
      board.forEach( ( row, rowIndex ) => {
        row.forEach( ( cell, colIndex ) => {
          // Verifica se o valor não é 0 (vazio) e está incorreto
          if ( cell !== 0 && cell !== solution[ rowIndex ][ colIndex ] ) {
            newErrors.push( { rowIndex, colIndex } );
          }
        } );
      } );

      setErrors( newErrors );
      setShowErrors( true );
    }
    //eslint-disable-next-line
  }, [ canShowErrors ] );


  const toggleErrors = () => {

    track( 'Check Errors' );


    if ( !savedGame?.config?.showErrors ) {
      handlePayment();
      setShowModal2( true );
      return;
    }

    if ( !showErrors ) {
      // Identifica erros apenas quando ativar a exibição
      const newErrors = [];

      board.forEach( ( row, rowIndex ) => {
        row.forEach( ( cell, colIndex ) => {
          // Verifica se o valor não é 0 (vazio) e está incorreto
          if ( cell !== 0 && cell !== solution[ rowIndex ][ colIndex ] ) {
            newErrors.push( { rowIndex, colIndex } );
          }
        } );
      } );

      setErrors( newErrors );
    }

    // Alterna a exibição dos erros
    setShowErrors( !showErrors );
  };



  useEffect( () => {

    if ( savedGame && useSavedGame ) {
      const savedCopy = savedGame.board.map( ( row ) => [ ...row ] );
      setBoard( savedCopy ); // Define o estado com o jogo salvo
      //setUseSavedGame( false ); // Evita que este bloco seja reexecutado
    } else {
      const boardCopy = puzzle.map( ( row ) => [ ...row ] );
      setBoard( boardCopy ); // Define o estado com um novo tabuleiro
    }
    //eslint-disable-next-line
  }, [ useSavedGame, puzzle ] ); // Incluímos `useSavedGame` e `puzzle` nas dependências.


  useEffect( () => {
    if ( board.length ) {
      const gameState = {
        puzzle,
        board, // Salva o estado atual do tabuleiro
        solution,
      };
      /* localStorage.setItem( 'sudoku', JSON.stringify( gameState ) ); */
      saveEncryptedToLocalStorage( 'sudoku', gameState );
    }
    //eslint-disable-next-line
  }, [ board ] ); // Salva no localStorage sempre que o tabuleiro muda

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
              const isError =
                showErrors &&
                errors.some(
                  ( error ) => error.rowIndex === rowIndex && error.colIndex === colIndex
                );


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
                    isFixed ? '!bg-gray-700' : isError ? '!bg-red-500' : 'bg-gray-800', // Destaca células incorretas
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
                /* onClick={ () =>{ 
                  handleChange( selectedCell.rowIndex, selectedCell.colIndex, number );
                 }} */

                onClick={ () => {
                  handleChange( selectedCell.rowIndex, selectedCell.colIndex, number );
                  // Atualiza o estado do tabuleiro imediatamente na lógica local
                  const updatedBoard = board.map( ( row, rowIndex ) =>
                    rowIndex === selectedCell.rowIndex
                      ? row.map( ( cell, colIndex ) =>
                        colIndex === selectedCell.colIndex ? number : cell
                      )
                      : row
                  );

                  // Verifica se é o último número a ser preenchido (ou seja, nenhum zero no tabuleiro atualizado)
                  const isLastZero = !updatedBoard.some( ( row ) => row.includes( 0 ) );

                  // Atualiza o estado para refletir o número inserido
                  setBoard( updatedBoard );

                  // Se for o último número, chama a função checkSolution
                  if ( isLastZero ) {
                    const isCorrect = isBoardCorrect( updatedBoard, solution );
                    if ( isCorrect ) {
                      onComplete(); // Sucesso
                    } else {
                      alert( t( 'errorsMessage' ) ); // Erro
                    }
                  }
                } }
              >
                { number }
              </button>
            ) ) }
            <div>
              <button
                className="p-1 flex items-center justify-center bg-red-700 hover:bg-red-600 text-white rounded-md"
                onClick={ () => {
                  handleChange( selectedCell.rowIndex, selectedCell.colIndex, 0 );
                } }
              >
                { t( 'clear' ) }
              </button>
            </div>
          </div>
        ) }
      </div>

      {/*  <button
        onClick={ checkSolution }
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
      >
        { t( 'checkSudoku' ) }
      </button>*/}

      <button
        onClick={ toggleErrors }
        className={ `${ showErrors ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-4 py-2 rounded-md` }
      >
        { showErrors ? t( 'hideErrors' ) : t( 'checkErrors' ) }
      </button>
    </div>
  );
}
