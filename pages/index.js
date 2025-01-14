// pages/sudoku/index.js
import { useState } from 'react';
import { generateSudoku } from '@/utils/sudokuGenerator';
import SudokuBoard from '@/src/components/sudoku/SudokuBoard';

export default function SudokuPage() {
  const [ difficulty, setDifficulty ] = useState( 'easy' );
  const [ game, setGame ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );

  const startGame = () => {
    const { puzzle, solution } = generateSudoku( difficulty );
    setGame( { puzzle, solution } );
    setShowModal( false );
  };

  const handleComplete = () => {
    setShowModal( true );
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">Sudo Kudan</h1>

      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="difficulty" className="mr-2 font-semibold">
            Dificuldade:
          </label>
          <select
            id="difficulty"
            value={ difficulty }
            onChange={ ( e ) => setDifficulty( e.target.value ) }
            className="bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white rounded"
          >
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>
        <button
          onClick={ startGame }
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Iniciar
        </button>
      </div>

      { game && (
        <SudokuBoard
          puzzle={ game.puzzle }
          solution={ game.solution }
          onComplete={ handleComplete }
        />
      ) }

      {/* Modal de Parabéns */ }
      { showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white text-black p-8 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Parabéns!</h2>
            <p className="mb-4">Você concluiu o Sudoku sem erros!</p>
            <div className='flex items-center justify-center'>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={ () => setShowModal( false ) }
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
}
