// pages/sudoku/index.js
import { useState, useEffect } from 'react';
import { generateSudoku, clearUserInput } from '@/utils/sudokuGenerator';
import SudokuBoard from '@/src/components/sudoku/SudokuBoard';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import LanguageSwitcher from '@/src/components/LanguageSwitcher';
import Image from 'next/image';
import useLocalStorage from '@/utils/useLocalStorage';

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
  const [ startNewGame, setStartNewGame ] = useState( '' );
  const [ completedMessage, setCompletedMessage ] = useState( '' );
  const [ close, setClose ] = useState( '' );
  const [ currentBoard, setCurrentBoard ] = useState( null );

  const getSavedGame = useLocalStorage( 'sudoku' );
  const savedGame = getSavedGame && JSON.parse( getSavedGame );
  const [ showSavedGame, setShowSavedGame ] = useState( true );
  const [ hasSavedGame, setHasSavedGame ] = useState( false );

  useEffect( () => {
    const getSavedGame = localStorage.getItem( 'sudoku' );
    const savedGame = getSavedGame ? JSON.parse( getSavedGame ) : null;

    if ( savedGame && savedGame.board && savedGame.puzzle && savedGame.solution ) {
      setHasSavedGame( true ); // Há um jogo salvo válido
    } else {
      setHasSavedGame( false ); // Não há jogo salvo válido
    }
  }, [] );

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
      setClose( t( 'close' ) );
      setStartNewGame( t( 'startNewGame' ) );
    }
  }, [ t ] );


  const startGame = () => {
    localStorage.removeItem( 'sudoku' ); // Remove o jogo salvo
    const { puzzle, solution } = generateSudoku( difficulty );
    setGame( { puzzle, solution } );
    setShowModal( false );
    setCurrentBoard( puzzle.map( row => [ ...row ] ) ); // Copia do puzzle inicial
    localStorage.setItem(
      'sudoku',
      JSON.stringify( { puzzle, solution, board: puzzle.map( row => [ ...row ] ) } ) // Adiciona o estado atual do board ao localStorage
    );
    setHasSavedGame( false ); // Invalida o jogo salvo
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
        <Image src="/logo.png" width={ 100 } height={ 100 } alt="Sudoku" />
        <h1 className="text-3xl font-bold mb-6 px-3 text-center mt-5">{ title }</h1>

        {
          hasSavedGame && showSavedGame && (
            <div className="mb-4 px-3">
              <h1 className="text-2xl font-bold mb-4 text-center p-3 rounded-md bg-gray-700 border border-white">{ t( 'savedGame' ) }</h1>

              <div className='flex items-center justify-center gap-5'>
                <button
                  onClick={ () => {
                    const { puzzle, solution, board } = savedGame;
                    setGame( { puzzle, solution } );
                    setCurrentBoard( board ); // Define o board salvo como atual
                    setShowModal( false );
                    setShowSavedGame( false );
                    setHasSavedGame( false ); // Invalida o jogo salvo
                  } }
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                >
                  { t( 'continue' ) }
                </button>

                <button
                  onClick={ () => {
                    localStorage.removeItem( 'sudoku' ); // Remove o jogo salvo
                    //clearUserInput( savedGame.puzzle ); // Limpa as células preenchidas pelo usuário
                    //startGame(); // Reinicia o jogo
                    //setShowSavedGame( false );
                    setHasSavedGame( false ); // Atualiza o estado local
                  } }
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                >
                  { t( 'restart' ) }
                </button>
              </div>
            </div>
          )
        }

        { !hasSavedGame &&
          <>
            { !savedGame &&
              <div className="mb-4 flex gap-4">
                <div className='px-3'>
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
            }
            { game && (
              <SudokuBoard
                puzzle={ game.puzzle }
                solution={ game.solution }
                onComplete={ handleComplete }
                savedGame={ savedGame }
              />
            ) }
            { game &&
              <button onClick={ () => { localStorage.removeItem( 'sudoku' ); setHasSavedGame( false ); setGame( null ); } } className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white mt-5">
                { t( 'newGame' ) }
              </button> }
          </> }

        <LanguageSwitcher />

        {/* Modal de Parabéns */ }
        { showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white text-black p-8 rounded-md">
              <h2 className="text-2xl font-bold mb-4">{ congratulations }</h2>
              <p className="mb-4">{ completedMessage }</p>
              <div className='flex items-center justify-center'>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={ () => setShowModal( false ) }
                >
                  { close }
                </button>

                {/* //botão de novo jogo */ }
                <button
                  onClick={ () => { localStorage.removeItem( 'sudoku' ); setHasSavedGame( false ); setGame( null ); } }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  { startNewGame }
                </button>
              </div>
            </div>
          </div>
        ) }
      </div >
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