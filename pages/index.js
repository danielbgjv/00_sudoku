// pages/sudoku/index.js
import { useState, useEffect } from 'react';
import { generateSudoku } from '@/utils/sudokuGenerator';
import SudokuBoard from '@/src/components/sudoku/SudokuBoard';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import LanguageSwitcher from '@/src/components/LanguageSwitcher';

export default function SudokuPage() {
  const [ difficulty, setDifficulty ] = useState( 'easy' );
  const [ game, setGame ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const { t } = useTranslation( 'common' ); // Use o namespace 'common'
  const [ title, setTitle ] = useState( '' );
  const [ difficul, setDifficul ] = useState( '' );
  const [ easy, setEasy ] = useState( '' );
  const [ medium, setMedium ] = useState( '' );
  const [ hard, setHard ] = useState( '' );
  const [ startGame1, setStartGame1 ] = useState( '' );
  const [ congratulations, setCongratulations ] = useState( '' );
  const [ completedMessage, setCompletedMessage ] = useState( '' );
  const [ close, setClose ] = useState( '' );

  useEffect( () => {

    if ( t ) {
      setTitle( t( 'title' ) );
      setDifficul( t( 'difficulty' ) );
      setEasy( t( 'easy' ) );
      setMedium( t( 'medium' ) );
      setHard( t( 'hard' ) );
      setStartGame1( t( 'startGame' ) );
      setCongratulations( t( 'congratulations' ) );
      setCompletedMessage( t( 'completedMessage' ) );
    }
  }, [ t ] );


  const startGame = () => {
    const { puzzle, solution } = generateSudoku( difficulty );
    setGame( { puzzle, solution } );
    setShowModal( false );
  };

  const handleComplete = () => {
    setShowModal( true );
  };

  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center pt-10">
        <h1 className="text-3xl font-bold mb-6">{ title }</h1>
        <div className="mb-4 flex gap-4">
          <div>
            <label htmlFor="difficulty" className="mr-2 font-semibold">
              { difficul }:
            </label>
            <select
              id="difficulty"
              value={ difficulty }
              onChange={ ( e ) => setDifficulty( e.target.value ) }
              className="bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white rounded"
            >
              <option value="easy">{ easy }</option>
              <option value="medium">{ medium }</option>
              <option value="hard">{ hard }</option>
            </select>
          </div>
          <button
            onClick={ startGame }
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            { startGame1 }
          </button>
        </div>

        { game && (
          <SudokuBoard
            puzzle={ game.puzzle }
            solution={ game.solution }
            onComplete={ handleComplete }
          />
        ) }

        <LanguageSwitcher />

        {/* Modal de Parabéns */ }
        { showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white text-black p-8 rounded-md">
              <h2 className="text-2xl font-bold mb-4">{ congratulations }</h2>
              <p className="mb-4">{ completedMessage }</p>
              <div className='flex items-center justify-center'>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={ () => setShowModal( false ) }
                >
                  { close }
                </button>
              </div>
            </div>
          </div>
        ) }
      </div>
    </>
  );
}

// Adicione suporte a tradução no SSR
export async function getStaticProps( { locale } ) {
  return {
    props: {
      ...( await serverSideTranslations( locale, [ 'common' ] ) ),
    },
  };
}